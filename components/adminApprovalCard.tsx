'use client'
import React, { useState } from 'react';
import { CalendarDays, MapPin, GraduationCap, Briefcase, Phone, Mail, User, ChevronRight, Loader2, Link } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPrivate, UserProfile } from '@/types/firebase';
import UserModal from './userModal';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthProvider';


interface UserCardProps {
    user: UserProfile;
    setStateUsers: (newData: UserProfile[]) => void;
    stateUsers: UserProfile[];
    privateInfo: UserPrivate
}

export default function AdminApprovalCard({ user, setStateUsers, stateUsers, privateInfo }: UserCardProps) {

    // const AdminApprovalCard: React.FC<AdminApprovalCardProps> = ({ privateInfo, user, onApprove, onReject, onViewMore }) => {
    const calculateAge = (dob: { seconds: number; nanoseconds: number }) => {
        const birthDate = new Date(dob.seconds * 1000);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const age = calculateAge(user.dob);

    const [submitting, setSubmitting] = useState(false);
    const { approvalUpdate, roleManager } = useAuth();

    const updateUser = (state: string | undefined, statusFrom: string) => {
        const updatedUsers = stateUsers.map((stateUser) =>
            stateUser.id === user.id ? {
                ...stateUser,
                status: state,
                ...(state === undefined ? { statusFrom: undefined } : { statusFrom })
            } : stateUser
        );
        setStateUsers(updatedUsers);
    }
    const handleUserApproveClickAdmin = async (status: string) => {
        setSubmitting(true);
        const voidResult = await approvalUpdate(status, user.id);
        if (voidResult.success) {
            updateUser(status, 'adminApprove') //updates the setUsers in parent component
            toast.success("Success", {
                description: status == "approved" ? "User Profile Approved" : "User Profile not Approved",
            })
            setSubmitting(false);
            return
        }
        toast.error("Uh oh! Something went wrong.", {
            description: voidResult.error,
        })
        setSubmitting(false);
        return
    };

    const handleRole = async (role: string) => {
        setSubmitting(true);
        const voidResult = await roleManager(user.id, role);
        if (voidResult.success) {
            toast.success("Success", {
                description: "Role Updated",
            })
            updateUser(role, 'adminAssign')
            setSubmitting(false);
            return
        }
        toast.error("Uh oh! Something went wrong.", {
            description: voidResult.error,
        })
        setSubmitting(false);
        return
    }

    return (
        <Card className="w-full max-w-4xl overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-start space-x-6 flex-col md:flex-row">
                    <div className='md:w-[12%] flex justify-center items-center'>
                        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                            <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 text-white">
                                {user.initials}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{privateInfo.userName}</h2>
                                <p className="text-sm text-gray-500">{privateInfo.gender}</p>
                            </div>
                            <Badge variant={user.status === 'requested' || 'user' ? 'outline' : 'approved'}>
                                {user.status}
                            </Badge>
                        </div>
                        <div className="mt-4 grid md:grid-cols-2 grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <CalendarDays className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">{age} years old, {user.maritalStatus}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">{user.nationality}, {user.countryResiding}</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Phone className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">+{privateInfo.countryCode}{" "}{privateInfo.mobileNumber}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">{privateInfo.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <User className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">Wali: {privateInfo.waliName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">Wali: +{privateInfo.waliCountryCode}{" "}{privateInfo.waliMobileNumber}</span>
                            </div>
                            <div className="flex items-center space-x-2 col-span-3">
                                <Link className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">Islamic Education jjkjbskdjfbilzdugf sdhbflasidhflidsb</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className=" flex justify-between items-center">
                <div className="flex space-x-2">

                    {user.statusFrom == 'adminApprove' &&
                        <>
                            <Button variant="destructive" onClick={() => handleUserApproveClickAdmin('notApproved')} disabled={submitting} >
                                {submitting && <Loader2 className="animate-spin" />}Reject</Button>
                            <Button variant="default" onClick={() => handleUserApproveClickAdmin('approved')} disabled={submitting} >
                                {submitting && <Loader2 className="animate-spin" />}Approve</Button>
                        </>}

                    {user.statusFrom == 'adminAssign' &&
                        user.status === 'user'
                        ? (
                            <>
                                <Button
                                    disabled={submitting}
                                    onClick={() => handleRole('admin')}
                                    variant="default"
                                >
                                    {submitting && <Loader2 className="animate-spin" />}
                                    Make Admin
                                </Button>
                            </>
                        )
                        :
                        user.status === 'admin' &&
                        (
                            <>
                                <Button
                                    disabled={submitting}
                                    onClick={() => handleRole('user')}
                                    variant="destructive"
                                >
                                    {submitting && <Loader2 className="animate-spin" />}
                                    Remove Admin
                                </Button>
                            </>
                        )

                    }
                </div>
                <UserModal user={user} setStateUsers={setStateUsers} stateUsers={stateUsers} privateInfo={privateInfo} />
            </CardFooter>
        </Card >
    );
};

// export default AdminApprovalCard;

