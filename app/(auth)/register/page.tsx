'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthProvider';
import { set } from 'date-fns';
import { Eye, Loader, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setuserName] = useState('');
  const [gender, setGender] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signup, loading, currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser]);

  async function handleSubmit() {
    if (!email || !password || password.length < 8 || !userName || !gender) {
      console.log('missing input value/s');
      return;
    }
    setSubmitting(true);
    const data = await signup(email, password, userName, gender);
    if (!data.success) {
      toast.error("Uh oh! Something went wrong.", {
        description: data.error,
      })
    }
    setSubmitting(false);
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
                  <Label htmlFor="userName">Name</Label>

                  <Input
                    type="text"
                    id="userName"
                    name="userName"
                    placeholder="Name"
                    value={userName}
                    onChange={(e) => {
                      setuserName(e.target.value);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="PasswordConfirmation">Gender</Label>
                  <div className="relative flex items-center">
                    <Select onValueChange={setGender} value={gender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brother">Brother</SelectItem>
                        <SelectItem value="sister">Sister</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
