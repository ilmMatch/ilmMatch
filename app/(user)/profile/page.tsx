import React from 'react';
import { PrivateForm } from '@/components/forms/userPrivate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfileForm } from '@/components/forms/userProfile';

export default function ProfilePage() {
  return (
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
    </Tabs>
  );
}
