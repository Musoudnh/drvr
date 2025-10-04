export type ProjectStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Completed';
export type ProjectScenario = 'Base Case' | 'Best Case' | 'Downside Case';
export type ProjectVisibility = 'private_draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'active' | 'completed';
export type MilestoneStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Blocked';
export type ApprovalAction = 'approved' | 'rejected' | 'submitted' | 'revision_requested';
export type IdeaStatus = 'pitched' | 'converted' | 'rejected' | 'more_input_needed';

export interface RoadmapProject {
  id: string;
  user_id: string;
  header: string;
  description: string;
  completion_date: string | null;
  department: string;
  status: ProjectStatus;
  scenario: ProjectScenario;
  gl_accounts: string[];
  assigned_users: string[];
  budget_total: number;
  actual_total: number;
  budget_base_case: number;
  budget_best_case: number;
  budget_downside_case: number;
  fiscal_year: number;
  project_visibility: ProjectVisibility;
  submitted_at: string | null;
  approved_at: string | null;
  attachments: Attachment[];
  version: number;
  created_at: string;
  updated_at: string;
}

export interface RoadmapMilestone {
  id: string;
  project_id: string;
  name: string;
  target_date: string | null;
  owner: string;
  completion_percentage: number;
  status: MilestoneStatus;
  created_at: string;
  updated_at: string;
}

export interface RoadmapComment {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  mentions: string[];
  created_at: string;
  updated_at: string;
}

export interface RoadmapApproval {
  id: string;
  project_id: string;
  user_id: string;
  action: ApprovalAction;
  notes: string;
  created_at: string;
}

export interface RoadmapVersion {
  id: string;
  project_id: string;
  version_number: number;
  snapshot: RoadmapProject;
  changed_by: string;
  created_at: string;
}

export interface RoadmapIdea {
  id: string;
  user_id: string;
  title: string;
  description: string;
  department: string;
  upvotes: number;
  upvoted_by: string[];
  status: IdeaStatus;
  converted_to_project_id: string | null;
  admin_feedback: string;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploaded_at: string;
}

export interface ProjectWithDetails extends RoadmapProject {
  milestones?: RoadmapMilestone[];
  comments?: RoadmapComment[];
  approvals?: RoadmapApproval[];
}
