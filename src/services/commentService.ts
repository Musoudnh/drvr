import { supabase } from '../lib/supabase';
import type {
  ForecastComment,
  ChangeRequest,
  ActivityLog,
  UserRoleRecord,
  NotificationPreferences,
  Notification,
  CommentFilter,
  UserRole,
  ChangeRequestStatus,
} from '../types/comment';

export const commentService = {
  async getCommentsByCell(cellReference: string): Promise<ForecastComment[]> {
    const { data, error } = await supabase
      .from('forecast_comments')
      .select('*')
      .eq('cell_reference', cellReference)
      .is('parent_id', null)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const commentsWithReplies = await Promise.all(
      (data || []).map(async (comment) => {
        const replies = await this.getReplies(comment.id);
        return { ...comment, replies };
      })
    );

    return commentsWithReplies;
  },

  async getReplies(parentId: string): Promise<ForecastComment[]> {
    const { data, error } = await supabase
      .from('forecast_comments')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createComment(comment: {
    forecast_id?: string;
    cell_reference: string;
    content: string;
    mentions?: string[];
    parent_id?: string;
    author_id: string;
  }): Promise<ForecastComment> {
    console.log('Creating comment with data:', {
      forecast_id: comment.forecast_id,
      cell_reference: comment.cell_reference,
      content: comment.content,
      mentions: comment.mentions || [],
      parent_id: comment.parent_id,
      author_id: comment.author_id,
    });

    const { data, error } = await supabase
      .from('forecast_comments')
      .insert({
        forecast_id: comment.forecast_id,
        cell_reference: comment.cell_reference,
        content: comment.content,
        mentions: comment.mentions || [],
        parent_id: comment.parent_id,
        author_id: comment.author_id,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating comment:', error);
      throw new Error(`Failed to create comment: ${error.message} (${error.code})`);
    }

    await this.logActivity({
      forecast_id: comment.forecast_id,
      activity_type: 'comment',
      actor_id: comment.author_id,
      target_id: data.id,
      cell_reference: comment.cell_reference,
      description: `Added comment on ${comment.cell_reference}`,
      metadata: { comment_id: data.id },
    });

    if (comment.mentions && comment.mentions.length > 0) {
      await this.createMentionNotifications(data.id, comment.mentions, comment.author_id);
    }

    return data;
  },

  async updateComment(
    id: string,
    updates: { content?: string; is_resolved?: boolean }
  ): Promise<ForecastComment> {
    const { data, error } = await supabase
      .from('forecast_comments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteComment(id: string): Promise<void> {
    const { error } = await supabase.from('forecast_comments').delete().eq('id', id);

    if (error) throw error;
  },

  async getFilteredComments(filter: CommentFilter): Promise<ForecastComment[]> {
    let query = supabase.from('forecast_comments').select('*').is('parent_id', null);

    if (filter.user_id) {
      query = query.eq('author_id', filter.user_id);
    }

    if (filter.date_from) {
      query = query.gte('created_at', filter.date_from);
    }

    if (filter.date_to) {
      query = query.lte('created_at', filter.date_to);
    }

    if (filter.is_resolved !== undefined) {
      query = query.eq('is_resolved', filter.is_resolved);
    }

    if (filter.category) {
      query = query.ilike('cell_reference', `%${filter.category}%`);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    const commentsWithReplies = await Promise.all(
      (data || []).map(async (comment) => {
        const replies = await this.getReplies(comment.id);
        return { ...comment, replies };
      })
    );

    return commentsWithReplies;
  },

  async createChangeRequest(request: {
    forecast_id?: string;
    cell_reference: string;
    current_value?: number;
    proposed_value: number;
    justification: string;
    requester_id: string;
  }): Promise<ChangeRequest> {
    const { data, error } = await supabase
      .from('forecast_change_requests')
      .insert({
        forecast_id: request.forecast_id,
        cell_reference: request.cell_reference,
        current_value: request.current_value,
        proposed_value: request.proposed_value,
        justification: request.justification,
        requester_id: request.requester_id,
      })
      .select()
      .single();

    if (error) throw error;

    await this.logActivity({
      forecast_id: request.forecast_id,
      activity_type: 'change_request',
      actor_id: request.requester_id,
      target_id: data.id,
      cell_reference: request.cell_reference,
      description: `Requested change for ${request.cell_reference}`,
      metadata: { change_request_id: data.id },
    });

    await this.notifyApprovers(data.id);

    return data;
  },

  async reviewChangeRequest(
    id: string,
    review: {
      status: ChangeRequestStatus;
      reviewer_id: string;
      review_notes?: string;
    }
  ): Promise<ChangeRequest> {
    const { data, error } = await supabase
      .from('forecast_change_requests')
      .update({
        status: review.status,
        reviewer_id: review.reviewer_id,
        review_notes: review.review_notes,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await this.logActivity({
      forecast_id: data.forecast_id,
      activity_type: 'approval',
      actor_id: review.reviewer_id,
      target_id: data.id,
      cell_reference: data.cell_reference,
      description: `${review.status === 'approved' ? 'Approved' : 'Rejected'} change request for ${data.cell_reference}`,
      metadata: { change_request_id: data.id, status: review.status },
    });

    await this.notifyRequester(data);

    return data;
  },

  async getChangeRequests(status?: ChangeRequestStatus): Promise<ChangeRequest[]> {
    let query = supabase.from('forecast_change_requests').select('*');

    if (status) {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getActivityLog(forecastId?: string, limit = 50): Promise<ActivityLog[]> {
    let query = supabase.from('forecast_activity_log').select('*');

    if (forecastId) {
      query = query.eq('forecast_id', forecastId);
    }

    query = query.order('created_at', { ascending: false }).limit(limit);

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async logActivity(activity: {
    forecast_id?: string;
    activity_type: string;
    actor_id: string;
    target_id?: string;
    cell_reference?: string;
    description: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    const { error } = await supabase.from('forecast_activity_log').insert({
      forecast_id: activity.forecast_id,
      activity_type: activity.activity_type,
      actor_id: activity.actor_id,
      target_id: activity.target_id,
      cell_reference: activity.cell_reference,
      description: activity.description,
      metadata: activity.metadata || {},
    });

    if (error) console.error('Error logging activity:', error);
  },

  async getUserRole(userId: string): Promise<UserRole> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return (data?.role as UserRole) || 'viewer';
  },

  async setUserRole(userId: string, role: UserRole, scope?: string): Promise<UserRoleRecord> {
    const { data, error } = await supabase
      .from('user_roles')
      .upsert(
        {
          user_id: userId,
          role,
          scope,
        },
        { onConflict: 'user_id,scope' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return await this.createDefaultPreferences(userId);
    }

    return data;
  },

  async createDefaultPreferences(userId: string): Promise<NotificationPreferences> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .insert({
        user_id: userId,
        email_enabled: true,
        in_app_enabled: true,
        mention_alerts: true,
        comment_alerts: true,
        weekly_digest: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateNotificationPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .update(preferences)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getNotifications(userId: string, unreadOnly = false): Promise<Notification[]> {
    let query = supabase.from('notifications').select('*').eq('user_id', userId);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async markNotificationRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw error;
  },

  async markAllNotificationsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  },

  async createMentionNotifications(
    commentId: string,
    mentionedUserIds: string[],
    authorId: string
  ): Promise<void> {
    const notifications = mentionedUserIds.map((userId) => ({
      user_id: userId,
      type: 'mention',
      title: 'You were mentioned',
      message: 'You were mentioned in a forecast comment',
      link: `/forecasting?comment=${commentId}`,
    }));

    const { error } = await supabase.from('notifications').insert(notifications);

    if (error) console.error('Error creating mention notifications:', error);
  },

  async notifyApprovers(changeRequestId: string): Promise<void> {
    const { data: approvers, error: approverError } = await supabase
      .from('user_roles')
      .select('user_id')
      .in('role', ['approver', 'admin']);

    if (approverError || !approvers) return;

    const notifications = approvers.map((approver) => ({
      user_id: approver.user_id,
      type: 'change_request',
      title: 'New Change Request',
      message: 'A new forecast change request requires your review',
      link: `/forecasting?change_request=${changeRequestId}`,
    }));

    const { error } = await supabase.from('notifications').insert(notifications);

    if (error) console.error('Error notifying approvers:', error);
  },

  async notifyRequester(changeRequest: ChangeRequest): Promise<void> {
    const { error } = await supabase.from('notifications').insert({
      user_id: changeRequest.requester_id,
      type: 'approval',
      title: `Change Request ${changeRequest.status}`,
      message: `Your change request for ${changeRequest.cell_reference} has been ${changeRequest.status}`,
      link: `/forecasting?change_request=${changeRequest.id}`,
    });

    if (error) console.error('Error notifying requester:', error);
  },
};
