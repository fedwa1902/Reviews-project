export type ReviewCategory = 'workspace' | 'access' | 'license';

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'in-review';

export type ReviewPriority = 'high' | 'medium' | 'low';

export type WorkspaceType = 'sharepoint' | 'teams' | 'onedrive';

export type PermissionLevel = 'Owner' | 'Member' | 'Viewer' | 'Guest';

export interface WorkspaceReviewItem {
  id: string;
  category: 'workspace';
  workspaceName: string;
  workspaceType: WorkspaceType;
  description: string;
  lastActivityDate: string;
  owner: string;
  memberCount: number;
  storageUsedGB: number;
  status: ReviewStatus;
  priority: ReviewPriority;
  dueDate: string;
  decision?: 'keep' | 'partial' | 'not-using';
  comment?: string;
  reviewedBy?: string;
}

export interface AccessMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  permission: PermissionLevel;
  department: string;
  lastAccess: string;
  decision: 'keep' | 'remove';
}

export interface AccessReviewItem {
  id: string;
  category: 'access';
  resourceName: string;
  resourceType: WorkspaceType;
  description: string;
  members: AccessMember[];
  status: ReviewStatus;
  priority: ReviewPriority;
  dueDate: string;
  comment?: string;
  reviewedBy?: string;
}

export type FeatureUsageLevel = 'active' | 'low' | 'inactive';

export interface LicenseFeature {
  name: string;
  lastUsed: string;
  usage: FeatureUsageLevel;
}

export interface LicenseReviewItem {
  id: string;
  category: 'license';
  licenseName: string;
  licenseType: string;
  costPerMonth: number;
  currency: string;
  lastUsedDate: string;
  usageDescription: string;
  usagePercent: number;
  assignedTo: string;
  features: LicenseFeature[];
  status: ReviewStatus;
  priority: ReviewPriority;
  dueDate: string;
  decision?: 'keep' | 'partial' | 'release';
  comment?: string;
  reviewedBy?: string;
}

export type ReviewItem = WorkspaceReviewItem | AccessReviewItem | LicenseReviewItem;

export interface ReviewUser {
  name: string;
  email: string;
  department: string;
  avatarUrl?: string;
}

/** Helper to extract display name from any review item */
export function getReviewTitle(item: ReviewItem): string {
  switch (item.category) {
    case 'workspace': return item.workspaceName;
    case 'access': return item.resourceName;
    case 'license': return item.licenseName;
  }
}

/** Helper to extract subtitle / description */
export function getReviewSubtitle(item: ReviewItem): string {
  switch (item.category) {
    case 'workspace': return 'Review if this workspace is still needed';
    case 'access': return 'Review who should have access';
    case 'license': return 'Review if you still need this license';
  }
}

/** Helper to build the "review kind" label */
export function getReviewCategoryLabel(item: ReviewItem): string {
  switch (item.category) {
    case 'workspace': return 'Workspace Review';
    case 'access': return 'Access Review';
    case 'license': return 'License Review';
  }
}
