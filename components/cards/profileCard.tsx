import React from 'react';
import {
  CalendarDays,
  MapPin,
  GraduationCap,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserPrivate, UserProfile } from '@/types/firebase';
import UserModal from '../userModal';
import { generateRandomColor, getRandomGradientDirection } from './gradient';

interface UserCardProps {
  user: UserProfile;
  setStateUsers: (newData: UserProfile[]) => void;
  stateUsers: UserProfile[];
  privateInfo?: UserPrivate;
}
export default function ProfileCard({
  user,
  setStateUsers,
  stateUsers,
  privateInfo,
}: UserCardProps) {
  // const ProfileCard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const calculateAge = (dob: { seconds: number; nanoseconds: number }) => {
    const birthDate = new Date(dob.seconds * 1000);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const age = calculateAge(user.dob);

  return (
    <div className="w-full">
      <Card className="w-full max-md:max-w-3xl md:w-4/5  overflow-hidden my-2 mx-auto">
        <CardContent className="p-0">
          <div className="flex items-center max-sm:flex-col">
            <div className="p-6 sm:flex-shrink-0 flex items-center justify-between max-sm:w-11/12">
              <Avatar className="h-24 w-24 border-4 border-muted shadow-lg">
                <AvatarFallback
                  className={`text-2xl font-bold  text-white`}
                  style={{
                    background: `linear-gradient(${getRandomGradientDirection()}, ${generateRandomColor(40)}, ${generateRandomColor(46)})`,
                  }}
                >
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="p-6 flex-shrink-0 sm:hidden">
                <UserModal
                  user={user}
                  setStateUsers={setStateUsers}
                  stateUsers={stateUsers}
                  privateInfo={privateInfo}
                />
              </div>
            </div>
            <div className="flex-grow p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 max-sm:col-span-2">
                  <CalendarDays className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {age} years old, {user.maritalStatus}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {user.nationality}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {user.education}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {user.occupation}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {user.countryResiding} → {user.countryMoving}
                </span>
              </div>
            </div>
            <div className="p-6 flex-shrink-0 hidden sm:block ">
              <UserModal
                user={user}
                setStateUsers={setStateUsers}
                stateUsers={stateUsers}
                privateInfo={privateInfo}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// export default ProfileCard;
