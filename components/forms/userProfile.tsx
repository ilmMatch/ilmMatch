'use client';

import { z, ZodNull } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z
  .object({
    fname: z
      .string()
      .min(3, {
        message: 'Name must be at least 3 characters.',
      })
      .max(100),
    dob: z.date(),
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
      fname: '',
      dob: new Date(),
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fname"
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
