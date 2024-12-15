'use client'
import { useAuth } from '@/context/AuthProvider';
import React from 'react';

export default function AcceptedPage() {
    const { userDataPrivate } = useAuth();
    return <div>AcceptedPage</div>;
}
