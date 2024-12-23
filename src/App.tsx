import React, { Suspense } from 'react'; // Import React and Suspense here
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RootLayout } from '@/components/layout/root-layout';
import { RootState } from '@/lib/store';

// Lazy loading components
const LoginPage = React.lazy(() => import('@/pages/login'));
const HomePage = React.lazy(() => import('@/pages/home'));
const TranslatePage = React.lazy(() => import('@/pages/translate'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute><RootLayout /></ProtectedRoute>}>
          <Route path="/" element={<HomePage />} />
          <Route path="/translate" element={<TranslatePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
