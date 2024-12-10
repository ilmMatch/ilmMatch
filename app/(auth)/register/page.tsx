'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthProvider';
import { Eye, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fName, setfName] = useState('');
  const [lName, setlName] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signup, loading, currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser]);

  async function handleSubmit() {
    if (!email || !password || password.length < 8 || !fName || !lName) {
      return;
    }
    setSubmitting(true);
    try {
      await signup(email, password, fName, lName);
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <>Loading</>;
  }
  return (
    <section className="flex flex-col items-center justify-center h-[calc(100vh-var(--navbar-height))]">
      <div className="max-w-lg w-full">
        <main className="p-4 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="">
            <h2 className="text-center text-2xl font-bold">Sign up</h2>
            <div className="mt-8 space-y-2 md:space-y-4">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="">
                  <Label htmlFor="FirstName">First Name</Label>

                  <Input
                    type="text"
                    id="FirstName"
                    name="first_name"
                    placeholder="First Name"
                    value={fName}
                    onChange={(e) => {
                      setfName(e.target.value);
                    }}
                  />
                </div>

                <div className="">
                  <Label htmlFor="LastName">Last Name</Label>

                  <Input
                    type="text"
                    id="LastName"
                    name="last_name"
                    placeholder="Last Name"
                    value={lName}
                    onChange={(e) => {
                      setlName(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="">
                <Label htmlFor="Email">Email</Label>
                <div className="relative flex items-center">
                  <Input
                    name="email"
                    type="email"
                    id="Email"
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
              <div className="flex flex-col md:flex-row gap-2">
                <div className="">
                  <Label htmlFor="Password">Password</Label>
                  <div className="relative flex items-center">
                    <Input
                      type="password"
                      id="Password"
                      name="password"
                      placeholder="Password"
                      value={[password]}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    <Eye className="w-4 h-4 absolute right-4 cursor-pointer" />
                  </div>
                </div>

                <div className="">
                  <Label htmlFor="PasswordConfirmation">Confirm Password</Label>
                  <div className="relative flex items-center">
                    <Input
                      type="password"
                      id="PasswordConfirmation"
                      name="password_confirmation"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setconfirmPassword(e.target.value);
                      }}
                    />
                    <Eye className="w-4 h-4 absolute right-4 cursor-pointer" />
                  </div>
                </div>
              </div>
              {/* <div className="col-span-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By creating an account, you agree to our
              <a href="#" className="text-gray-700 underline dark:text-gray-200">
                terms and conditions
              </a>
              and
              <a href="#" className="text-gray-700 underline dark:text-gray-200"> privacy policy </a>.
            </p>
          </div> */}

              <div className="flex flex-col space-y-2 md:space-y-4 mt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-12 w-fit"
                >
                  {!submitting ? 'Create an account' : 'Creating account'}
                </Button>

                <Link href="/login" className="text-sm">
                  Already have an account?{' '}
                  <span className=" text-primary">Log in</span>.
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
