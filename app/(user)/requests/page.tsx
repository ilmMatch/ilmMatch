'use client';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MyRequests from './myrequests';
import { useAuth } from '@/context/AuthProvider';
import RequestedMe from './requestedme';

export default function ProfileRequestPage() {
  const { currentUser } = useAuth();
  if (!currentUser) return <>loading</>;
  return (

    <Tabs defaultValue="sent" className="md:w-[80%] mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sent">my requests</TabsTrigger>
        <TabsTrigger value="received">requested my details</TabsTrigger>
      </TabsList>
      <TabsContent value="sent">
        <MyRequests />
      </TabsContent>
      <TabsContent value="received">
        <RequestedMe />
      </TabsContent>
    </Tabs>
  );
}
