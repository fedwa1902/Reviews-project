import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useReviews } from '@/hooks/useReviews';
import { toast, Toaster } from 'sonner';
import {
  ArrowLeft,
  Globe,
  ShieldCheck,
  KeyRound,
  HardDrive,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  XCircle,
  Send,
  UserCheck,
  UserMinus,
  Check,
  X,
  Building2,
  Clock,
} from 'lucide-react';
import type {
  ReviewItem,
  ReviewCategory,
  ReviewPriority,
  WorkspaceReviewItem,
  AccessReviewItem,
  LicenseReviewItem,
  AccessMember,
  PermissionLevel,
  FeatureUsageLevel,
} from '@/types/review';
import { getReviewTitle, getReviewCategoryLabel } from '@/types/review';

/* ── Shared config ────────────────────────────────────────────── */
const priorityStyles: Record<ReviewPriority, string> = {
  high: 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  low: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
};

const categoryBadge: Record<ReviewCategory, { bg: string; text: string; border: string }> = {
  workspace: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-500/20' },
  access: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/20' },
  license: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/20' },
};

const categoryIcons: Record<ReviewCategory, React.ReactNode> = {
  workspace: <HardDrive className="h-6 w-6" />,
  access: <ShieldCheck className="h-6 w-6" />,
  license: <KeyRound className="h-6 w-6" />,
};

const categoryAccent: Record<ReviewCategory, string> = {
  workspace: 'bg-indigo-500',
  access: 'bg-emerald-500',
  license: 'bg-amber-500',
};

const usageBadge: Record<FeatureUsageLevel, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  low: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  inactive: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
};

function formatDueDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatRelative(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days < 0) return 'Today';
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
  return 'Over a year ago';
}

/* ── Radio option card ─────────────────────────────────────────── */
interface RadioOption {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  selectedBorder: string;
  selectedBg: string;
}

function RadioGroup({ options, selected, onChange }: {
  options: RadioOption[];
  selected: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      {options.map((opt) => {
        const active = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`w-full flex items-start gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-200 cursor-pointer
              ${active
                ? `${opt.selectedBg} ${opt.selectedBorder} ring-1 ring-offset-0`
                : 'border-border/60 hover:border-border hover:bg-muted/20'
              }`}
          >
            {/* Radio circle */}
            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all
              ${active ? 'border-indigo-500 bg-indigo-500' : 'border-muted-foreground/30'}`}>
              {active && <div className="h-2 w-2 rounded-full bg-white" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                {opt.icon}
                {opt.label}
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {opt.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ── Alert banner ──────────────────────────────────────────────── */
function AlertBanner({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 px-5 py-4">
      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-sm text-amber-800 dark:text-amber-300">{title}</p>
        <p className="text-sm text-amber-700 dark:text-amber-400/80 mt-0.5 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

/* ── Progress indicator ────────────────────────────────────────── */
function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full transition-colors ${
            i < current ? 'bg-indigo-500' : 'bg-muted'
          }`}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  WORKSPACE DETAIL                                            */
/* ══════════════════════════════════════════════════════════════ */
function WorkspaceDetail({ review, onSubmit }: {
  review: WorkspaceReviewItem;
  onSubmit: (decision: string, comment?: string) => void;
}) {
  const [decision, setDecision] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const isStale = (Date.now() - new Date(review.lastActivityDate).getTime()) > 90 * 86400000;

  const options: RadioOption[] = [
    {
      value: 'keep', label: 'Yes, actively using',
      description: 'This workspace is actively used for ongoing projects and collaboration',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      selectedBorder: 'border-indigo-400 ring-indigo-500/20', selectedBg: 'bg-indigo-50/50 dark:bg-indigo-500/5',
    },
    {
      value: 'partial', label: 'Partially using',
      description: 'Still needed but activity has decreased significantly',
      icon: <Sparkles className="h-4 w-4 text-amber-500" />,
      selectedBorder: 'border-indigo-400 ring-indigo-500/20', selectedBg: 'bg-indigo-50/50 dark:bg-indigo-500/5',
    },
    {
      value: 'not-using', label: 'No, not using',
      description: 'This workspace is no longer needed and can be archived or deleted',
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      selectedBorder: 'border-indigo-400 ring-indigo-500/20', selectedBg: 'bg-indigo-50/50 dark:bg-indigo-500/5',
    },
  ];

  return (
    <div className="space-y-6">
      {isStale && (
        <AlertBanner
          title="Review Required"
          message={`This workspace has been flagged due to low activity over the past 90 days. Please assess whether your team still needs this workspace.`}
        />
      )}

      {/* Question card */}
      <Card className="border-border/40">
        <CardContent className="pt-8 pb-8 px-8 space-y-6">
          <div className="text-center space-y-1.5">
            <h3 className="font-heading font-bold text-lg">Is your team still using this workspace?</h3>
            <p className="text-sm text-muted-foreground">Select the option that best describes the current usage</p>
          </div>
          <RadioGroup options={options} selected={decision} onChange={setDecision} />
        </CardContent>
      </Card>

      {/* Additional notes */}
      <Card className="border-border/40">
        <CardContent className="pt-6 pb-6 px-8 space-y-3">
          <h3 className="font-semibold text-sm">Additional Notes (optional)</h3>
          <Textarea
            placeholder="Explain your decision or add any relevant context..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[120px] bg-muted/20 border-border/40 resize-none"
            maxLength={500}
          />
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          onClick={() => onSubmit(decision!, comment.trim() || undefined)}
          disabled={!decision}
          className="gap-2 px-8 h-11 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 font-medium"
        >
          Continue
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  ACCESS DETAIL                                               */
/* ══════════════════════════════════════════════════════════════ */
function permBadge(p: PermissionLevel) {
  const m: Record<PermissionLevel, string> = {
    Owner: 'text-indigo-600 dark:text-indigo-400',
    Member: 'text-foreground',
    Viewer: 'text-muted-foreground',
    Guest: 'text-muted-foreground',
  };
  return m[p] ?? 'text-foreground';
}

function AccessDetail({ review, onMemberDecision, onBulk, onSubmit }: {
  review: AccessReviewItem;
  onMemberDecision: (rid: string, mid: string, d: 'keep' | 'remove') => void;
  onBulk: (rid: string, d: 'keep' | 'remove') => void;
  onSubmit: (comment?: string) => void;
}) {
  const [comment, setComment] = useState('');
  const keepCount = review.members.filter(m => m.decision === 'keep').length;
  const removeCount = review.members.filter(m => m.decision === 'remove').length;

  return (
    <div className="space-y-6">
      <AlertBanner
        title="Access Review Required"
        message="Review user access and permissions. Remove access for users who no longer need it."
      />

      {/* Summary bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> {keepCount} Keep
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400">
            <UserMinus className="h-4 w-4" /> {removeCount} Remove
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-1.5 text-sm cursor-pointer" onClick={() => onBulk(review.id, 'keep')}>
            <Check className="h-3.5 w-3.5" /> Keep All
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 cursor-pointer" onClick={() => onBulk(review.id, 'remove')}>
            <UserMinus className="h-3.5 w-3.5" /> Remove All
          </Button>
        </div>
      </div>

      {/* Members table */}
      <Card className="border-border/40 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_100px_110px_120px_90px] gap-3 px-5 py-3 bg-muted/30 border-b border-border/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>User</span>
          <span>Role</span>
          <span>Department</span>
          <span>Last Access</span>
          <span className="text-center">Decision</span>
        </div>

        {/* Rows */}
        {review.members.map((member) => (
          <MemberTableRow
            key={member.id}
            member={member}
            reviewId={review.id}
            onDecision={onMemberDecision}
          />
        ))}
      </Card>

      {/* Notes */}
      <Card className="border-border/40">
        <CardContent className="pt-6 pb-6 px-8 space-y-3">
          <h3 className="font-semibold text-sm">Additional Notes (optional)</h3>
          <Textarea
            placeholder="Add any additional context for the IT team about these access decisions..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px] bg-muted/20 border-border/40 resize-none"
            maxLength={500}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={() => onSubmit(comment.trim() || undefined)}
          className="gap-2 px-8 h-11 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
        >
          Complete Review
          <CheckCircle2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function MemberTableRow({ member, reviewId, onDecision }: {
  member: AccessMember; reviewId: string;
  onDecision: (rid: string, mid: string, d: 'keep' | 'remove') => void;
}) {
  const stale = (Date.now() - new Date(member.lastAccess).getTime()) > 90 * 86400000;

  return (
    <div className={`grid grid-cols-[1fr_100px_110px_120px_90px] gap-3 items-center px-5 py-3.5 border-b border-border/20 last:border-0 transition-colors
      ${member.decision === 'remove' ? 'bg-red-50/50 dark:bg-red-500/5' : 'hover:bg-muted/20'}
    `}>
      {/* User */}
      <div className="flex items-center gap-3 min-w-0">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold
          ${member.decision === 'remove' ? 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400'}
        `}>
          {member.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-medium truncate ${member.decision === 'remove' ? 'line-through text-muted-foreground' : ''}`}>{member.name}</p>
          <p className="text-[11px] text-muted-foreground truncate">✉ {member.email}</p>
        </div>
      </div>

      {/* Role */}
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${member.permission === 'Owner' ? 'bg-indigo-500' : member.permission === 'Member' ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
        <span className={`text-sm ${permBadge(member.permission)}`}>{member.permission}</span>
      </div>

      {/* Department */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Building2 className="h-3.5 w-3.5" />
        <span className="truncate">{member.department}</span>
      </div>

      {/* Last access */}
      <div className="flex items-center gap-1.5 text-sm">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
        <span className={stale ? 'text-red-600 dark:text-red-400 font-medium' : 'text-muted-foreground'}>
          {formatRelative(member.lastAccess)}
        </span>
      </div>

      {/* Decision buttons */}
      <div className="flex items-center justify-center gap-1.5">
        <button
          onClick={() => onDecision(reviewId, member.id, 'keep')}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer
            ${member.decision === 'keep' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-muted/50 text-muted-foreground hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-500/15'}`}
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDecision(reviewId, member.id, 'remove')}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer
            ${member.decision === 'remove' ? 'bg-red-500 text-white shadow-sm' : 'bg-muted/50 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/15'}`}
        >
          <UserMinus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  LICENSE DETAIL                                              */
/* ══════════════════════════════════════════════════════════════ */
function LicenseDetail({ review, onSubmit }: {
  review: LicenseReviewItem;
  onSubmit: (decision: string, comment?: string) => void;
}) {
  const [decision, setDecision] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const options: RadioOption[] = [
    {
      value: 'keep', label: 'Yes, I need all features',
      description: 'This license is essential for my daily work and I use most features',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      selectedBorder: 'border-indigo-400 ring-indigo-500/20', selectedBg: 'bg-indigo-50/50 dark:bg-indigo-500/5',
    },
    {
      value: 'partial', label: 'Partially, only some features',
      description: 'I use some features but a more basic license might be sufficient',
      icon: <Sparkles className="h-4 w-4 text-amber-500" />,
      selectedBorder: 'border-indigo-400 ring-indigo-500/20', selectedBg: 'bg-indigo-50/50 dark:bg-indigo-500/5',
    },
    {
      value: 'release', label: "No, I don't need it",
      description: 'I no longer need this license and it can be removed',
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      selectedBorder: 'border-indigo-400 ring-indigo-500/20', selectedBg: 'bg-indigo-50/50 dark:bg-indigo-500/5',
    },
  ];

  return (
    <div className="space-y-6">
      {review.usagePercent < 30 && (
        <AlertBanner
          title="Low Usage Detected"
          message={`This license has very low usage (${review.usagePercent}%) over the past 90 days. Please review if you still need it.`}
        />
      )}

      {/* Feature usage breakdown */}
      <Card className="border-border/40">
        <CardContent className="pt-6 pb-4 px-8 space-y-4">
          <h3 className="font-heading font-bold text-base">Feature Usage Breakdown</h3>
          <div className="divide-y divide-border/30">
            {review.features.map((f) => (
              <div key={f.name} className="flex items-center justify-between py-3.5">
                <div>
                  <p className="text-sm font-medium">{f.name}</p>
                  <p className="text-xs text-muted-foreground">Last used: {f.lastUsed}</p>
                </div>
                <Badge className={`text-[11px] font-semibold capitalize px-2.5 py-0.5 border-0 ${usageBadge[f.usage]}`}>
                  {f.usage === 'active' ? 'Active' : f.usage === 'low' ? 'Low' : 'Inactive'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question card */}
      <Card className="border-border/40">
        <CardContent className="pt-8 pb-8 px-8 space-y-6">
          <div className="text-center space-y-1.5">
            <h3 className="font-heading font-bold text-lg">Do you still need this license for your work?</h3>
            <p className="text-sm text-muted-foreground">Based on the usage data, select the option that best fits your needs</p>
          </div>
          <RadioGroup options={options} selected={decision} onChange={setDecision} />
        </CardContent>
      </Card>

      {/* Additional notes */}
      <Card className="border-border/40">
        <CardContent className="pt-6 pb-6 px-8 space-y-3">
          <h3 className="font-semibold text-sm">Additional Notes (optional)</h3>
          <Textarea
            placeholder="Explain your decision or add any relevant context..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[120px] bg-muted/20 border-border/40 resize-none"
            maxLength={500}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={() => onSubmit(decision!, comment.trim() || undefined)}
          disabled={!decision}
          className="gap-2 px-8 h-11 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 font-medium"
        >
          Continue
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  MAIN DETAIL PAGE                                            */
/* ══════════════════════════════════════════════════════════════ */
export function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getReviewById,
    handleWorkspaceDecision,
    handleAccessMemberDecision,
    bulkAccessDecision,
    submitAccessReview,
    handleLicenseDecision,
    undoReview,
  } = useReviews();

  const review = getReviewById(id ?? '');

  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground text-lg">Review not found</p>
        <Button variant="outline" onClick={() => navigate('/reviews')} className="cursor-pointer gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Reviews
        </Button>
      </div>
    );
  }

  const cat = categoryBadge[review.category];
  const priority = priorityStyles[review.priority];
  const isCompleted = review.status === 'approved' || review.status === 'rejected';

  const handleDone = () => {
    const reviewId = review.id;
    toast('Review submitted', {
      description: 'You can undo this action within 5 seconds.',
      duration: 5000,
      action: {
        label: 'Undo',
        onClick: () => {
          const undone = undoReview(reviewId);
          if (undone) {
            toast.success('Review undone — restored to pending.', { duration: 2000 });
          }
        },
      },
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    });
    navigate('/reviews');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* ── Back + header ──────────────────── */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/reviews')} className="cursor-pointer mt-1 shrink-0 h-9 w-9 rounded-lg hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1 min-w-0">
          {/* Breadcrumb badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="outline" className={`text-[11px] font-semibold px-2 py-0.5 ${cat.bg} ${cat.text} ${cat.border}`}>
              {getReviewCategoryLabel(review)}
            </Badge>
            {review.category === 'workspace' && (
              <span className="text-xs text-muted-foreground capitalize">
                {(review as WorkspaceReviewItem).workspaceType}
              </span>
            )}
          </div>

          {/* Title row */}
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white ${categoryAccent[review.category]}`}>
              {categoryIcons[review.category]}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-heading text-2xl font-bold tracking-tight truncate">
                {getReviewTitle(review)}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {review.category === 'workspace' && 'Overview & Assessment'}
                {review.category === 'access' && 'Review user access and permissions'}
                {review.category === 'license' && 'Usage Analysis & Assessment'}
              </p>
            </div>
            {/* Progress */}
            <div className="shrink-0 w-28 hidden sm:block">
              <StepProgress current={1} total={2} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Detail content ─────────────────── */}
      {!isCompleted && (
        <>
          {review.category === 'workspace' && (
            <WorkspaceDetail
              review={review as WorkspaceReviewItem}
              onSubmit={(decision, comment) => {
                handleWorkspaceDecision(review.id, decision as 'keep' | 'partial' | 'not-using', comment);
                handleDone();
              }}
            />
          )}
          {review.category === 'access' && (
            <AccessDetail
              review={review as AccessReviewItem}
              onMemberDecision={handleAccessMemberDecision}
              onBulk={bulkAccessDecision}
              onSubmit={(comment) => {
                submitAccessReview(review.id, comment);
                handleDone();
              }}
            />
          )}
          {review.category === 'license' && (
            <LicenseDetail
              review={review as LicenseReviewItem}
              onSubmit={(decision, comment) => {
                handleLicenseDecision(review.id, decision as 'keep' | 'partial' | 'release', comment);
                handleDone();
              }}
            />
          )}
        </>
      )}

      {/* ── Completed state ────────────────── */}
      {isCompleted && (
        <Card className="border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5">
          <CardContent className="pt-6 flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            <div>
              <p className="text-sm font-semibold">This review has been completed</p>
              {review.comment && (
                <p className="text-sm text-muted-foreground mt-1 italic">"{review.comment}"</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Toaster position="bottom-right" richColors closeButton toastOptions={{ className: 'font-sans' }} />
    </div>
  );
}
