import * as z from "zod"

export const userProfileSchema = z.object({
    briefAboutYou: z.string().min(1, "Brief about you is required"),
    build: z.string().min(1, "Build is required"),
    beard: z.enum(["yes", "no", "not applicable"], {
        required_error: "Beard information is required",
    }),
    born: z.enum(["born", "revert"], {
        required_error: "Born Muslim or Revert is required",
    }),
    countryResiding: z.string().min(1, "Country of residence is required"),
    countryMoving: z.string().min(1, "Country moving to is required"),
    childern: z.number({
        required_error: "Number of children is required",
        invalid_type_error: "Number of children must be a number",
    }).min(0, "Number of children must be 0 or greater"),
    ethnicity: z.string().min(1, "Ethnicity is required"),
    education: z.string().min(1, "Education is required"),
    height: z.number({
        required_error: "Height is required",
        invalid_type_error: "Height must be a number",
    }).positive("Height must be a positive number"),
    hijab: z.string().min(1, "Hijab information is required"),
    islamicEducation: z.string().min(1, "Islamic education is required"),
    islamicEducationProof: z.string().url("Please provide a valid URL for Islamic education proof"),
    languages: z.array(z.string()).min(1, "At least one language is required"),
    maritalStatus: z.enum(["single", "married", "divorced", "widow"], {
        required_error: "Marital status is required",
    }),
    masjidName: z.string().min(1, "Masjid name is required"),
    nationality: z.string().min(1, "Nationality is required"),
    occupation: z.string().min(1, "Occupation is required"),
    pray: z.enum(["yes", "no", "yes including tahajjud"], {
        required_error: "Prayer habits information is required",
    }),
    polygamy: z.enum(["yes", "no", "under certain circumstance"], {
        required_error: "Views on polygamy are required",
    }),
    sect: z.string().min(1, "Sect is required"),
    scholars: z.array(z.string()).min(1, "At least one scholar is required"),
    spouseAge: z.object({
        min: z.number({
            required_error: "Minimum spouse age is required",
            invalid_type_error: "Minimum spouse age must be a number",
        }).positive("Minimum spouse age must be a positive number"),
        max: z.number({
            required_error: "Maximum spouse age is required",
            invalid_type_error: "Maximum spouse age must be a number",
        }).positive("Maximum spouse age must be a positive number"),
    }),
    spouseBrief: z.string().min(1, "Brief about desired spouse is required"),
})

export type UserProfileFormValues = z.infer<typeof userProfileSchema>

