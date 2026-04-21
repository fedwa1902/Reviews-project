import { useLocation } from 'react-router-dom';
import { Sun, Moon, Monitor, Search } from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { NotificationPopover } from '@/components/layout/NotificationPopover';

const routeMap: Record<string, { parent?: string; label: string }> = {
  '/': { label: 'Overview' },
  '/analytics': { parent: 'Dashboard', label: 'Analytics' },
  '/activity': { parent: 'Dashboard', label: 'Activity Log' },
  '/reviews': { parent: 'Dashboard', label: 'Reviews' },
  '/users': { parent: 'Dashboard', label: 'Users' },
  '/users/roles': { parent: 'Users', label: 'Roles & Permissions' },
  '/users/departments': { parent: 'Users', label: 'Departments' },
  '/settings': { parent: 'Dashboard', label: 'Settings' },
  '/settings/notifications': { parent: 'Settings', label: 'Notifications' },
  '/settings/security': { parent: 'Settings', label: 'Security' },
  '/settings/integrations': { parent: 'Settings', label: 'Integrations' },
  '/reports': { parent: 'Dashboard', label: 'Reports' },
};

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
  };

  const themeIcon = theme === 'light' ? <Sun className="h-4 w-4" /> : theme === 'dark' ? <Moon className="h-4 w-4" /> : <Monitor className="h-4 w-4" />;
  const themeLabel = theme === 'light' ? 'Light mode' : theme === 'dark' ? 'Dark mode' : 'System';

  const currentRoute = routeMap[location.pathname] || { label: 'Dashboard' };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4 flex-1">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator orientation="vertical" className="mr-2 h-4!" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>{currentRoute.label}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1 px-4">
        {/* Notifications popover */}
        <NotificationPopover />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" id="search-btn">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search (⌘K)</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search (⌘K)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={cycleTheme}
              id="theme-toggle"
            >
              {themeIcon}
              <span className="sr-only">Toggle theme ({themeLabel})</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{themeLabel}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
