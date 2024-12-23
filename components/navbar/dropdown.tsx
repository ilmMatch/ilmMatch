
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AvatarButton from "./avatar"
import { siteConfig } from "@/config/site"
import Link from "next/link"
import { LogoutMobile } from "../Logout"

export function DropdownMenuComponent() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AvatarButton />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" loop side="bottom">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {siteConfig.sideMenuItems.map((item) => (
            <DropdownMenuItem key={item.label} >
              <Link href={item.href} className="flex items-center gap-2">
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Admin</DropdownMenuLabel>
        <DropdownMenuGroup>
          {siteConfig.sideMenuAdminItems.map((item) => (
            <DropdownMenuItem key={item.label}>
              <Link href={item.href} className="flex items-center gap-2">
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {siteConfig.supportMenuItems.map((item) => (
          <DropdownMenuItem key={item.label}>
            <Link href={item.href} className="flex items-center gap-2">
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutMobile withText />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
