import { Badge } from '@/components/ui/badge';
import type { ReviewCategory } from '@/types/review';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: ReviewCategory;
  className?: string;
}

const categoryConfig: Record<ReviewCategory, { label: string; className: string }> = {
  workspace: {
    label: 'Workspace',
    className: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15',
  },
  access: {
    label: 'Access',
    className: 'bg-warning/10 text-warning-foreground border-warning/20 hover:bg-warning/15',
  },
  license: {
    label: 'License',
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/15',
  },
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const config = categoryConfig[category];
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
