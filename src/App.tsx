import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RootLayout } from '@/components/layout/root-layout';
import { LoginPage } from '@/pages/login';
import { HomePage } from '@/pages/home';
import { TranslatePage } from '@/pages/translate';
import type { RootState } from '@/lib/store';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <RootLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/translate" element={<TranslatePage />} />
      </Route>
    </Routes>
  );
}

export default App;