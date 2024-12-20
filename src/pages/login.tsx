import { z } from 'zod';
import { useState, Suspense, lazy } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { validateField, ValidationErrors, loginSchema } from '@/services/authService';
import { loginUser } from '@/features/auth/authSlice';
import { toast } from '@/hooks/use-toast';
import { SerializedError } from '@reduxjs/toolkit';

// Lazy load Header and Footer components
const Header = lazy(() => import('@/components/layout/header'));
const Footer = lazy(() => import('@/components/layout/footer'));

export function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({ username: '', password: '' });

  const handleFieldChange = (field: 'username' | 'password', value: string) => {
    if (field === 'username') setUsername(value);
    if (field === 'password') setPassword(value);

    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields first
    try {
      loginSchema.parse({ username, password });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors: ValidationErrors = { username: '', password: '' };
        err.errors.forEach((error) => {
          const field = error.path[0] as keyof ValidationErrors;
          validationErrors[field] = error.message;
        });
        setErrors(validationErrors);
        toast({
          title: 'Validation Error',
          description: 'Please fix the errors before proceeding.',
          variant: 'destructive',
        });
        return;
      }
    }

    setLoading(true);
    try {
      await dispatch(loginUser({ username, password })).unwrap();
      navigate('/');
      toast({
        title: 'Success',
        description: 'Login successful',
      });
    } catch (err) {
      const error = err as SerializedError;
      setErrors({ 
        username: '', 
        password: error.message || 'An unexpected error occurred. Please try again.' 
      });
      toast({
        title: error.code === 'UNAUTHORIZED' ? 'Invalid Credentials' : 'Error',
        description: error.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>
      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-background via-primary/5 to-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4">
            <div className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Welcome to Gati Desk
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => handleFieldChange('username', e.target.value)}
                  required
                  className="w-full"
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  required
                  className="w-full"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
              <Button
                type="submit"
                disabled={loading || !!errors.username || !!errors.password || !username || !password}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Suspense fallback={<div>Loading Footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default LoginPage;
