import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Construction, Home } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract a readable page name from the path
  const pageName = location.pathname
    .split('/')
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' / ') || 'This page';

  return (
    <div className="flex items-center justify-center min-h-[75vh] p-6">
      <div className="text-center max-w-md space-y-6">
        {/* Icon */}
        <div className="relative mx-auto w-fit">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 mx-auto">
            <Construction className="h-10 w-10 text-indigo-500" />
          </div>
          <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-400 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
            !
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Coming Soon
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            <span className="font-medium text-foreground">{pageName}</span> is currently under development. 
            We're working hard to bring this feature to you.
          </p>
        </div>

        {/* Progress hint */}
        <div className="flex items-center justify-center gap-1.5">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i <= 3 ? 'w-6 bg-indigo-500' : 'w-4 bg-muted'}`} />
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">Development in progress</p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="gap-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
