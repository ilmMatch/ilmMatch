import React from 'react';
import { CalendarDays, MapPin, GraduationCap, Briefcase, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPrivate, UserProfile } from '@/types/firebase';
import UserModal from '../userModal';


interface UserCardProps {
    user: UserProfile;
    setStateUsers: (newData: UserProfile[]) => void;
    stateUsers: UserProfile[];
    privateInfo?: UserPrivate
}
export default function ProfileCard({ user, setStateUsers, stateUsers, privateInfo }: UserCardProps) {
    // const ProfileCard: React.FC<{ user: UserProfile }> = ({ user }) => {
    const calculateAge = (dob: { seconds: number; nanoseconds: number }) => {
        const birthDate = new Date(dob.seconds * 1000);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const age = calculateAge(user.dob);

    return (
        <Card className="w-full max-w-3xl overflow-hidden">
            <CardContent className="p-0">
                <div className="flex items-center bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="p-6 flex-shrink-0">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                            <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                                {user.initials}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-grow p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <CalendarDays className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">{age} years old, {user.maritalStatus}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">{user.nationality}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <GraduationCap className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">{user.education}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Briefcase className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">{user.occupation}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center space-x-2">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">
                                {user.countryResiding} → {user.countryMoving}
                            </span>
                        </div>
                    </div>
                    <div className="p-6 flex-shrink-0">

                        <UserModal user={user} setStateUsers={setStateUsers} stateUsers={stateUsers} privateInfo={privateInfo} />

                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// export default ProfileCard;

