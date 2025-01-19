'use client';
import React, { useState } from 'react';
import {
  CalendarDays,
  MapPin,
  GraduationCap,
  Briefcase,
  Phone,
  Mail,
  User,
  ChevronRight,
  Loader2,
  Link,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPrivate, UserProfile } from '@/types/firebase';
import UserModal from '../modals/userModal';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthProvider';
import { generateRandomColor, getRandomGradientDirection } from './gradient';
import { calculateAge } from '@/lib/utils';

interface UserCardProps {
  user: UserProfile;
  setStateUsers: (newData: UserProfile[]) => void;
  stateUsers: UserProfile[];
  privateInfo: UserPrivate;
}

export default function VolunteerApprovalCard({
  user,
  setStateUsers,
  stateUsers,
  privateInfo,
}: UserCardProps) {
  // const AdminApprovalCard: React.FC<AdminApprovalCardProps> = ({ privateInfo, user, onApprove, onReject, onViewMore }) => {

  const age = calculateAge(user.dob);

  const [submitting, setSubmitting] = useState(false);
  const { approvalUpdate, roleManager } = useAuth();

  const updateUser = (state: string | undefined, statusFrom: string) => {
    const updatedUsers = stateUsers.map((stateUser) =>
      stateUser.id === user.id
        ? {
          ...stateUser,
          status: state,
          ...(state === undefined
            ? { statusFrom: undefined }
            : { statusFrom }),
        }
        : stateUser
    );
    setStateUsers(updatedUsers);
  };
  const handleUserApproveClickAdmin = async (status: string) => {
    setSubmitting(true);
    const voidResult = await approvalUpdate(status, user.id);
    if (voidResult.success) {
      updateUser(status, 'adminApprove'); //updates the setUsers in parent component
      toast.success('Success', {
        description:
          status == 'approved'
            ? 'User Profile Approved'
            : 'User Profile not Approved',
      });
      setSubmitting(false);
      return;
    }
    toast.error('Uh oh! Something went wrong.', {
      description: voidResult.error,
    });
    setSubmitting(false);
    return;
  };

  const handleRole = async (role: string) => {
    setSubmitting(true);
    const voidResult = await roleManager(user.id, role);
    if (voidResult.success) {
      toast.success('Success', {
        description: 'Role Updated',
      });
      updateUser(role, 'adminAssign');
      setSubmitting(false);
      return;
    }
    toast.error('Uh oh! Something went wrong.', {
      description: voidResult.error,
    });
    setSubmitting(false);
    return;
  };

  return (
    <div className="w-full">
      <Card className="w-full max-md:max-w-3xl md:w-4/5  overflow-hidden my-2 mx-auto">
        <CardContent className="p-0">
          <div className="flex items-center max-sm:flex-col">
            <div className="p-6 sm:flex-shrink-0 flex items-center justify-between  max-sm:w-11/12">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarFallback
                  className="text-2xl font-bold text-white"
                  style={{
                    background: `linear-gradient(${getRandomGradientDirection()}, ${generateRandomColor(40)}, ${generateRandomColor(46)})`,
                  }}
                >
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="p-6 sm:hidden">
                <UserModal
                  user={user}
                  setStateUsers={setStateUsers}
                  stateUsers={stateUsers}
                  privateInfo={privateInfo}
                />
              </div>
            </div>
            <div className="flex-grow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold ">
                    {privateInfo.userName}
                  </h2>
                  <p className="text-sm ">{privateInfo.gender}</p>
                </div>
                <Badge
                  variant={
                    user.status === 'requested' || 'user'
                      ? 'outline'
                      : 'approved'
                  }
                >
                  {user.status}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">
                    {age} years old, {user.maritalStatus}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">
                    {user.nationality}, {user.countryResiding}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">
                    +{privateInfo.countryCode} {privateInfo.mobileNumber}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">{privateInfo.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">Wali: {privateInfo.waliName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">
                    Wali: +{privateInfo.waliCountryCode}{' '}
                    {privateInfo.waliMobileNumber}
                  </span>
                </div>
                <div className="flex items-center space-x-2 sm:col-span-2 md:col-span-3">
                  <Link className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">
                    Islamic Education jjkjbskdjfbilzdugf sdhbflasidhflidsb
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className=" flex justify-between items-center">
          <div className="flex space-x-2 max-sm:w-full">
            {user.statusFrom == 'adminApprove' && (
              <div className="flex justify-between max-sm:w-full gap-2">
                <Button
                  variant="destructive"
                  onClick={() => handleUserApproveClickAdmin('notApproved')}
                  disabled={submitting}
                >
                  {submitting && <Loader2 className="animate-spin" />}Reject
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleUserApproveClickAdmin('approved')}
                  disabled={submitting}
                >
                  {submitting && <Loader2 className="animate-spin" />}Approve
                </Button>
              </div>
            )}

            {user.statusFrom == 'adminAssign' && user.status === 'user' ? (
              <>
                <Button
                  disabled={submitting}
                  onClick={() => handleRole('volunteer')}
                  variant="default"
                >
                  {submitting && <Loader2 className="animate-spin" />}
                  Make Volunteer
                </Button>
              </>
            ) : (
              user.status === 'volunteer' && (
                <>
                  <Button
                    disabled={submitting}
                    onClick={() => handleRole('user')}
                    variant="destructive"
                  >
                    {submitting && <Loader2 className="animate-spin" />}
                    Remove Volunteer
                  </Button>
                </>
              )
            )}
          </div>
          <div className="hidden sm:flex">
            <UserModal
              user={user}
              setStateUsers={setStateUsers}
              stateUsers={stateUsers}
              privateInfo={privateInfo}
            />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// export default AdminApprovalCard;
