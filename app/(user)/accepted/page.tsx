import { useAuth } from '@/context/AuthProvider';
import React from 'react'

export default function AcceptedPage() {
    const { currentUser, getRequestedMe, getMyRequested } = useAuth();

    async function getUsers() {
        if (!currentUser) return "you must be logged in"
    }
    return (
        <div>once admin sends email user will be visible here</div>
    )
}
