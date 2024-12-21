'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import Link from 'next/link';
import ForgotPassword from '@/app/(auth)/login/forgotPassword';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Mail } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginModal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authenticating, setAuthenticating] = useState(false);
  const { login, loading, currentUser } = useAuth();
  const router = useRouter();

  async function handleSubmit() {
    if (!email || !password || password.length < 6) {
      return;
    }
    setAuthenticating(true);

    const data = await login(email, password);
    if (!data.success) {
      toast.error('Uh oh! Something went wrong.', {
        description: data.error,
      });
    }
    setAuthenticating(false);
  }

  function handleClose() {
    router.push('/');
  }
  return (
    <>
      <Modal
        backdrop={'blur'}
        isOpen={true}
        onClose={handleClose}
        placement={'center'}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose: any) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Sign in</ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center justify-center">
                  <div className="max-w-md w-full">
                    <div className="px-8">
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
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={handleSubmit}
                  disabled={authenticating}
                >
                  {authenticating ? 'Submitting' : 'Submit'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
