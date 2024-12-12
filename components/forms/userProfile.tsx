'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format, getMonth } from 'date-fns';
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
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const formSchema = z.object({
  bornRevert: z.enum(['Born', 'Revert', 'Not Provided']),
});

export default function ProfileForm() {
  const { userDataProfile } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bornRevert: userDataProfile?.bornRevert || 'Not Provided',
    },
  });
  const { reset } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Public Info</CardTitle>
              <CardDescription>
                This information is Public and visible to anyone using Ilm
                Match. Click save when you're done.
              </CardDescription>
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
                          {...field}
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={field.value} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Born">Born</SelectItem>
                            <SelectItem value="Revert">Revert</SelectItem>
                          </SelectContent>
                        </Select>
                        {/* <Input
                                                    placeholder="Name"
                                                    {...field}
                                                /> */}
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              <Button type="submit">Save changes</Button>
              <Button type="button" variant="secondary">
                Edit
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
