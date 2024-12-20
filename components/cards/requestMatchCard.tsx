'use client'
import React, { useState } from 'react';
import { CalendarDays, MapPin, GraduationCap, Briefcase, ChevronRight, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPrivate, UserProfile } from '@/types/firebase';
import UserModal from '../userModal';



interface RequestCardProps {
    profile1: UserProfile;
    profile2: UserProfile;
    privateInfo1: UserPrivate
    privateInfo2: UserPrivate
    handleMatchClick: (brother: UserPrivate, sister: UserPrivate) => void;
}

function ProfileCard({ profile, privateInfo }: { profile: UserProfile, privateInfo: UserPrivate }) {
    const [stateUsers, setStateUsers] = useState<UserProfile[]>([]);
    return (
        <Card className="w-full max-w-md overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
                        <AvatarFallback className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                            {profile.initials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">{privateInfo.userName}</h2>
                        <p className="text-sm text-gray-500">{profile.occupation}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="flex items-center space-x-2">
                        <CalendarDays className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">age years, {profile.maritalStatus}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">{profile.nationality}, {profile.countryResiding} → {profile.countryMoving}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <GraduationCap className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">{profile.education}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">{profile.occupation}</span>
                    </div>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                    <strong>Preferred spouse age:</strong> {profile.spouseAge}
                </div>
                <UserModal user={profile} privateInfo={privateInfo} stateUsers={stateUsers} setStateUsers={setStateUsers} />
            </CardContent>
        </Card>
    )
}

export default function MatchProfilesComponent({ profile1, profile2, privateInfo1, privateInfo2, handleMatchClick }: RequestCardProps) {

    return (
        <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch space-y-6 md:space-y-0 md:space-x-6 p-6 bg-gray-100 min-h-screen">
            <ProfileCard profile={profile1} privateInfo={privateInfo1} />
            <div className="flex flex-col justify-center">
                <Button onClick={() => handleMatchClick(privateInfo1, privateInfo2)} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                    <Heart className="h-6 w-6 mr-2" />
                    Match
                </Button>
            </div>
            <ProfileCard profile={profile2} privateInfo={privateInfo2} />
        </div>
    );
};


