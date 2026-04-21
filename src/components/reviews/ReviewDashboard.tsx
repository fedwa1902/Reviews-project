import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge-2';
import { Card3DList } from '@/components/ui/animated-3d-card';
import type { CardData, ThemeType } from '@/components/ui/animated-3d-card';
import { useReviews } from '@/hooks/useReviews';
import {
  ShieldCheck,
  KeyRound,
  Clock,
  HardDrive,
  CheckCircle2,
} from 'lucide-react';
import type { ReviewItem } from '@/types/review';
import { getReviewTitle, getReviewSubtitle } from '@/types/review';

/* ── Category → 3D card theme mapping ────────────────────────── */
const categoryTheme: Record<string, ThemeType> = {
  workspace: 'secondary',
  access: 'success',
  license: 'accent',
};

const categoryIcons: Record<string, React.ReactNode> = {
  workspace: <HardDrive className="h-8 w-8" />,
  access: <ShieldCheck className="h-8 w-8" />,
  license: <KeyRound className="h-8 w-8" />,
};

/* ── Map a ReviewItem to Card3D data ─────────────────────────── */
function reviewToCard(item: ReviewItem, navigate: ReturnType<typeof useNavigate>): CardData {
  const isCompleted = item.status === 'approved' || item.status === 'rejected';
  const isInReview = item.status === 'in-review';

  let desc = getReviewSubtitle(item);
  if (item.category === 'workspace') {
    desc += ` · ${item.workspaceType === 'teams' ? 'Teams' : item.workspaceType === 'sharepoint' ? 'SharePoint' : 'OneDrive'} · ${item.memberCount} members`;
  } else if (item.category === 'access') {
    desc += ` · ${item.members.length} members to review`;
  } else if (item.category === 'license') {
    desc += ` · $${item.costPerMonth}/mo · ${item.licenseType}`;
  }

  const dueStr = new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  desc += ` · Due ${dueStr}`;
  if (item.priority === 'high') desc += ' · ⚠ High Priority';

  return {
    id: item.id,
    title: getReviewTitle(item),
    description: desc,
    icon: categoryIcons[item.category],
    theme: categoryTheme[item.category],
    onClick: !isCompleted && !isInReview ? () => navigate(`/reviews/${item.id}`) : undefined,
    disabled: isCompleted,
  };
}

/* ── Stat card data ──────────────────────────────────────────── */
interface StatInfo {
  icon: React.ElementType;
  iconBg: string;
  value: number | string;
  label: string;
  info: React.ReactNode;
}

/* ══════════════════════════════════════════════════════════════ */
/*  MAIN LIST PAGE                                              */
/* ══════════════════════════════════════════════════════════════ */
export function ReviewDashboard() {
  const navigate = useNavigate();
  const { pendingCount, completedCount, totalCount, getCategoryCount, allReviews } = useReviews();

  // Sort: pending first, then in-review, then completed
  const sorted = [...allReviews].sort((a, b) => {
    const order = { pending: 0, 'in-review': 1, approved: 2, rejected: 3 };
    return (order[a.status] ?? 9) - (order[b.status] ?? 9);
  });

  const cards: CardData[] = sorted.map((item) => reviewToCard(item, navigate));

  const stats: StatInfo[] = [
    {
      icon: Clock,
      iconBg: 'border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400',
      value: pendingCount,
      label: 'Pending Reviews',
      info: (
        <Badge variant="secondary" appearance="light">
          {totalCount} total items
        </Badge>
      ),
    },
    {
      icon: HardDrive,
      iconBg: 'border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400',
      value: getCategoryCount('workspace'),
      label: 'Workspace Reviews',
      info: (
        <Badge variant="info" appearance="light">
          Workspace
        </Badge>
      ),
    },
    {
      icon: ShieldCheck,
      iconBg: 'border-green-200 dark:border-green-800 text-green-600 dark:text-green-400',
      value: getCategoryCount('access'),
      label: 'Access Reviews',
      info: (
        <Badge variant="success" appearance="light">
          Access
        </Badge>
      ),
    },
    {
      icon: CheckCircle2,
      iconBg: 'border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400',
      value: completedCount,
      label: 'Completed',
      info: (
        <Badge variant="warning" appearance="light">
          {totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}% done` : '0% done'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* ── Statistics cards ────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="flex flex-col items-start gap-5 p-5">
              {/* Icon */}
              <div className={`rounded-xl flex items-center justify-center size-12 border ${stat.iconBg}`}>
                <stat.icon className="size-6" />
              </div>

              {/* Value & Label */}
              <div className="space-y-0.5">
                <div className="text-2xl font-bold text-foreground leading-none">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>

              {stat.info}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── 3D animated card grid ──────────── */}
      <Card3DList
        cards={cards}
        columns={3}
        gap="lg"
        size="md"
        variant="premium"
        animated={true}
        staggerDelay={0.1}
      />
    </div>
  );
}
