'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format, getMonth, set } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { badgeVariants } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthProvider';
import { use, useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import Link from 'next/link';

const formSchema = z.object({
  bornRevert: z.enum(['Born', 'Revert', 'Not Provided']),
});

export default function ProfileForm() {
  const { userDataProfile, approvalUpdate, loading, currentUser } = useAuth();
  const [editing, setEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bornRevert: userDataProfile?.bornRevert || 'Not Provided',
    },
  });
  const { reset } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setEditing(false);
  }
  async function requestReview() {
    if (!currentUser) throw 'you must be logged in';
    console.log(currentUser);
    const data = await approvalUpdate('requested', currentUser.uid);
    if (!data.success) {
      console.log(data.error);
      // add toast
    }
  }

  if (loading) {
    return <>loading</>;
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader className="relative">
              <CardTitle>Public Info</CardTitle>
              <CardDescription>
                This information is Public and visible to anyone using Ilm
                Match. Click save when you're done.
              </CardDescription>
              <span
                className={cn(
                  'absolute top-2 right-2 capitalize',
                  userDataProfile?.approved === 'requested' &&
                  badgeVariants({ variant: 'requested' }),
                  userDataProfile?.approved === 'approved' &&
                  badgeVariants({ variant: 'approved' }),
                  userDataProfile?.approved === 'notApproved' &&
                  badgeVariants({ variant: 'notApproved' })
                )}
                onClick={requestReview}
              >
                {userDataProfile?.approved}
              </span>
            </CardHeader>
            <CardContent className="space-y-2">
              Name: {userDataProfile?.initials}
              <FormField
                control={form.control}
                name="bornRevert"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center flex-grow">
                      <FormLabel className="min-w-32 ">
                        Born or Revert
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger
                            className={cn(
                              'flex-grow',
                              !editing &&
                              'inline outline-none border-none disabled:text-foreground disabled:cursor-default'
                            )}
                            disabled={!editing}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Born">Born</SelectItem>
                            <SelectItem value="Revert">Revert</SelectItem>
                            <SelectItem value="Not Provided" className="hidden">
                              Not Provided
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              {editing && (
                <span className="flex gap-2 ">
                  {' '}
                  <Button type="submit">Save changes</Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      reset();
                      setEditing(false);
                    }}
                  >
                    cancel
                  </Button>
                </span>
              )}
              {!editing && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
              )}
              {userDataProfile?.approved === 'not approved' && (
                <Button type="button" variant="outline" onClick={requestReview}>
                  Request Review
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
