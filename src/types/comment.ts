export type UserRole = 'viewer' | 'editor' | 'approver' | 'admin';

export type ChangeRequestStatus = 'pending' | 'approved' | 'rejected';

export type ActivityType = 'comment' | 'edit' | 'approval' | 'mention' | 'change_request';

export type NotificationType = 'mention' | 'comment' | 'approval' | 'digest' | 'change_request';

export interface ForecastComment {
  id: string;
  forecast_id?: string;
  cell_reference: string;
  content: string;
  mentions: string[];
  parent_id?: string;
  author_id: string;
  author_name?: string;
  author_email?: string;
  is_resolved: boolean;
  created_at: string;
  updated_at: string;
  replies?: ForecastComment[];
}

export interface ChangeRequest {
  id: string;
  forecast_id?: string;
  cell_reference: string;
  current_value?: number;
  proposed_value: number;
  justification: string;
  requester_id: string;
  requester_name?: string;
  status: ChangeRequestStatus;
  reviewer_id?: string;
  reviewer_name?: string;
  review_notes?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  forecast_id?: string;
  activity_type: ActivityType;
  actor_id: string;
  actor_name?: string;
  target_id?: string;
  cell_reference?: string;
  description: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  scope?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_enabled: boolean;
  in_app_enabled: boolean;
  mention_alerts: boolean;
  comment_alerts: boolean;
  weekly_digest: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface CommentFilter {
  user_id?: string;
  date_from?: string;
  date_to?: string;
  category?: string;
  is_resolved?: boolean;
}
