'use client';
import React from 'react';
import { PrivateForm } from '@/components/forms/userPrivate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfileForm } from '@/components/forms/userProfile';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthProvider';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { approvalUpdate, currentUser, userDataProfile } = useAuth();
  const [submiting, setSubmiting] = React.useState(false);

  async function requestReview() {
    setSubmiting(true);
    if (!currentUser) throw 'you must be logged in';
    const result = await approvalUpdate('requested', currentUser.uid);
    if (!result.success) {
      toast.error('Uh oh! Something went wrong.', {
        description: result.error,
      });
      setSubmiting(false);
      return;
    }
    toast.success('Success', {
      description: 'Approval request sent',
    });
    setSubmiting(false);
  }
  return (
    <>
      <Tabs defaultValue="private" className="md:w-[80%] mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="private">Account</TabsTrigger>
          <TabsTrigger value="public">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="private">
          <PrivateForm />
        </TabsContent>
        <TabsContent value="public">
          <UserProfileForm />
        </TabsContent>
        <div className="w-full mt-2 flex justify-end">
          {userDataProfile?.approvalStatus === 'notApproved' && (
            <Button onClick={requestReview} disabled={submiting}>
              {' '}
              Request review
            </Button>
          )}
        </div>
      </Tabs>
    </>
  );
}
