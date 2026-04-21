import { CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProgressHeaderProps {
  completed: number;
  total: number;
  userName: string;
}

export function ProgressHeader({ completed, total, userName }: ProgressHeaderProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const firstName = userName.split(' ')[0];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Hello, {firstName}! 👋
        </h2>
        <p className="mt-1 text-muted-foreground text-base">
          You have{' '}
          <span className="font-semibold text-foreground">
            {total - completed} pending review{total - completed !== 1 ? 's' : ''}
          </span>{' '}
          that need your attention.
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Progress
            </span>
            <span className="text-sm font-semibold text-primary">
              {completed} of {total} completed
            </span>
          </div>
          <Progress value={percentage} className="h-2.5 animate-progress" />
        </div>
        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-heading font-bold text-lg">
          {percentage}%
        </div>
      </div>
    </div>
  );
}
