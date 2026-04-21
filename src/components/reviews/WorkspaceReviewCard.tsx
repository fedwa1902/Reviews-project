import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Globe,
  Users,
  Calendar,
  HardDrive,
  CheckCircle2,
  Archive,
  Trash2,
  Send,
  MessageSquare,
} from 'lucide-react';
import type { WorkspaceReviewItem } from '@/types/review';

interface WorkspaceReviewCardProps {
  review: WorkspaceReviewItem;
  index: number;
  onDecision: (id: string, decision: 'keep' | 'archive' | 'delete', comment?: string) => void;
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}

type DecisionOption = {
  value: 'keep' | 'archive' | 'delete';
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  selectedBg: string;
  selectedBorder: string;
  selectedText: string;
};

const decisionOptions: DecisionOption[] = [
  {
    value: 'keep',
    label: 'Still In Use',
    description: 'This workspace is actively used and should be kept',
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: 'text-emerald-500',
    selectedBg: 'bg-emerald-500/8 dark:bg-emerald-500/15',
    selectedBorder: 'border-emerald-500/40 ring-2 ring-emerald-500/20',
    selectedText: 'text-emerald-700 dark:text-emerald-400',
  },
  {
    value: 'archive',
    label: 'Archive',
    description: 'Move to archive — can be restored later',
    icon: <Archive className="h-5 w-5" />,
    color: 'text-amber-500',
    selectedBg: 'bg-amber-500/8 dark:bg-amber-500/15',
    selectedBorder: 'border-amber-500/40 ring-2 ring-amber-500/20',
    selectedText: 'text-amber-700 dark:text-amber-400',
  },
  {
    value: 'delete',
    label: 'Delete',
    description: 'Permanently remove this workspace',
    icon: <Trash2 className="h-5 w-5" />,
    color: 'text-red-500',
    selectedBg: 'bg-red-500/8 dark:bg-red-500/15',
    selectedBorder: 'border-red-500/40 ring-2 ring-red-500/20',
    selectedText: 'text-red-700 dark:text-red-400',
  },
];

export function WorkspaceReviewCard({ review, index, onDecision }: WorkspaceReviewCardProps) {
  const [selectedDecision, setSelectedDecision] = useState<'keep' | 'archive' | 'delete' | null>(null);
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);

  const isCompleted = review.status !== 'pending';
  const isStale = new Date().getTime() - new Date(review.lastActivityDate).getTime() > 90 * 24 * 60 * 60 * 1000;

  const handleSubmit = () => {
    if (!selectedDecision) return;
    onDecision(review.id, selectedDecision, comment.trim() || undefined);
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
              review.workspaceType === 'sharepoint'
                ? 'bg-primary/10 text-primary'
                : 'bg-[#464EB8]/10 text-[#464EB8]'
            }`}>
              {review.workspaceType === 'sharepoint' ? (
                <Globe className="h-5 w-5" />
              ) : (
                <Users className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="font-heading font-semibold text-base leading-tight">
                {review.workspaceName}
              </h3>
              <Badge variant="outline" className="mt-1 text-xs">
                {review.workspaceType === 'sharepoint' ? 'SharePoint' : 'Microsoft Teams'}
              </Badge>
            </div>
          </div>
          {isCompleted && (
            <Badge className="bg-success text-success-foreground border-0">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {review.decision === 'keep' ? 'Keeping' : review.decision === 'archive' ? 'Archiving' : 'Deleting'}
            </Badge>
          )}
          {!isCompleted && isStale && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/20 text-xs">
                  Inactive
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>No activity for over 3 months</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {review.description}
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Last active</p>
              <p className="font-medium">{formatRelativeDate(review.lastActivityDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Members</p>
              <p className="font-medium">{review.memberCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Storage</p>
              <p className="font-medium">{review.storageUsedGB} GB</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Owner</p>
              <p className="font-medium truncate">{review.owner}</p>
            </div>
          </div>
        </div>

        {/* Decision + Comment + Submit section */}
        {!isCompleted && (
          <div className="space-y-4 pt-4 border-t border-border/60">
            {/* Radio-style decision cards */}
            <div>
              <p className="text-sm font-medium mb-3 text-foreground">
                What would you like to do with this workspace?
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {decisionOptions.map((option) => {
                  const isSelected = selectedDecision === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedDecision(option.value)}
                      className={`group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer
                        ${
                          isSelected
                            ? `${option.selectedBg} ${option.selectedBorder} ${option.selectedText}`
                            : 'border-border/60 hover:border-border hover:bg-muted/30'
                        }
                      `}
                      id={`decision-${review.id}-${option.value}`}
                    >
                      {/* Custom radio indicator */}
                      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200
                        ${
                          isSelected
                            ? `border-current bg-current`
                            : 'border-muted-foreground/30 group-hover:border-muted-foreground/50'
                        }
                      `}>
                        {isSelected && (
                          <div className="h-2 w-2 rounded-full bg-white animate-in zoom-in-50 duration-150" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`flex items-center gap-2 font-medium text-sm ${
                          isSelected ? '' : 'text-foreground'
                        }`}>
                          <span className={isSelected ? '' : option.color}>{option.icon}</span>
                          {option.label}
                        </div>
                        <p className={`mt-0.5 text-xs leading-relaxed ${
                          isSelected ? 'opacity-80' : 'text-muted-foreground'
                        }`}>
                          {option.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

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
                    placeholder="Add justification or notes about your decision..."
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

            {/* Submit */}
            <div className="flex items-center justify-end gap-3">
              {selectedDecision && (
                <p className="text-xs text-muted-foreground mr-auto">
                  Selected: <span className="font-medium text-foreground">{decisionOptions.find(o => o.value === selectedDecision)?.label}</span>
                </p>
              )}
              <Button
                onClick={handleSubmit}
                disabled={!selectedDecision}
                className="cursor-pointer gap-2 px-6 bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
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
