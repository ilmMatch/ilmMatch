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
import { BookMarked, BookmarkIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

export default function UserModal({ user }: { user: UserProfile }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { bookmarkUpdate } = useAuth();

    console.log('modal', user);
    async function handleBookMark() {
        console.log('bookmark', user);
        await bookmarkUpdate(user.id, "add")
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
                                {user.initials as string}
                            </ModalHeader>
                            <ModalBody>
                                <>body </>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="link" onClick={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onClick={handleBookMark}>
                                    {/* <BookMarked /> */}
                                    <BookmarkIcon />
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
