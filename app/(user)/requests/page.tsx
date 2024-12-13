'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyRequests from './myrequests'
import { useAuth } from '@/context/AuthProvider'
import RequestedMe from './requestedme'

export default function ProfileRequestPage() {
    const { currentUser } = useAuth()
    if (!currentUser) return <>loading</>
    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <Tabs defaultValue="sent" className="md:w-[80%] mx-auto">
                <TabsList>
                    <TabsTrigger value="sent">my requests</TabsTrigger>
                    <TabsTrigger value="received">people asked for your</TabsTrigger>
                </TabsList>
                <TabsContent value="sent"><MyRequests /></TabsContent>
                <TabsContent value="received"><RequestedMe /></TabsContent>
            </Tabs>
        </div>
    )
}
