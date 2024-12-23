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
import { Label } from "../ui/label"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthProvider"
import { toast } from "sonner"
import { Card, CardContent, CardFooter, CardHeader, CardDescription, CardTitle, } from "../ui/card"
import { badgeVariants } from "../ui/badge"
import { cn } from '@/lib/utils';

export function UserProfileForm() {
    const [otherValue, setOtherValue] = useState(""); // State for "other" input
    const { userProfileUpdate, approvalUpdate, currentUser, userDataProfile } = useAuth();
    const [editing, setEditing] = useState(false);

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
    const { reset } = form;
    useEffect(() => {
        if (userDataProfile) {
            reset({

                ...userDataProfile,
                // beard: userDataProfile.beard,
                // born: userDataProfile.born,
                // briefAboutYou: userDataProfile.briefAboutYou,
                // build: userDataProfile.build,
                // childern: userDataProfile.childern,
                // countryMoving: userDataProfile.countryMoving,
                // countryResiding: userDataProfile.countryResiding,
                // education: userDataProfile.education,
                // ethnicity: userDataProfile.ethnicity,
                // height: userDataProfile.height,
                // hijab: userDataProfile.hijab,
                // islamicEducation: userDataProfile.islamicEducation,
                // islamicEducationProof: userDataProfile.islamicEducationProof,
                // languages: userDataProfile.languages,
                // maritalStatus: userDataProfile?.maritalStatus,
                // masjidName: userDataProfile.masjidName,
                // nationality: userDataProfile.nationality,
                // occupation: userDataProfile.occupation,
                // pray: userDataProfile.pray,
                // polygamy: userDataProfile.polygamy,
                // sect: userDataProfile.sect,
                // scholars: userDataProfile.scholars,
                // spouseAge: { min: userDataProfile.spouseAge.min, max: userDataProfile.spouseAge.max },
                // spouseBrief: userDataProfile.spouseBrief,
            });
        }
    }, [userDataProfile, reset]);

    async function onSubmit(values: UserProfileFormValues) {
        const updatedValues = {
            ...values,
            hijab: values.hijab === "other" ? otherValue : values.hijab, // Replace "other" with otherValue
        };
        const result = await userProfileUpdate(updatedValues);
        if (!result.success) {
            toast.error('Uh oh! Something went wrong.', {
                description: result.error,
            });
            setEditing(false);
            return
        }

        toast.success('Success', {
            description: 'Your profile has been updated',
        })
        setEditing(false);
    }



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-auto">
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
                        >
                            {userDataProfile?.approved}
                        </span>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-8 md:grid-cols-2">
                            <div className="space-y-4 bg-card md:p-6 rounded-lg shadow-sm">
                                <h2 className="text-2xl font-bold text-primary">Personal Information</h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="maritalStatus"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Marital Status</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}
                                                    disabled={!editing}>
                                                    <FormControl>
                                                        <SelectTrigger className={cn(!editing && 'disabled:cursor-default')}>
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
                                        name="childern"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Number of Children</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : +e.target.value)}
                                                        className={cn(!editing && 'disabled:cursor-default')}
                                                        disabled={!editing}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>



                                <FormField
                                    control={form.control}
                                    name="nationality"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nationality</FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                    className={cn(!editing && 'disabled:cursor-default')}
                                                    disabled={!editing} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="countryResiding"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Country of Residence</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className={cn(!editing && 'disabled:cursor-default')}
                                                        disabled={!editing} />
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
                                                <FormLabel>Country To Marry/Move in</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className={cn(!editing && 'disabled:cursor-default')}
                                                        disabled={!editing} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
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
                                                    editing={editing}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                            </div>

                            <div className="space-y-4 bg-card md:p-6 rounded-lg shadow-sm">
                                <h2 className="text-2xl font-bold text-primary">Appearance</h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="beard"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Beard</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={!editing}>
                                                    <FormControl>
                                                        <SelectTrigger className={cn(!editing && 'disabled:cursor-default')}>
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
                                        render={({ field }) => {

                                            const handleValueChange = (value: string) => {
                                                if (value === "other") {
                                                    setOtherValue(""); // Reset the "other" input when selected
                                                    field.onChange(value);
                                                } else {
                                                    setOtherValue(""); // Clear the "other" value when another option is selected
                                                    field.onChange(value);
                                                }
                                            };

                                            return (
                                                <FormItem>
                                                    <FormLabel>Hijab</FormLabel>
                                                    <Select
                                                        onValueChange={handleValueChange}
                                                        value={
                                                            field.value
                                                        } // Show "other" when selected
                                                        disabled={!editing}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className={cn(!editing && 'disabled:cursor-default')}>
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
                                                    {field.value === "other" && (
                                                        <FormControl>
                                                            <Input
                                                                value={otherValue} // Use "otherValue" for the input
                                                                placeholder="Please specify"
                                                                onChange={(e) => {
                                                                    const inputValue = e.target.value;
                                                                    setOtherValue(inputValue);
                                                                    // field.onChange(inputValue); 
                                                                }}
                                                                className={cn(!editing && 'disabled:cursor-default')}
                                                                disabled={!editing}
                                                            />
                                                        </FormControl>
                                                    )}
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />

                                </div>

                                <FormField
                                    control={form.control}
                                    name="ethnicity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ethnicity</FormLabel>
                                            <FormControl>
                                                <Input {...field} className={cn(!editing && 'disabled:cursor-default')}
                                                    disabled={!editing} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="height"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Height (cm)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : +e.target.value)} className={cn(!editing && 'disabled:cursor-default')}
                                                        disabled={!editing} />
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
                                                    <Input {...field} className={cn(!editing && 'disabled:cursor-default')}
                                                        disabled={!editing} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 bg-card md:p-6 rounded-lg shadow-sm">
                                <h2 className="text-2xl font-bold text-primary">Religious</h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="pray"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Prayer Habits</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={!editing}>
                                                    <FormControl>
                                                        <SelectTrigger className={cn(!editing && 'disabled:cursor-default')}>
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
                                        name="born"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Born Muslim or Revert</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={!editing}>
                                                    <FormControl>
                                                        <SelectTrigger className={cn(!editing && 'disabled:cursor-default')}>
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
                                </div>

                                <FormField
                                    control={form.control}
                                    name="sect"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sect</FormLabel>
                                            <FormControl>
                                                <Input {...field} className={cn(!editing && 'disabled:cursor-default')}
                                                    disabled={!editing} />
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
                                            <FormLabel>Masjid Name You Go To</FormLabel>
                                            <FormControl>
                                                <Input {...field} className={cn(!editing && 'disabled:cursor-default')}
                                                    disabled={!editing} />
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
                                                    editing={editing}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4 bg-card md:p-6 rounded-lg shadow-sm">
                                <h2 className="text-2xl font-bold text-primary">Education and Occupation</h2>
                                <FormField
                                    control={form.control}
                                    name="education"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Education</FormLabel>
                                            <FormControl>
                                                <Input {...field} className={cn(!editing && 'disabled:cursor-default')}
                                                    disabled={!editing} />
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
                                                <Input {...field} className={cn(!editing && 'disabled:cursor-default')}
                                                    disabled={!editing} />
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
                                                <Input {...field} type="url" placeholder="https://example.com/proof" className={cn(!editing && 'disabled:cursor-default')}
                                                    disabled={!editing} />
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
                                                <Input {...field} className={cn(!editing && 'disabled:cursor-default')}
                                                    disabled={!editing} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>


                            <div className="space-y-4 bg-card md:p-6 rounded-lg shadow-sm md:col-span-2">
                                <h2 className="text-2xl font-bold text-primary">Spouse Preferences</h2>
                                <div className="grid gap-4 sm:grid-cols-2 items-end">
                                    <FormField
                                        control={form.control}
                                        name="polygamy"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Will you consider Polygamy</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={!editing}>
                                                    <FormControl>
                                                        <SelectTrigger className={cn(!editing && 'disabled:cursor-default')}>
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

                                    <div className="flex gap-2 justify-center items-center">
                                        <Label className="min-w-fit">Spouse Age:</Label>
                                        <FormField
                                            control={form.control}
                                            name="spouseAge.min"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="number" {...field} placeholder="Min" onChange={e => field.onChange(e.target.value === "" ? undefined : +e.target.value)} className={cn(!editing && 'disabled:cursor-default')}
                                                            disabled={!editing} />
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
                                                    <FormControl>
                                                        <Input type="number" {...field} placeholder="Max" onChange={e => field.onChange(e.target.value === "" ? undefined : +e.target.value)}
                                                            className={cn(!editing && 'disabled:cursor-default')}
                                                            disabled={!editing} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 bg-card md:p-6 rounded-lg shadow-sm">
                            <h2 className="text-2xl font-bold text-primary">About</h2>
                            <FormField
                                control={form.control}
                                name="briefAboutYou"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Brief About You</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us about yourself"
                                                className={cn(!editing && 'disabled:cursor-default resize-none')}
                                                disabled={!editing}
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
                                                className={cn(!editing && 'disabled:cursor-default resize-none')}
                                                disabled={!editing}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    {/* <Button type="submit" className="w-full md:w-auto">Submit</Button> */}
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

                    </CardFooter>
                </Card>

            </form>
        </Form>
    )
}

