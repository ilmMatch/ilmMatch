import React from 'react';
import { PrivateForm } from '@/components/forms/userPrivate';
import ProfileForm from '@/components/forms/userProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProfilePage() {
  return (
    <Tabs defaultValue="account" className="md:w-[80%] mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Profile</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <PrivateForm />
      </TabsContent>
      <TabsContent value="password">
        <ProfileForm />
      </TabsContent>
    </Tabs>
  );
}
