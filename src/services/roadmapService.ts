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
    const project = await this.getProjectById(projectId);
    if (!project) throw new Error('Project not found');

    const budget = project.budget_total || project.budget_base_case || 0;

    const { departmentService } = await import('./departmentService');
    const threshold = await departmentService.getApprovalThresholdForAmount(budget);

    if (!threshold) {
      throw new Error('No approval threshold found for this budget amount');
    }

    const now = new Date();
    const slaDeadline = new Date(now.getTime() + threshold.sla_hours * 60 * 60 * 1000);

    await departmentService.createProjectApprovalWorkflow({
      project_id: projectId,
      threshold_tier_id: threshold.id,
      current_step: 1,
      total_steps: threshold.required_roles.length,
      required_approvers: threshold.required_roles,
      completed_approvers: [],
      pending_approvers: threshold.required_roles,
      workflow_status: 'pending',
      submitted_at: now.toISOString(),
      completed_at: null,
      sla_deadline: slaDeadline.toISOString()
    });

    await this.createApproval({
      project_id: projectId,
      user_id: userId,
      action: 'submitted',
      notes: ''
    });

    await this.updateProject(projectId, {
      status: 'Pending Approval',
      project_visibility: 'submitted',
      submitted_at: now.toISOString()
    });
  },

  async approveProject(projectId: string, userId: string, userRole: string, notes: string = ''): Promise<void> {
    const { departmentService } = await import('./departmentService');
    const workflow = await departmentService.getProjectApprovalWorkflow(projectId);

    if (!workflow) {
      throw new Error('No approval workflow found for this project');
    }

    if (!workflow.pending_approvers.includes(userRole)) {
      throw new Error('User role not authorized to approve at this stage');
    }

    const completedApprovers = [...workflow.completed_approvers, userRole];
    const pendingApprovers = workflow.pending_approvers.filter(role => role !== userRole);
    const isFullyApproved = pendingApprovers.length === 0;

    await this.createApproval({
      project_id: projectId,
      user_id: userId,
      action: 'approved',
      notes
    });

    await departmentService.updateProjectApprovalWorkflow(workflow.id, {
      current_step: workflow.current_step + 1,
      completed_approvers: completedApprovers,
      pending_approvers: pendingApprovers,
      workflow_status: isFullyApproved ? 'approved' : 'in_progress',
      completed_at: isFullyApproved ? new Date().toISOString() : null
    });

    if (isFullyApproved) {
      await this.updateProject(projectId, {
        status: 'Approved',
        project_visibility: 'approved',
        approved_at: new Date().toISOString()
      });
    } else {
      await this.updateProject(projectId, {
        status: 'Pending Approval',
        project_visibility: 'under_review'
      });
    }
  },

  async rejectProject(projectId: string, userId: string, notes: string): Promise<void> {
    const { departmentService } = await import('./departmentService');
    const workflow = await departmentService.getProjectApprovalWorkflow(projectId);

    if (workflow) {
      await departmentService.updateProjectApprovalWorkflow(workflow.id, {
        workflow_status: 'rejected',
        completed_at: new Date().toISOString()
      });
    }

    await this.createApproval({
      project_id: projectId,
      user_id: userId,
      action: 'rejected',
      notes
    });

    await this.updateProject(projectId, {
      status: 'Rejected',
      project_visibility: 'rejected'
    });
  },

  async requestRevision(projectId: string, userId: string, notes: string): Promise<void> {
    const { departmentService } = await import('./departmentService');
    const workflow = await departmentService.getProjectApprovalWorkflow(projectId);

    if (workflow) {
      await departmentService.updateProjectApprovalWorkflow(workflow.id, {
        workflow_status: 'revision_requested'
      });
    }

    await this.createApproval({
      project_id: projectId,
      user_id: userId,
      action: 'revision_requested',
      notes
    });

    await this.updateProject(projectId, {
      status: 'Draft',
      project_visibility: 'private_draft'
    });
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

  async updateIdeaStatus(ideaId: string, status: string, adminFeedback: string = ''): Promise<RoadmapIdea> {
    const { data, error } = await supabase
      .from('roadmap_ideas')
      .update({
        status,
        admin_feedback: adminFeedback,
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
