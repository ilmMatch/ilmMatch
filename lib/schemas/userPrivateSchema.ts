import { z } from 'zod';

const baseSchema = z.object({
    userName: z.string().min(3, { message: 'Name must be at least 3 characters.' }).max(100),
    dob: z.date({ required_error: 'A date of birth is required.' }),
    gender: z.enum(['brother', 'sister']),
});

const brotherSchema = baseSchema.extend({
    countryCode: z.number().nullable(),
    mobileNumber: z.string()
        .refine((val) => !isNaN(Number(val)), { message: 'Mobile number must be a valid number' })
        .transform(Number)
        .refine((val) => val >= 1000000000 && val <= 9999999999, { message: 'Mobile number must be 10 digits.' }),
    femaleMehramName: z.string().min(3, { message: 'Mehram name must be at least 3 characters.' }).max(100),
    femaleMehramCountryCode: z.number().nullable(),
    femaleMehramNumber: z.string()
        .refine((val) => !isNaN(Number(val)), { message: 'Mehram number must be a valid number' })
        .transform(Number)
        .refine((val) => val >= 1000000000 && val <= 9999999999, { message: 'Mehram number must be 10 digits.' }),
    gender: z.literal('brother'),
});

const sisterSchema = baseSchema.extend({
    waliName: z.string().min(3, { message: 'Wali name must be at least 3 characters.' }).max(100),
    waliCountryCode: z.number().nullable(),
    waliMobileNumber: z.string()
        .refine((val) => !isNaN(Number(val)), { message: 'Wali mobile number must be a valid number' })
        .transform(Number)
        .refine((val) => val >= 1000000000 && val <= 9999999999, { message: 'Wali mobile number must be 10 digits.' }),
    maleMehramName: z.string().min(3, { message: 'Mehram name must be at least 3 characters.' }).max(100),
    maleMehramCountryCode: z.number().nullable(),
    maleMehramNumber: z.string()
        .refine((val) => !isNaN(Number(val)), { message: 'Mehram number must be a valid number' })
        .transform(Number)
        .refine((val) => val >= 1000000000 && val <= 9999999999, { message: 'Mehram number must be 10 digits.' }),
    gender: z.literal('sister'),
});

export const userPrivateSchema = z.discriminatedUnion('gender', [
    brotherSchema,
    sisterSchema,
]);

export type UserPrivateFormValues = z.infer<typeof userPrivateSchema>;

