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
import {
  BookmarkIcon,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

interface UserModalProps {
  user: UserProfile;
}
export default function UserModal({ user }: UserModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  async function handleBookMark() {
    toast("We're working on this features", {
      description: "Would you like to help?",
      action: {
        label: "YES",
        onClick: () => console.log("Undo"),
      },
    });
    return;
  }

  function handleInterestedClick() {
    const recipient = "inbox.ilmmatch@gmail.com";
    const subject = "Interested";
    const body = `
myprofile Id: ...
interested in: ${user.id}
  `;

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open Gmail in a new tab
    window.open(mailtoLink, '_blank');
  }

  return (
    <>
      <Button
        variant="outline"
        className="rounded-full bg-secondary"
        onClick={onOpen}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Modal
        backdrop={'blur'}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement={'center'}
        scrollBehavior="inside"
        size="xl"
      >
        <ModalContent>
          {(onClose: any) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBookMark}
                  >

                    <BookmarkIcon size={4} className="text-primary" />
                  </Button>
                  <span> {user.initials}</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <ProfileContent profile={user} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="link" onClick={onClose}>
                  Close
                </Button>

                <Button onClick={handleInterestedClick}>
                  Interested
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

// ===================================================***************************************************
function ProfileContent({
  profile,
}: {
  profile: UserProfile;
}) {
  return (
    <div className="space-y-4">

      <ProfileSection title="Personal Information">
        <ProfileItem label="Gender" value={profile.gender} />
        <ProfileItem label="Nationality" value={profile.nationality} />
        <ProfileItem label="Ethnicity" value={profile.ethnicity} />
        <ProfileItem label="Age" value={calculateAge(profile.dob.seconds)} />
        <ProfileItem label="Height" value={`${profile.height} cm`} />
        <ProfileItem label="Build" value={profile.build} />
      </ProfileSection>

      <ProfileSection title="Religious Information">
        <ProfileItem label="Born" value={profile.born} />
        <ProfileItem label="Sect" value={profile.sect} />
        <ProfileItem label="Pray" value={profile.pray} />
        <ProfileItem label="Hijab" value={profile.hijab} />
        <ProfileItem
          label="Islamic Education"
          value={profile.islamicEducation}
        />
        <ProfileItemArray label="Scholars" value={profile.scholars} />
      </ProfileSection>

      <ProfileSection title="Education and Occupation">
        <ProfileItem label="Education" value={profile.education} />
        <ProfileItem label="Occupation" value={profile.occupation} />
        <ProfileItemArray label="Languages" value={profile.languages} />
      </ProfileSection>

      <ProfileSection title="Location">
        <ProfileItem label="Country Residing" value={profile.countryResiding} />
        <ProfileItem label="Country Moving" value={profile.countryMoving} />
        <ProfileItem label="Masjid Name" value={profile.masjidName} />
      </ProfileSection>

      <ProfileSection title="Marital Information">
        <ProfileItem label="Marital Status" value={profile.maritalStatus} />
        <ProfileItem label="Children" value={profile.childern} />
        <ProfileItem label="Polygamy" value={profile.polygamy} />
        <ProfileItemNested
          label="Preferred Spouse Age"
          value={profile.spouseAge}
        />
      </ProfileSection>

      <ProfileSection title="About">
        <p className="text-sm text-muted-foreground">{profile.briefAboutYou}</p>
      </ProfileSection>

      <ProfileSection title="Spouse Brief">
        <p className="text-sm text-muted-foreground">{profile.spouseBrief}</p>
      </ProfileSection>
    </div>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-md font-semibold text-accent-foreground mb-2">
        {title}
      </h4>
      <div className="bg-secondary rounded-lg p-4 space-y-2">{children}</div>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm font-medium text-muted-foreground capitalize pr-2">
        {label}:
      </span>
      <span className="text-sm text-accent-foreground capitalize">{value}</span>
    </div>
  );
}
function ProfileItemArray({
  label,
  value,
}: {
  label: string;
  value: string[];
}) {
  return (
    <div className="flex justify-between">
      <span className="text-sm font-medium text-muted-foreground capitalize pr-2">
        {label}:
      </span>
      <span className="text-sm text-accent-foreground capitalize">
        {value.join(', ')}
      </span>
    </div>
  );
}
function ProfileItemNested({
  label,
  value,
}: {
  label: string;
  value: { min: number; max: number };
}) {
  return (
    <div className="flex justify-between">
      <span className="text-sm font-medium text-muted-foreground capitalize pr-2">
        {label}:
      </span>
      <span className="text-sm text-accent-foreground capitalize">
        {value.min} - {value.max}
      </span>
    </div>
  );
}

function calculateAge(dobSeconds: number): string {
  const dob = new Date(dobSeconds * 1000);
  const ageDifMs = Date.now() - dob.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
}


