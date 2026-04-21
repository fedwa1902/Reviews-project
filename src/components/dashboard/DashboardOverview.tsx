import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useReviews } from '@/hooks/useReviews';
import { mockUser } from '@/data/mockReviews';
import { getReviewTitle, getReviewCategoryLabel } from '@/types/review';
import type { ReviewItem } from '@/types/review';
import {
  Globe,
  ShieldCheck,
  KeyRound,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Activity,
  ArrowUpRight,
  ArrowRight,
  BarChart3,
  HardDrive,
  Settings,
  Calendar,
  DollarSign,
  Zap,
} from 'lucide-react';

/* ── Greeting based on time of day ─────────────────────────── */
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ── Stat card ─────────────────────────────────────────────── */
function StatCard({ title, value, description, icon, trend, gradient }: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: { value: string; direction: 'up' | 'down' };
  gradient: string;
}) {
  return (
    <Card className="group relative overflow-hidden border-border/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-[0.06] -mr-8 -mt-8 group-hover:opacity-[0.12] transition-opacity`} />
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold font-heading tracking-tight">{value}</p>
            <div className="flex items-center gap-2">
              {trend && (
                <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 h-5 font-semibold ${
                  trend.direction === 'up'
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                    : 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400'
                }`}>
                  {trend.direction === 'up' ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                  {trend.value}
                </Badge>
              )}
              <p className="text-[11px] text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Activity feed item types ──────────────────────────────── */
interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: 'approved' | 'released' | 'pending' | 'archived';
}

const recentActivity: ActivityItem[] = [
  { id: '1', user: 'Sarah Mitchell', action: 'completed review for', target: 'HR Documents', time: '2 minutes ago', type: 'approved' },
  { id: '2', user: 'James Carter', action: 'released license', target: 'Power BI Pro', time: '15 minutes ago', type: 'released' },
  { id: '3', user: 'Lisa Park', action: 'submitted review for', target: 'Brand Assets Library', time: '1 hour ago', type: 'pending' },
  { id: '4', user: 'Tom Henderson', action: 'archived workspace', target: 'Product Launch 2023', time: '3 hours ago', type: 'archived' },
  { id: '5', user: 'Rachel Kim', action: 'kept license', target: 'Microsoft 365 E5', time: '5 hours ago', type: 'approved' },
];

const activityConfig: Record<string, { icon: React.ReactNode; style: string }> = {
  approved: { icon: <CheckCircle2 className="h-4 w-4" />, style: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400' },
  released: { icon: <AlertTriangle className="h-4 w-4" />, style: 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400' },
  pending: { icon: <Clock className="h-4 w-4" />, style: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400' },
  archived: { icon: <Activity className="h-4 w-4" />, style: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400' },
};

/* ── Upcoming review row ───────────────────────────────────── */
function UpcomingReviewRow({ item, onClick }: { item: ReviewItem; onClick: () => void }) {
  const catStyles: Record<string, string> = {
    workspace: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
    access: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    license: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  };
  const catIcons: Record<string, React.ReactNode> = {
    workspace: <HardDrive className="h-3.5 w-3.5" />,
    access: <ShieldCheck className="h-3.5 w-3.5" />,
    license: <KeyRound className="h-3.5 w-3.5" />,
  };
  const priorityColor: Record<string, string> = {
    high: 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400',
    medium: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    low: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  };

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-muted/40 cursor-pointer group"
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${catStyles[item.category]}`}>
        {catIcons[item.category]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{getReviewTitle(item)}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-muted-foreground">{getReviewCategoryLabel(item)}</span>
          <Badge className={`text-[9px] px-1.5 py-0 h-4 border-0 font-semibold capitalize ${priorityColor[item.priority]}`}>
            {item.priority}
          </Badge>
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  DASHBOARD OVERVIEW                                          */
/* ══════════════════════════════════════════════════════════════ */
export function DashboardOverview() {
  const navigate = useNavigate();
  const { pendingCount, completedCount, totalCount, getCategoryCount, pendingReviews, allReviews } = useReviews();

  const overallPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const categories = [
    { name: 'Workspaces', key: 'workspace' as const, icon: <Globe className="h-4 w-4" />, gradient: 'from-indigo-500 to-blue-500', count: getCategoryCount('workspace'), total: allReviews.filter(r => r.category === 'workspace').length },
    { name: 'Access', key: 'access' as const, icon: <ShieldCheck className="h-4 w-4" />, gradient: 'from-emerald-500 to-teal-500', count: getCategoryCount('access'), total: allReviews.filter(r => r.category === 'access').length },
    { name: 'Licenses', key: 'license' as const, icon: <KeyRound className="h-4 w-4" />, gradient: 'from-violet-500 to-purple-500', count: getCategoryCount('license'), total: allReviews.filter(r => r.category === 'license').length },
  ];

  // Sort pending reviews by due date (soonest first)
  const upcomingReviews = [...pendingReviews].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* ── Welcome banner ─────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-500 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full -mb-24" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-bold tracking-tight">
              {getGreeting()}, {mockUser.name.split(' ')[0]} 👋
            </h1>
            <p className="text-indigo-100 text-base max-w-lg">
              You have <span className="font-semibold text-white">{pendingCount} pending review{pendingCount !== 1 ? 's' : ''}</span> that need your attention. Stay on top of your governance tasks.
            </p>
          </div>
          <Button
            onClick={() => navigate('/reviews')}
            className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg gap-2 font-semibold h-11 px-6 cursor-pointer"
          >
            <Zap className="h-4 w-4" />
            Start Reviews
          </Button>
        </div>
      </div>

      {/* ── Stat cards ─────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Reviews"
          value={pendingCount}
          description="from last week"
          icon={<Clock className="h-5 w-5" />}
          trend={{ value: '+2', direction: 'up' }}
          gradient="from-amber-500 to-orange-500"
        />
        <StatCard
          title="Completed"
          value={completedCount}
          description="reviews done"
          icon={<CheckCircle2 className="h-5 w-5" />}
          trend={{ value: '+15%', direction: 'up' }}
          gradient="from-emerald-500 to-teal-500"
        />
        <StatCard
          title="Active Users"
          value={24}
          description="across 3 departments"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: '+3', direction: 'up' }}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          title="License Cost"
          value="$2,460"
          description="potential savings"
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: '-8%', direction: 'down' }}
          gradient="from-violet-500 to-purple-500"
        />
      </div>

      {/* ── Review progress + Upcoming + Activity ── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Review progress */}
        <Card className="lg:col-span-4 border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-heading">Review Progress</CardTitle>
            <Badge variant="secondary" className="text-xs font-semibold">{overallPct}%</Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Overall donut-style progress */}
            <div className="flex items-center justify-center py-2">
              <div className="relative h-28 w-28">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-muted/20" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8"
                    className="text-indigo-500"
                    strokeDasharray={`${overallPct * 2.64} 264`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold font-heading">{completedCount}</span>
                  <span className="text-[10px] text-muted-foreground">of {totalCount}</span>
                </div>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="space-y-3">
              {categories.map((cat) => {
                const done = cat.total - cat.count;
                const pct = cat.total > 0 ? Math.round((done / cat.total) * 100) : 0;
                return (
                  <div key={cat.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br ${cat.gradient} text-white`}>
                          {cat.icon}
                        </div>
                        <span className="font-medium">{cat.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{done}/{cat.total}</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming reviews */}
        <Card className="lg:col-span-4 border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-heading">Upcoming Reviews</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground cursor-pointer hover:text-foreground gap-1" onClick={() => navigate('/reviews')}>
              View all <ArrowUpRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-0.5">
            {upcomingReviews.length > 0 ? upcomingReviews.map((item) => (
              <UpcomingReviewRow
                key={item.id}
                item={item}
                onClick={() => navigate(`/reviews/${item.id}`)}
              />
            )) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs text-muted-foreground">No pending reviews</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-4 border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-heading">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground cursor-pointer hover:text-foreground gap-1" onClick={() => navigate('/activity')}>
              View all <ArrowUpRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-0.5">
              {recentActivity.map((item) => {
                const cfg = activityConfig[item.type];
                return (
                  <div key={item.id} className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted/30">
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${cfg.style}`}>
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug">
                        <span className="font-medium">{item.user}</span>{' '}
                        <span className="text-muted-foreground">{item.action}</span>{' '}
                        <span className="font-medium">{item.target}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Quick actions ──────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Start Reviews', desc: `${pendingCount} pending items`, icon: <ShieldCheck className="h-5 w-5" />, gradient: 'from-indigo-500 to-blue-500', path: '/reviews' },
          { label: 'Manage Users', desc: '24 active users', icon: <Users className="h-5 w-5" />, gradient: 'from-emerald-500 to-teal-500', path: '/users' },
          { label: 'View Analytics', desc: 'Weekly report ready', icon: <BarChart3 className="h-5 w-5" />, gradient: 'from-violet-500 to-purple-500', path: '/analytics' },
          { label: 'Settings', desc: 'Configure portal', icon: <Settings className="h-5 w-5" />, gradient: 'from-slate-500 to-gray-600', path: '/settings' },
        ].map((action) => (
          <Card
            key={action.label}
            className="group cursor-pointer border-border/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            onClick={() => navigate(action.path)}
          >
            <CardContent className="pt-6 flex items-center gap-4">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-sm`}>
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold group-hover:text-primary transition-colors">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
