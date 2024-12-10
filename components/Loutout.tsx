"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthProvider'
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
    const { logout } = useAuth()
/*************  ✨ Codeium Command ⭐  *************/
/**
 * Handles the logout process by calling the logout function and redirecting to the homepage.
 * Logs any errors that occur during the process.
 */
/******  63ff6eb5-05ba-44b4-b7a1-d251cab0def0  *******/    const router = useRouter();

    async function handleSubmit() {

        try {
            await logout()
            router.push('/');
        } catch (err: any) {
            console.log(err.message)
        } 
    }
    return (
        <Button onClick={handleSubmit}><LogOut/> Loutout</Button>
    )
}


export function LogoutMobile() {
    const { logout } = useAuth()
    const router = useRouter();
    async function handleSubmit() {

        try {
            await logout()
            router.push('/');
        } catch (err: any) {
            console.log(err.message)
        } 
    }
    return (
        <Button onClick={handleSubmit}><LogOut/></Button>
    )
}
