import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Globe,
  Users,
  CheckCircle2,
  UserMinus,
  UserCheck,
  ShieldCheck,
  Calendar,
  Send,
  MessageSquare,
} from 'lucide-react';
import type { AccessReviewItem, AccessMember, PermissionLevel } from '@/types/review';

interface AccessReviewCardProps {
  review: AccessReviewItem;
  index: number;
  onMemberDecision: (reviewId: string, memberId: string, decision: 'keep' | 'remove') => void;
  onSubmit: (reviewId: string, comment?: string) => void;
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'recently';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

function getPermissionColor(permission: PermissionLevel): string {
  switch (permission) {
    case 'Owner':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'Member':
      return 'bg-success/10 text-success border-success/20';
    case 'Viewer':
      return 'bg-muted text-muted-foreground border-border';
  }
}

function isStaleAccess(lastAccess: string): boolean {
  const diffMs = new Date().getTime() - new Date(lastAccess).getTime();
  return diffMs > 90 * 24 * 60 * 60 * 1000;
}

function MemberRow({
  member,
  reviewId,
  onDecision,
  disabled,
}: {
  member: AccessMember;
  reviewId: string;
  onDecision: (reviewId: string, memberId: string, decision: 'keep' | 'remove') => void;
  disabled: boolean;
}) {
  const stale = isStaleAccess(member.lastAccess);

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
        member.decision === 'remove'
          ? 'bg-red-500/5 dark:bg-red-500/10 border border-red-500/20'
          : 'hover:bg-muted/50 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar with initials */}
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
          member.decision === 'remove'
            ? 'bg-red-500/10 text-red-500'
            : 'bg-primary/10 text-primary'
        }`}>
          {member.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-medium truncate ${member.decision === 'remove' ? 'line-through text-muted-foreground' : ''}`}>
            {member.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${getPermissionColor(member.permission)}`}>
              {member.permission}
            </Badge>
            <span className={`flex items-center gap-1 text-[11px] ${stale ? 'text-warning-foreground font-medium' : 'text-muted-foreground'}`}>
              <Calendar className="h-3 w-3" />
              {formatRelativeDate(member.lastAccess)}
              {stale && ' ⚠'}
            </span>
          </div>
        </div>
      </div>

      {!disabled && (
        <div className="flex gap-1 shrink-0">
          {/* Keep radio-style button */}
          <button
            onClick={() => onDecision(reviewId, member.id, 'keep')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer border
              ${
                member.decision === 'keep'
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/20'
                  : 'border-border/60 text-muted-foreground hover:border-emerald-500/30 hover:text-emerald-600 hover:bg-emerald-500/5'
              }
            `}
          >
            <div className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-all
              ${
                member.decision === 'keep'
                  ? 'border-emerald-500 bg-emerald-500'
                  : 'border-muted-foreground/40'
              }
            `}>
              {member.decision === 'keep' && (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </div>
            <UserCheck className="h-3.5 w-3.5" />
            Keep
          </button>

          {/* Remove radio-style button */}
          <button
            onClick={() => onDecision(reviewId, member.id, 'remove')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer border
              ${
                member.decision === 'remove'
                  ? 'bg-red-500/10 dark:bg-red-500/15 border-red-500/40 text-red-700 dark:text-red-400 ring-1 ring-red-500/20'
                  : 'border-border/60 text-muted-foreground hover:border-red-500/30 hover:text-red-600 hover:bg-red-500/5'
              }
            `}
          >
            <div className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-all
              ${
                member.decision === 'remove'
                  ? 'border-red-500 bg-red-500'
                  : 'border-muted-foreground/40'
              }
            `}>
              {member.decision === 'remove' && (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </div>
            <UserMinus className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

export function AccessReviewCard({ review, index, onMemberDecision, onSubmit }: AccessReviewCardProps) {
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);

  const isCompleted = review.status !== 'pending';
  const removedCount = review.members.filter((m) => m.decision === 'remove').length;

  const handleSubmit = () => {
    onSubmit(review.id, comment.trim() || undefined);
  };

  return (
    <Card
      className={`animate-fade-in-up transition-all duration-300 ${
        isCompleted
          ? 'opacity-60 border-success/30 bg-success/5'
          : 'hover:shadow-lg hover:border-primary/20'
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              review.resourceType === 'sharepoint'
                ? 'bg-primary/10 text-primary'
                : 'bg-[#464EB8]/10 text-[#464EB8]'
            }`}>
              {review.resourceType === 'sharepoint' ? (
                <Globe className="h-5 w-5" />
              ) : (
                <Users className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="font-heading font-semibold text-base leading-tight">
                {review.resourceName}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {review.members.length} member{review.members.length !== 1 ? 's' : ''} to review
              </p>
            </div>
          </div>
          {isCompleted && (
            <Badge className="bg-success text-success-foreground border-0">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Reviewed
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Member decision section */}
        <div>
          {!isCompleted && (
            <p className="text-sm font-medium mb-3 text-foreground">
              Review each member's access:
            </p>
          )}
          <div className="space-y-1.5">
            {review.members.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                reviewId={review.id}
                onDecision={onMemberDecision}
                disabled={isCompleted}
              />
            ))}
          </div>
        </div>

        {/* Comment + Submit section */}
        {!isCompleted && (
          <div className="space-y-4 pt-4 border-t border-border/60">
            {/* Comment toggle + area */}
            <div>
              {!showComment ? (
                <button
                  onClick={() => setShowComment(true)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
                >
                  <MessageSquare className="h-4 w-4 group-hover:text-primary transition-colors" />
                  Add a comment (optional)
                </button>
              ) : (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <label htmlFor={`comment-${review.id}`} className="flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Comment
                  </label>
                  <Textarea
                    id={`comment-${review.id}`}
                    placeholder="Add notes about the access changes you've made..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[100px] bg-muted/30 border-border/60 focus:border-primary/40 transition-all"
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] text-muted-foreground">
                      {comment.length}/500 characters
                    </p>
                    <button
                      onClick={() => { setShowComment(false); setComment(''); }}
                      className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      Remove comment
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Status summary + Submit */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {removedCount > 0 && (
                  <Badge variant="secondary" className="bg-red-500/10 text-red-600 dark:text-red-400 text-xs">
                    <UserMinus className="h-3 w-3 mr-1" />
                    {removedCount} to remove
                  </Badge>
                )}
                {removedCount === 0 && (
                  <p className="text-xs text-muted-foreground">No access changes</p>
                )}
              </div>
              <Button
                onClick={handleSubmit}
                className="cursor-pointer gap-2 px-6 bg-primary text-primary-foreground"
                id={`submit-${review.id}`}
              >
                <Send className="h-4 w-4" />
                Submit Review
              </Button>
            </div>
          </div>
        )}

        {/* Completed state: show comment if provided */}
        {isCompleted && review.comment && (
          <div className="pt-3 border-t border-border/60">
            <div className="flex items-start gap-2 rounded-lg bg-muted/30 p-3">
              <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
