'use client';
import React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from '@nextui-org/react';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/firebase';
import { BookmarkCheck, BookMarked, BookmarkIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

export default function UserModal({ user }: { user: UserProfile }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { currentUser, bookmarkUpdate, profileRequestUpdate, userDataPrivate, requestedByUpdate } = useAuth();

    async function handleProfileMatchRequest() {
        if (!currentUser) throw "you must be logged in"
        console.log('match', user);
        await requestedByUpdate(user.id, currentUser.uid, "requested", "add")
        await profileRequestUpdate(user.id, "add")
    }
    async function handleBookMark(action: "add" | "remove") {
        await bookmarkUpdate(user.id, action)
    }
    return (
        <>
            <Button onClick={onOpen}>Open Profile</Button>
            <Modal
                backdrop={'blur'}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement={'center'}
            >
                <ModalContent>
                    {(onClose: any) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className='flex items-center'>
                                    <Button variant="ghost" size="icon" onClick={() => handleBookMark(userDataPrivate?.bookmarks.includes(user.id) ? "remove" : "add")}>
                                        {userDataPrivate?.bookmarks.includes(user.id) ? <BookmarkCheck size={4} className='text-primary' /> : <BookmarkIcon size={4} className='text-primary' />}
                                    </Button>
                                    <span> {user.initials}</span>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <>{JSON.stringify(user, null, 2)}</>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="link" onClick={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onClick={handleProfileMatchRequest}>
                                    {/* <BookMarked /> */}
                                    Request
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
