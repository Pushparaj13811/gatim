import { AppDispatch } from '@/lib/store';
import { loginUser } from '@/features/auth/authSlice';
import { toast } from '@/hooks/use-toast';
import { SerializedError } from '@reduxjs/toolkit';
import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginData = {
    username: string;
    password: string;
};

export type ValidationErrors = {
    username: string;
    password: string;
};

export const validateField = (field: keyof ValidationErrors, value: string): string => {
    try {
        const schema = field === 'username' 
            ? loginSchema.pick({ username: true }) 
            : loginSchema.pick({ password: true });
        schema.parse({ [field]: value });
        return '';
    } catch (err) {
        if (err instanceof z.ZodError) {
            return err.errors[0]?.message || '';
        }
        return '';
    }
};

export const handleLogin = async (
    data: LoginData,
    dispatch: AppDispatch,
    navigate: (path: string) => void,
    setLoading: (loading: boolean) => void,
    setErrors: (errors: ValidationErrors) => void
): Promise<void> => {
    const { username, password } = data;

    // Validate all fields
    try {
        loginSchema.parse({ username, password });
    } catch (err) {
        if (err instanceof z.ZodError) {
            const validationErrors: ValidationErrors = { username: '', password: '' };
            err.errors.forEach((error) => {
                const field = error.path[0] as keyof LoginData;
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
    } catch (err: unknown) {
        const error = err as SerializedError;
        console.log(error.message);
        // Check for unauthorized error
        if (error.message === 'Invalid login details.') {
            console.log(error.message);
            toast({
                title: 'Invalid Credentials',
                description: 'The username or password you entered is incorrect.',
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Error',
                description: error.message || 'Login failed. Please check your credentials.',
                variant: 'destructive',
            });
        }
    } finally {
        setLoading(false);
    }
};
