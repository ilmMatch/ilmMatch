'use client';
import { useAuth } from '@/context/AuthProvider';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ForgotPassword from './forgotPassword';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Mail } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authenticating, setAuthenticating] = useState(false);
  const { login, loading, currentUser } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser]);
  async function handleSubmit() {
    if (!email || !password || password.length < 6) {
      return;
    }
    setAuthenticating(true);

    try {
      await login(email, password);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setAuthenticating(false);
    }
  }

  if (loading) {
    return <>Loading</>;
  }
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-var(--navbar-height))]">
      <div className="max-w-md w-full">
        <div className="p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h2 className="text-center text-2xl font-bold">Sign in</h2>
          <div className="mt-8 space-y-6">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative flex items-center">
                <Input
                  name="username"
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <Mail className="w-4 h-4 absolute right-4"></Mail>
              </div>
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative flex items-center">
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <Eye className="w-4 h-4 absolute right-4 cursor-pointer" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm">
                <ForgotPassword email={email} setEmail={setEmail} />
              </div>
            </div>

            <div className="!mt-8">
              <Button
                onClick={handleSubmit}
                className="w-full py-3 px-4 text-sm tracking-wide "
              >
                {authenticating ? 'Submitting' : 'Submit'}
              </Button>
            </div>
            <p className="text-sm !mt-8 text-center">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-primary hover:underline ml-1 whitespace-nowrap font-semibold"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
