'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
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
import { Input } from '@/components/ui/input';

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(3, {
        message: 'Name must be at least 3 characters.',
      })
      .max(100),
    lastName: z
      .string()
      .min(3, {
        message: 'Name must be at least 3 characters.',
      })
      .max(100),
    mobileNumber: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: 'Mobile number must be a valid number',
      })
      .transform(Number)
      .refine((val) => val >= 1000000000 && val <= 9999999999, {
        message: 'Mobile number must be 10 digits.',
      })
      .nullable(),
    waliMobileNumber: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: 'Mobile number must be a valid number',
      })
      .transform(Number)
      .refine((val) => val >= 1000000000 && val <= 9999999999, {
        message: 'Mobile number must be 10 digits.',
      })
      .nullable(),
    dob: z.date({
      required_error: 'A date of birth is required.',
    }),
  })
  .refine((data) => data.mobileNumber !== data.waliMobileNumber, {
    message: 'Mobile number and Wali Mobile number must be different.',
    path: ['waliMobileNumber'],
  });

// z.string().max(5);
// z.string().min(5);
// z.string().length(5);
// z.string().email();
// z.string().url();
// z.string().date();
// z.string({
//   required_error: "Name is required",
//   invalid_type_error: "Name must be a string",
// });
// z.date().min(new Date("1900-01-01"), { message: "Too old" });
// z.date().max(new Date(), { message: "Too young!" });
// z.enum(["Admin", "User", "Trout"]);

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      mobileNumber: null,
      waliMobileNumber: null,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormDescription>This will be private.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormDescription>This will be private.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Mobile Number"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormDescription>This will be private.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="waliMobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wali Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Wali Number"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormDescription>This will be private.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      defaultMonth={new Date(new Date().getFullYear(), 0)}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1940-01-01')
                      }
                      initialFocus
                      captionLayout="dropdown"
                      fromYear={1920}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Your date of birth is used to calculate your age.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
