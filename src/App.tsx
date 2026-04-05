import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

import { Landing } from '@/pages/Landing';
import { AppHome } from '@/pages/AppHome';
import { Auth } from '@/pages/Auth';
import { Onboarding } from '@/pages/Onboarding';
import { Planner } from '@/pages/Planner';
import { Dashboard } from '@/pages/Dashboard';
import { SavedPlans } from '@/pages/SavedPlans';
import { Profile } from '@/pages/Profile';
import { Coach } from '@/pages/Coach';
import { Diet } from '@/pages/Diet';
import { Schedule } from '@/pages/Schedule';
import { Progress } from '@/pages/Progress';
import { Workouts } from '@/pages/Workouts';
import { NotFound } from '@/pages/NotFound';
import { About } from '@/pages/About';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
    },
  },
});

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary text-text-primary">
      <Navbar />
      <main className="flex-1 min-h-0 min-w-0 w-full">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#16161f',
                border: '1px solid #2a2a3d',
                color: '#f0f0ff',
              },
            }}
          />
          <Routes>
            <Route
              path="/"
              element={
                <AppLayout>
                  <Landing />
                </AppLayout>
              }
            />
            <Route
              path="/about"
              element={
                <AppLayout>
                  <About />
                </AppLayout>
              }
            />
            <Route path="/auth" element={<Auth />} />

            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AppHome />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/coach"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Coach />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/diet"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Diet />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Schedule />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Progress />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Workouts />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/planner"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Planner />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/plans"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SavedPlans />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route
              path="*"
              element={
                <AppLayout>
                  <NotFound />
                </AppLayout>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
