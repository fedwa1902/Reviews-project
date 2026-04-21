import {
  Users,
  Search,
  MoreHorizontal,
  Shield,
  Mail,
  Building2,
  CheckCircle2,
  Clock,
  UserPlus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';

interface UserData {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'Admin' | 'Reviewer' | 'Viewer';
  status: 'Active' | 'Pending' | 'Inactive';
  lastActive: string;
  reviewsCompleted: number;
}

const users: UserData[] = [
  { id: '1', name: 'Sarah Mitchell', email: 'sarah.mitchell@contoso.com', department: 'Marketing', role: 'Admin', status: 'Active', lastActive: '2 mins ago', reviewsCompleted: 28 },
  { id: '2', name: 'James Carter', email: 'james.carter@contoso.com', department: 'Engineering', role: 'Reviewer', status: 'Active', lastActive: '15 mins ago', reviewsCompleted: 42 },
  { id: '3', name: 'Lisa Park', email: 'lisa.park@contoso.com', department: 'HR', role: 'Reviewer', status: 'Active', lastActive: '1 hour ago', reviewsCompleted: 15 },
  { id: '4', name: 'Tom Henderson', email: 'tom.henderson@contoso.com', department: 'Marketing', role: 'Viewer', status: 'Active', lastActive: '3 hours ago', reviewsCompleted: 8 },
  { id: '5', name: 'Rachel Kim', email: 'rachel.kim@contoso.com', department: 'Sales', role: 'Reviewer', status: 'Active', lastActive: '1 day ago', reviewsCompleted: 22 },
  { id: '6', name: 'David Foster', email: 'david.foster@contoso.com', department: 'Engineering', role: 'Viewer', status: 'Pending', lastActive: 'Never', reviewsCompleted: 0 },
  { id: '7', name: 'Emma Liu', email: 'emma.liu@contoso.com', department: 'Finance', role: 'Reviewer', status: 'Active', lastActive: '2 days ago', reviewsCompleted: 18 },
  { id: '8', name: 'Carlos Mendez', email: 'carlos.mendez@contoso.com', department: 'Marketing', role: 'Viewer', status: 'Inactive', lastActive: '30 days ago', reviewsCompleted: 5 },
];

const roleColors: Record<string, string> = {
  Admin: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  Reviewer: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  Viewer: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
};

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Inactive: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

const statusIcons: Record<string, React.ReactNode> = {
  Active: <CheckCircle2 className="h-3 w-3" />,
  Pending: <Clock className="h-3 w-3" />,
  Inactive: <Clock className="h-3 w-3" />,
};

export function UsersPage() {
  const [search, setSearch] = useState('');
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground text-base mt-1">
            Manage user access, roles, and review assignments.
          </p>
        </div>
        <Button className="cursor-pointer gap-2 bg-primary text-primary-foreground">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Users', value: users.length, icon: <Users className="h-4 w-4" />, color: 'from-blue-500 to-cyan-500' },
          { label: 'Active Now', value: users.filter((u) => u.status === 'Active').length, icon: <CheckCircle2 className="h-4 w-4" />, color: 'from-emerald-500 to-teal-500' },
          { label: 'Pending Invites', value: users.filter((u) => u.status === 'Pending').length, icon: <Mail className="h-4 w-4" />, color: 'from-amber-500 to-orange-500' },
        ].map((s) => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${s.color} text-white`}>
                {s.icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold font-heading">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Table */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-heading">All Users</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="user-search"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/60">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${roleColors[user.role]}`}
                    >
                      {user.role === 'Admin' && <Shield className="h-2.5 w-2.5 mr-0.5" />}
                      {user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {user.department}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-6 text-right">
                  <div>
                    <p className="text-xs text-muted-foreground">Reviews</p>
                    <p className="text-sm font-semibold">{user.reviewsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last active</p>
                    <p className="text-sm">{user.lastActive}</p>
                  </div>
                  <Badge className={`text-[11px] ${statusColors[user.status]}`}>
                    {statusIcons[user.status]}
                    <span className="ml-1">{user.status}</span>
                  </Badge>
                </div>

                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 cursor-pointer">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
