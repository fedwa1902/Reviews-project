import {
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  RadialBar,
  RadialBarChart,
  Label,
} from 'recharts';

/* ── Data ─────────────────────────────────────────────────────── */
const weeklyData = [
  { day: 'Mon', reviews: 8, target: 10 },
  { day: 'Tue', reviews: 12, target: 10 },
  { day: 'Wed', reviews: 6, target: 10 },
  { day: 'Thu', reviews: 15, target: 10 },
  { day: 'Fri', reviews: 9, target: 10 },
  { day: 'Sat', reviews: 3, target: 5 },
  { day: 'Sun', reviews: 1, target: 5 },
];

const monthlyTrend = [
  { month: 'Jan', workspace: 22, access: 18, license: 12 },
  { month: 'Feb', workspace: 28, access: 22, license: 15 },
  { month: 'Mar', workspace: 35, access: 25, license: 18 },
  { month: 'Apr', workspace: 30, access: 28, license: 22 },
  { month: 'May', workspace: 42, access: 32, license: 20 },
  { month: 'Jun', workspace: 38, access: 35, license: 25 },
];

const categoryDistribution = [
  { name: 'Workspace', value: 42, fill: 'var(--color-workspace)' },
  { name: 'Access', value: 35, fill: 'var(--color-access)' },
  { name: 'License', value: 25, fill: 'var(--color-license)' },
];

const departmentMetrics = [
  { name: 'Marketing', completion: 78, reviews: 42, color: 'from-blue-500 to-cyan-500' },
  { name: 'Engineering', completion: 92, reviews: 38, color: 'from-emerald-500 to-teal-500' },
  { name: 'Sales', completion: 65, reviews: 28, color: 'from-violet-500 to-purple-500' },
  { name: 'HR', completion: 85, reviews: 15, color: 'from-amber-500 to-orange-500' },
  { name: 'Finance', completion: 95, reviews: 20, color: 'from-rose-500 to-pink-500' },
];

const licenseMetrics = [
  { name: 'Microsoft 365 E5', assigned: 45, used: 38, cost: '$2,565' },
  { name: 'Power BI Pro', assigned: 20, used: 12, cost: '$200' },
  { name: 'Visio Plan 2', assigned: 10, used: 4, cost: '$150' },
  { name: 'Project Plan 3', assigned: 15, used: 9, cost: '$450' },
];

/* ── Chart configs ────────────────────────────────────────────── */
const weeklyChartConfig = {
  reviews: {
    label: 'Reviews',
    color: 'oklch(0.585 0.233 277.117)',
  },
  target: {
    label: 'Target',
    color: 'oklch(0.795 0.184 86.047)',
  },
} satisfies ChartConfig;

const trendChartConfig = {
  workspace: {
    label: 'Workspace',
    color: 'oklch(0.585 0.233 277.117)',
  },
  access: {
    label: 'Access',
    color: 'oklch(0.696 0.17 162.48)',
  },
  license: {
    label: 'License',
    color: 'oklch(0.769 0.189 70.08)',
  },
} satisfies ChartConfig;

const pieChartConfig = {
  workspace: {
    label: 'Workspace',
    color: 'oklch(0.585 0.233 277.117)',
  },
  access: {
    label: 'Access',
    color: 'oklch(0.696 0.17 162.48)',
  },
  license: {
    label: 'License',
    color: 'oklch(0.769 0.189 70.08)',
  },
} satisfies ChartConfig;

const complianceConfig = {
  compliance: {
    label: 'Compliance',
    color: 'oklch(0.696 0.17 162.48)',
  },
} satisfies ChartConfig;

/* ══════════════════════════════════════════════════════════════ */
/*  ANALYTICS PAGE                                              */
/* ══════════════════════════════════════════════════════════════ */
export function AnalyticsPage() {
  const totalReviews = categoryDistribution.reduce((s, c) => s + c.value, 0);

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-base">
          Review performance metrics and organizational compliance trends.
        </p>
      </div>

      {/* ── Summary cards ───────────────────── */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total reviews this week', value: '54', trend: '+12%', up: true, icon: <Activity className="h-4 w-4" /> },
          { label: 'Average completion time', value: '2.3 days', trend: '-18%', up: false, icon: <Calendar className="h-4 w-4" /> },
          { label: 'Compliance rate', value: '87%', trend: '+5%', up: true, icon: <ShieldCheck className="h-4 w-4" /> },
          { label: 'Cost savings identified', value: '$1,240', trend: '+22%', up: true, icon: <DollarSign className="h-4 w-4" /> },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <div className="text-muted-foreground">{stat.icon}</div>
              </div>
              <div className="text-2xl font-bold font-heading">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.up ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-emerald-500" />
                )}
                <span className="text-xs text-emerald-500 font-medium">{stat.trend}</span>
                <span className="text-xs text-muted-foreground">vs last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Row 1: Weekly bar + Monthly area ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Reviews Bar Chart */}
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-heading">Weekly Reviews</CardTitle>
              <CardDescription>Reviews completed vs target per day</CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              This Week
            </Badge>
          </CardHeader>
          <CardContent>
            <ChartContainer config={weeklyChartConfig} className="h-[280px] w-full">
              <BarChart data={weeklyData} accessibilityLayer>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="reviews"
                  fill="var(--color-reviews)"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="target"
                  fill="var(--color-target)"
                  radius={[6, 6, 0, 0]}
                  opacity={0.4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend Area Chart */}
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-heading">Monthly Trend</CardTitle>
              <CardDescription>Reviews by category over time</CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              6 months
            </Badge>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendChartConfig} className="h-[280px] w-full">
              <AreaChart data={monthlyTrend} accessibilityLayer>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  content={<ChartTooltipContent indicator="line" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <defs>
                  <linearGradient id="fillWorkspace" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-workspace)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-workspace)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillAccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-access)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-access)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillLicense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-license)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-license)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="workspace"
                  type="natural"
                  fill="url(#fillWorkspace)"
                  stroke="var(--color-workspace)"
                  strokeWidth={2}
                  stackId="a"
                />
                <Area
                  dataKey="access"
                  type="natural"
                  fill="url(#fillAccess)"
                  stroke="var(--color-access)"
                  strokeWidth={2}
                  stackId="a"
                />
                <Area
                  dataKey="license"
                  type="natural"
                  fill="url(#fillLicense)"
                  stroke="var(--color-license)"
                  strokeWidth={2}
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: Pie + Compliance radial + Department ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category Distribution Pie */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Category Distribution</CardTitle>
            <CardDescription>Breakdown of active review categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieChartConfig} className="h-[260px] w-full">
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  strokeWidth={4}
                  stroke="hsl(var(--background))"
                >
                  {categoryDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalReviews}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 22}
                              className="fill-muted-foreground text-sm"
                            >
                              Reviews
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="name" />}
                  className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Compliance Rate Radial */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Compliance Rate</CardTitle>
            <CardDescription>Overall organization compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={complianceConfig} className="h-[260px] w-full">
              <RadialBarChart
                data={[{ compliance: 87, fill: "var(--color-compliance)" }]}
                startAngle={90}
                endAngle={90 + 360 * 0.87}
                innerRadius={80}
                outerRadius={110}
              >
                <RadialBar
                  dataKey="compliance"
                  background={{ fill: 'hsl(var(--muted))' }}
                  cornerRadius={10}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x="50%"
                    dy="-0.35em"
                    className="fill-foreground text-3xl font-bold"
                  >
                    87%
                  </tspan>
                  <tspan
                    x="50%"
                    dy="1.6em"
                    className="fill-muted-foreground text-sm"
                  >
                    Compliant
                  </tspan>
                </text>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Department Performance</CardTitle>
            <CardDescription>Completion rate by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {departmentMetrics.map((dept) => (
              <div key={dept.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${dept.color}`} />
                    <span className="text-sm font-medium">{dept.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{dept.reviews} reviews</span>
                    <span className="text-xs font-semibold">{dept.completion}%</span>
                  </div>
                </div>
                <Progress value={dept.completion} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── License Utilization ─────────────── */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-lg font-heading">License Utilization</CardTitle>
          <CardDescription>Usage and cost breakdown per license type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {licenseMetrics.map((lic) => {
              const utilization = Math.round((lic.used / lic.assigned) * 100);
              return (
                <div key={lic.name} className="rounded-xl border border-border/60 p-4 space-y-3">
                  <p className="text-sm font-medium truncate">{lic.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-heading">{utilization}%</span>
                    <span className="text-xs text-muted-foreground">utilized</span>
                  </div>
                  <Progress value={utilization} className="h-1.5" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{lic.used}/{lic.assigned} seats</span>
                    <span className="font-medium">{lic.cost}/mo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
