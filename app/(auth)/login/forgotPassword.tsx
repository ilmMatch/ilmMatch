'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import Link from 'next/link';

type ForgotPasswordProps = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
};
export default function ForgotPassword({
  email,
  setEmail,
}: ForgotPasswordProps) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { forgetPassword, loading } = useAuth();

  const handlePasswordReset = async (e: React.FormEvent) => {
    setMessage('');
    setError('');

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    setSubmitting(true);

    try {
      await forgetPassword(email);
      setMessage(
        'If the account exists, a password reset email will be sent. Please check your inbox.'
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Link href="#" className="text-primary" onClick={onOpen}>
          Forgot your password?
        </Link>
      </div>
      <Modal backdrop={'blur'} isOpen={isOpen} onClose={onClose} placement={"center"}>
        <ModalContent>
          {(onClose: any) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Forgot Password
              </ModalHeader>
              <ModalBody>
                <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-2 text-gray-800 bg-gray-100 border rounded-lg dark:bg-gray-900 dark:text-gray-100"
                  required
                />
                {message && (
                  <p className="mt-2 text-sm text-green-600 text-center">
                    {message}
                  </p>
                )}
                {error && (
                  <p className="mt-2 text-sm text-red-600 text-center">
                    {error}
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onClick={handlePasswordReset}
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
