import { PartyPopper, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function EmptyState() {
  return (
    <Card className="animate-fade-in-up border-success/20 bg-gradient-to-br from-success/5 via-background to-primary/5">
      <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="animate-celebrate mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
            <PartyPopper className="h-10 w-10" />
          </div>
        </div>

        <h2 className="font-heading text-2xl font-bold mb-2">
          All Done! 🎉
        </h2>
        <p className="text-muted-foreground text-base max-w-md mb-2">
          You've completed all your pending reviews. Thank you for helping keep our
          digital workspace clean and secure.
        </p>

        <div className="flex items-center gap-6 mt-6 mb-8">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <span className="text-xs text-muted-foreground">Workspaces</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 text-warning-foreground">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <span className="text-xs text-muted-foreground">Access</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <span className="text-xs text-muted-foreground">Licenses</span>
          </div>
        </div>

        <Button variant="outline" className="cursor-pointer gap-2">
          Close this page
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
