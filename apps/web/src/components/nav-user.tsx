"use client"

import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import type { AppBskyActorGetProfile } from "@atcute/client/lexicons"
import QueryPlaceholder from "./query-placeholder"
import { Button } from "./ui/button"
import { Link } from "@tanstack/react-router"

export function NavUser() {
  const { isMobile } = useSidebar()

  const userQuery = useQuery({
    queryKey: ['/oauth/me'],
    queryFn: async () => {
      const res = await axios.get<AppBskyActorGetProfile.Output>('/oauth/me');
      return res.data;
    },
  });
  const { data } = userQuery;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <QueryPlaceholder query={userQuery}
          noData={
            <Button asChild>
              <Link href="/login" className="w-full">Log in</Link>
            </Button>
          }
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={data?.avatar} alt={data?.displayName ?? `@${data?.handle}`} />
                  <AvatarFallback className="rounded-lg">{data?.handle.substring(2)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{data?.displayName ?? `@${data?.handle}`}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={data?.avatar} alt={data?.displayName ?? `@${data?.handle}`} />
                    <AvatarFallback className="rounded-lg">{data?.handle.substring(2)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{data?.displayName ?? `@${data?.handle}`}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </QueryPlaceholder>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
