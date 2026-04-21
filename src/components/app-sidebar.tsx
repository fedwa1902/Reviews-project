"use client"

import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  ShieldCheckIcon,
  GlobeIcon,
  KeyRoundIcon,
  UsersIcon,
  BarChart3Icon,
  Settings2Icon,
  ActivityIcon,
  FileTextIcon,
  BellIcon,
  DatabaseIcon,
  ShieldIcon,
  ServerIcon,
  HelpCircleIcon,
} from "lucide-react"

const data = {
  user: {
    name: "Sarah Mitchell",
    email: "sarah.mitchell@contoso.com",
    avatar: "",
  },
  teams: [
    {
      name: "Contoso Ltd",
      logo: <ShieldIcon />,
      plan: "Enterprise",
    },
    {
      name: "Marketing Dept",
      logo: <BarChart3Icon />,
      plan: "Department",
    },
    {
      name: "IT Governance",
      logo: <ServerIcon />,
      plan: "Admin",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: <LayoutDashboardIcon />,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/",
        },
        {
          title: "Analytics",
          url: "/analytics",
        },
        {
          title: "Activity Log",
          url: "/activity",
        },
      ],
    },
    {
      title: "Reviews",
      url: "/reviews",
      icon: <ShieldCheckIcon />,
      items: [
        {
          title: "Workspaces",
          url: "/reviews?tab=workspace",
        },
        {
          title: "Access",
          url: "/reviews?tab=access",
        },
        {
          title: "Licenses",
          url: "/reviews?tab=license",
        },
      ],
    },
    {
      title: "User Management",
      url: "/users",
      icon: <UsersIcon />,
      items: [
        {
          title: "All Users",
          url: "/users",
        },
        {
          title: "Roles & Permissions",
          url: "/users/roles",
        },
        {
          title: "Departments",
          url: "/users/departments",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings2Icon />,
      items: [
        {
          title: "General",
          url: "/settings",
        },
        {
          title: "Notifications",
          url: "/settings/notifications",
        },
        {
          title: "Security",
          url: "/settings/security",
        },
        {
          title: "Integrations",
          url: "/settings/integrations",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Workspace Audit Q2",
      url: "/reviews?tab=workspace",
      icon: <GlobeIcon />,
    },
    {
      name: "License Optimization",
      url: "/reviews?tab=license",
      icon: <KeyRoundIcon />,
    },
    {
      name: "Compliance Report",
      url: "/reports",
      icon: <FileTextIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
