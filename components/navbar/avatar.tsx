import React from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ChevronDown, User } from 'lucide-react';
import { Button } from '../ui/button';

export default function AvatarButton() {
  return (
    <>
      <span className="flex items-center">
        <Avatar>
          <AvatarFallback>
            <User size={16} />
          </AvatarFallback>
        </Avatar>
        <ChevronDown size={16} />
      </span>
    </>
  );
}
