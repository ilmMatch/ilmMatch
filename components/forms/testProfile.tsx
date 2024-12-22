"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CommaSeparatedInput } from "./fields/comma-separated-input"
import { userProfileSchema, UserProfileFormValues } from "@/lib/schemas/userProfileSchema"

export function UserProfileForm() {
    const form = useForm<UserProfileFormValues>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            maritalStatus: undefined,
            height: undefined,
            build: "",
            ethnicity: "",
            nationality: "",
            countryResiding: "",
            countryMoving: "",
            born: undefined,
            childern: undefined,
            beard: undefined,
            hijab: "",
            pray: undefined,
            sect: "",
            masjidName: "",
            polygamy: undefined,
            education: "",
            islamicEducation: "",
            islamicEducationProof: "",
            occupation: "",
            languages: [],
            scholars: [],
            spouseAge: { min: undefined, max: undefined },
            briefAboutYou: "",
            spouseBrief: "",
        },
    })

    function onSubmit(values: UserProfileFormValues) {
        console.log("form", values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Personal Information</h2>

                    <FormField
                        control={form.control}
                        name="maritalStatus"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Marital Status</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select marital status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="single">Single</SelectItem>
                                        <SelectItem value="married">Married</SelectItem>
                                        <SelectItem value="divorced">Divorced</SelectItem>
                                        <SelectItem value="widow">Widow</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Height (cm)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : +e.target.value)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="build"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Build</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="ethnicity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ethnicity</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nationality</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="countryResiding"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country of Residence</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="countryMoving"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country Moving To</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="born"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Born Muslim or Revert</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select option" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="born">Born Muslim</SelectItem>
                                        <SelectItem value="revert">Revert</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="childern"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of Children</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : +e.target.value)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Appearance</h2>

                    <FormField
                        control={form.control}
                        name="beard"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Beard</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select option" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                        <SelectItem value="not applicable">Not Applicable</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="hijab"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hijab</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        if (value === "other") {
                                            form.setValue("hijab", "");
                                        } else {
                                            field.onChange(value);
                                        }
                                    }}
                                    value={field.value === "" ? "other" : field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select option" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                        <SelectItem value="not applicable">Not Applicable</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {(field.value === "" || field.value === "other") && (
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Please specify"
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    </FormControl>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Religious Practice</h2>

                    <FormField
                        control={form.control}
                        name="pray"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prayer Habits</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select option" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                        <SelectItem value="yes including tahajjud">Yes, including Tahajjud</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sect"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sect</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="masjidName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Masjid Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="polygamy"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Views on Polygamy</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select option" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                        <SelectItem value="under certain circumstance">Under Certain Circumstances</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Education and Occupation</h2>

                    <FormField
                        control={form.control}
                        name="education"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Education</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="islamicEducation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Islamic Education</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="islamicEducationProof"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Islamic Education Proof</FormLabel>
                                <FormControl>
                                    <Input {...field} type="url" placeholder="https://example.com/proof" />
                                </FormControl>
                                <FormDescription>Provide a link to your Islamic education certificate or proof</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Occupation</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Languages and Scholars</h2>

                    <FormField
                        control={form.control}
                        name="languages"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Languages</FormLabel>
                                <FormControl>
                                    <CommaSeparatedInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Enter languages (comma-separated)"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="scholars"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Scholars</FormLabel>
                                <FormControl>
                                    <CommaSeparatedInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Enter scholars (comma-separated)"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Spouse Preferences</h2>

                    <FormField
                        control={form.control}
                        name="spouseAge.min"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Minimum Spouse Age</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : +e.target.value)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="spouseAge.max"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Maximum Spouse Age</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : +e.target.value)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">About</h2>

                    <FormField
                        control={form.control}
                        name="briefAboutYou"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brief About You</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us about yourself"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="spouseBrief"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brief About Desired Spouse</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe your ideal spouse"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

