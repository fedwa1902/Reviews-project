import { Sun, Moon, Monitor, Shield } from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ReviewUser } from '@/types/review';

interface HeaderProps {
  user: ReviewUser;
}

export function Header({ user }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
  };

  const themeIcon = theme === 'light' ? <Sun className="h-4 w-4" /> : theme === 'dark' ? <Moon className="h-4 w-4" /> : <Monitor className="h-4 w-4" />;
  const themeLabel = theme === 'light' ? 'Light mode' : theme === 'dark' ? 'Dark mode' : 'System';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-heading text-base font-semibold leading-tight">
              Review Portal
            </h1>
            <p className="text-xs text-muted-foreground">
              IT Governance
            </p>
          </div>
        </div>

        {/* User + Theme */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.department}</p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-heading font-semibold text-sm">
            {user.name.split(' ').map((n) => n[0]).join('')}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 cursor-pointer"
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
      </div>
    </header>
  );
}
