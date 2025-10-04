import { supabase } from '../lib/supabase';
import type {
  RoadmapProject,
  RoadmapMilestone,
  RoadmapComment,
  RoadmapApproval,
  RoadmapVersion,
  RoadmapIdea,
  ProjectWithDetails
} from '../types/roadmap';

export const roadmapService = {
  async getProjects(): Promise<RoadmapProject[]> {
    const { data, error } = await supabase
      .from('roadmap_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getProjectById(id: string): Promise<ProjectWithDetails | null> {
    const { data: project, error: projectError } = await supabase
      .from('roadmap_projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (projectError) throw projectError;
    if (!project) return null;

    const [milestones, comments, approvals] = await Promise.all([
      this.getMilestones(id),
      this.getComments(id),
      this.getApprovals(id)
    ]);

    return {
      ...project,
      milestones,
      comments,
      approvals
    };
  },

  async createProject(project: Omit<RoadmapProject, 'id' | 'created_at' | 'updated_at'>): Promise<RoadmapProject> {
    console.log('roadmapService.createProject called with:', project);

    const { data, error } = await supabase
      .from('roadmap_projects')
      .insert(project)
      .select()
      .single();

    console.log('Insert result:', { data, error });

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    try {
      await this.createVersion(data.id, 1, data, project.user_id);
      console.log('Version created successfully');
    } catch (versionError) {
      console.error('Error creating version (non-fatal):', versionError);
    }

    return data;
  },

  async updateProject(id: string, updates: Partial<RoadmapProject>): Promise<RoadmapProject> {
    console.log('roadmapService.updateProject called with:', { id, updates });

    const { data, error } = await supabase
      .from('roadmap_projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    console.log('Update result:', { data, error });

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }

    try {
      const newVersion = data.version + 1;
      await this.updateProjectVersion(id, newVersion);
      await this.createVersion(id, newVersion, data, data.user_id);
      console.log('Version updated successfully');
    } catch (versionError) {
      console.error('Error updating version (non-fatal):', versionError);
    }

    return data;
  },

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('roadmap_projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateProjectVersion(id: string, version: number): Promise<void> {
    const { error } = await supabase
      .from('roadmap_projects')
      .update({ version })
      .eq('id', id);

    if (error) throw error;
  },

  async getMilestones(projectId: string): Promise<RoadmapMilestone[]> {
    const { data, error } = await supabase
      .from('roadmap_milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('target_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createMilestone(milestone: Omit<RoadmapMilestone, 'id' | 'created_at' | 'updated_at'>): Promise<RoadmapMilestone> {
    const { data, error } = await supabase
      .from('roadmap_milestones')
      .insert(milestone)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateMilestone(id: string, updates: Partial<RoadmapMilestone>): Promise<RoadmapMilestone> {
    const { data, error } = await supabase
      .from('roadmap_milestones')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteMilestone(id: string): Promise<void> {
    const { error } = await supabase
      .from('roadmap_milestones')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getComments(projectId: string): Promise<RoadmapComment[]> {
    const { data, error } = await supabase
      .from('roadmap_comments')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createComment(comment: Omit<RoadmapComment, 'id' | 'created_at' | 'updated_at'>): Promise<RoadmapComment> {
    const { data, error } = await supabase
      .from('roadmap_comments')
      .insert(comment)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getApprovals(projectId: string): Promise<RoadmapApproval[]> {
    const { data, error } = await supabase
      .from('roadmap_approvals')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createApproval(approval: Omit<RoadmapApproval, 'id' | 'created_at'>): Promise<RoadmapApproval> {
    const { data, error } = await supabase
      .from('roadmap_approvals')
      .insert(approval)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async submitForApproval(projectId: string, userId: string): Promise<void> {
    await this.createApproval({
      project_id: projectId,
      user_id: userId,
      action: 'submitted',
      notes: ''
    });

    await this.updateProject(projectId, { status: 'Pending Approval' });
  },

  async approveProject(projectId: string, userId: string, notes: string = ''): Promise<void> {
    await this.createApproval({
      project_id: projectId,
      user_id: userId,
      action: 'approved',
      notes
    });

    await this.updateProject(projectId, { status: 'Approved' });
  },

  async rejectProject(projectId: string, userId: string, notes: string): Promise<void> {
    await this.createApproval({
      project_id: projectId,
      user_id: userId,
      action: 'rejected',
      notes
    });

    await this.updateProject(projectId, { status: 'Rejected' });
  },

  async getVersions(projectId: string): Promise<RoadmapVersion[]> {
    const { data, error } = await supabase
      .from('roadmap_versions')
      .select('*')
      .eq('project_id', projectId)
      .order('version_number', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createVersion(projectId: string, versionNumber: number, snapshot: any, changedBy: string): Promise<RoadmapVersion> {
    const { data, error } = await supabase
      .from('roadmap_versions')
      .insert({
        project_id: projectId,
        version_number: versionNumber,
        snapshot,
        changed_by: changedBy
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getIdeas(): Promise<RoadmapIdea[]> {
    const { data, error } = await supabase
      .from('roadmap_ideas')
      .select('*')
      .order('upvotes', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createIdea(idea: Omit<RoadmapIdea, 'id' | 'created_at' | 'updated_at' | 'upvotes' | 'upvoted_by'>): Promise<RoadmapIdea> {
    const { data, error } = await supabase
      .from('roadmap_ideas')
      .insert(idea)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async upvoteIdea(ideaId: string, userId: string): Promise<RoadmapIdea> {
    const { data: idea, error: fetchError } = await supabase
      .from('roadmap_ideas')
      .select('*')
      .eq('id', ideaId)
      .single();

    if (fetchError) throw fetchError;

    const upvotedBy = idea.upvoted_by || [];
    const hasUpvoted = upvotedBy.includes(userId);

    const newUpvotedBy = hasUpvoted
      ? upvotedBy.filter((id: string) => id !== userId)
      : [...upvotedBy, userId];

    const newUpvotes = hasUpvoted ? idea.upvotes - 1 : idea.upvotes + 1;

    const { data, error } = await supabase
      .from('roadmap_ideas')
      .update({
        upvotes: newUpvotes,
        upvoted_by: newUpvotedBy,
        updated_at: new Date().toISOString()
      })
      .eq('id', ideaId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async convertIdeaToProject(ideaId: string, userId: string): Promise<RoadmapProject> {
    const { data: idea, error: fetchError } = await supabase
      .from('roadmap_ideas')
      .select('*')
      .eq('id', ideaId)
      .single();

    if (fetchError) throw fetchError;

    const project = await this.createProject({
      user_id: userId,
      header: idea.title,
      description: idea.description,
      completion_date: null,
      department: idea.department,
      status: 'Draft',
      scenario: 'Base Case',
      gl_accounts: [],
      assigned_users: [userId],
      budget_total: 0,
      actual_total: 0,
      attachments: [],
      version: 1
    });

    await supabase
      .from('roadmap_ideas')
      .update({
        status: 'converted',
        converted_to_project_id: project.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', ideaId);

    return project;
  }
};
