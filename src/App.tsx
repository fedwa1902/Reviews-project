import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { ReviewDashboard } from '@/components/reviews/ReviewDashboard';
import { ReviewDetailPage } from '@/components/reviews/ReviewDetailPage';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { AnalyticsPage } from '@/components/dashboard/AnalyticsPage';
import { UsersPage } from '@/components/dashboard/UsersPage';
import { SettingsPage } from '@/components/dashboard/SettingsPage';
import { NotFoundPage } from '@/components/NotFoundPage';
import { ReviewsProvider } from '@/hooks/useReviews';

function App() {
  return (
    <ThemeProvider>
      <ReviewsProvider>
      <TooltipProvider delayDuration={300}>
        <BrowserRouter basename="/Reviews-project">
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <DashboardHeader />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<DashboardOverview />} />
                  <Route path="/reviews" element={<ReviewDashboard />} />
                  <Route path="/reviews/:id" element={<ReviewDetailPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/activity" element={<AnalyticsPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/users/*" element={<UsersPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/settings/*" element={<SettingsPage />} />
                  <Route path="/reports" element={<AnalyticsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
            </SidebarInset>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
      </ReviewsProvider>
    </ThemeProvider>
  );
}

export default App;
