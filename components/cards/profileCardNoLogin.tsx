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
import { generateRandomColor, getRandomGradientDirection } from './gradient';
import { calculateAge } from '@/lib/utils';
import UserModal from '../modals/userModalNoLogin';

interface UserCardProps {
  user: UserProfile;
}
export default function ProfileCard({
  user,
}: UserCardProps) {

  const age = calculateAge(user.dob);

  return (
    <div className="w-full">
      <Card className="w-full max-md:max-w-3xl md:w-3/5  overflow-hidden my-2 mx-auto border-gray-400">
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
                />
              </div>
            </div>
            <div className="flex-grow p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 max-sm:col-span-2">
                  <CalendarDays className="h-5 w-5 text-gray-400" />
                  <span className="text-sm ">
                    {age} years old, {user.maritalStatus}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">{user.nationality}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">{user.education}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <span className="text-sm ">{user.occupation}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-sm">
                  {user.countryResiding} → {user.countryMoving}
                </span>
              </div>
            </div>
            <div className="p-6 flex-shrink-0 hidden sm:block ">
              <UserModal
                user={user}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// export default ProfileCard;
