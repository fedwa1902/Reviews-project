import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Clock,
  ShieldAlert,
  KeyRound,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  Check,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

/* ── Notification types ──────────────────────────────────────── */
type NotificationType = 'deadline' | 'overdue' | 'completed' | 'new-review' | 'reminder' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  category?: 'workspace' | 'access' | 'license';
}

/* ── Mock notifications for governance portal ─────────────────── */
const initialNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'overdue',
    title: 'Overdue: SharePoint Marketing Review',
    description: 'This workspace review was due 2 days ago. Please complete it to maintain compliance.',
    timestamp: '2h ago',
    read: false,
    actionUrl: '/reviews',
    category: 'workspace',
  },
  {
    id: 'n2',
    type: 'deadline',
    title: 'Approaching Deadline: E5 License',
    description: 'Your E5 license review is due in 3 days. Review your usage and decide.',
    timestamp: '5h ago',
    read: false,
    actionUrl: '/reviews',
    category: 'license',
  },
  {
    id: 'n3',
    type: 'new-review',
    title: 'New Access Review Assigned',
    description: 'CRM Platform access review has been assigned to you. 6 members to review.',
    timestamp: '1d ago',
    read: false,
    actionUrl: '/reviews',
    category: 'access',
  },
  {
    id: 'n4',
    type: 'completed',
    title: 'Review Completed: Teams Engineering',
    description: 'Your workspace review has been processed. Decision: Keep workspace.',
    timestamp: '2d ago',
    read: true,
    category: 'workspace',
  },
  {
    id: 'n5',
    type: 'reminder',
    title: 'Weekly Review Reminder',
    description: 'You have 4 pending reviews. Complete them before the end of the week.',
    timestamp: '3d ago',
    read: true,
    actionUrl: '/reviews',
  },
  {
    id: 'n6',
    type: 'system',
    title: 'Compliance Score Updated',
    description: 'Your department compliance rate improved to 87%. View analytics for details.',
    timestamp: '4d ago',
    read: true,
    actionUrl: '/analytics',
  },
];

/* ── Config per type ──────────────────────────────────────────── */
const typeConfig: Record<NotificationType, { icon: React.ReactNode; accent: string; bg: string }> = {
  overdue: {
    icon: <AlertTriangle className="h-4 w-4" />,
    accent: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-500/10',
  },
  deadline: {
    icon: <Clock className="h-4 w-4" />,
    accent: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
  },
  'new-review': {
    icon: <ShieldAlert className="h-4 w-4" />,
    accent: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  completed: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    accent: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  reminder: {
    icon: <Bell className="h-4 w-4" />,
    accent: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
  },
  system: {
    icon: <Info className="h-4 w-4" />,
    accent: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
  },
};

const categoryIcon: Record<string, React.ReactNode> = {
  workspace: <HardDrive className="h-3 w-3" />,
  access: <ShieldAlert className="h-3 w-3" />,
  license: <KeyRound className="h-3 w-3" />,
};

/* ══════════════════════════════════════════════════════════════ */
/*  NOTIFICATION POPOVER                                        */
/* ══════════════════════════════════════════════════════════════ */
export function NotificationPopover() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      setOpen(false);
      navigate(notification.actionUrl);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-pointer relative"
          id="notifications-btn"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] bg-destructive text-destructive-foreground border-2 border-background">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">{unreadCount} notifications</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[400px] p-0 rounded-xl border-border/60 shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-semibold">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground cursor-pointer gap-1"
              onClick={markAllRead}
            >
              <Check className="h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[420px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
              <p className="text-xs text-muted-foreground/70 mt-1">No new notifications</p>
            </div>
          ) : (
            notifications.map((notification, i) => {
              const config = typeConfig[notification.type];
              return (
                <div key={notification.id}>
                  <div
                    className={`flex gap-3 px-4 py-3 transition-colors cursor-pointer group
                      ${!notification.read ? 'bg-muted/30' : 'hover:bg-muted/20'}
                    `}
                    onClick={() => handleClick(notification)}
                  >
                    {/* Icon */}
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.bg} ${config.accent} mt-0.5`}>
                      {config.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-[13px] leading-tight ${!notification.read ? 'font-semibold' : 'font-medium text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        <button
                          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismiss(notification.id);
                          }}
                        >
                          <X className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {notification.description}
                      </p>

                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[11px] text-muted-foreground/70">{notification.timestamp}</span>
                        {notification.category && (
                          <Badge variant="outline" className="text-[10px] h-4 px-1.5 gap-1 font-normal border-border/50">
                            {categoryIcon[notification.category]}
                            <span className="capitalize">{notification.category}</span>
                          </Badge>
                        )}
                        {!notification.read && (
                          <div className="ml-auto flex h-2 w-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  {i < notifications.length - 1 && <Separator className="opacity-40" />}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-border/40 p-2">
            <Button
              variant="ghost"
              className="w-full h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => {
                setOpen(false);
                navigate('/settings/notifications');
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
