import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LuFile,
  LuHome,
  LuContact2,
  LuPlus,
  LuAlignJustify,
  LuMoreHorizontal,
  LuHash,
  LuTrash,
} from "react-icons/lu";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@components/ui/dropdown";
import { Button } from "@components/ui/button";
import { Avatar } from "@components/ui/avatar";
import { useUser } from "@features/auth/api/getUser";
import { cn } from "@utils/cn";

type SidebarItem = {
  name: string;
  to: string;
  icon: React.ElementType;
};

const navigation: SidebarItem[] = [
  { name: "Home", to: "/home", icon: LuHome },
  { name: "Contacts", to: "/contacts", icon: LuContact2 },
  { name: "Documents", to: "/documents", icon: LuFile },
];

const tempBoards = [
  {
    name: "Board 1",
  },
  {
    name: "Board 2",
  },
];

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = useUser();

  return (
    <div className="flex h-full w-full bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-[215px] bg-background shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-border border-r-[1px]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full px-1.5 py-4">
          <div className="flex items-center justify-between h-16 px-4 md:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <h1>X</h1>
            </button>
          </div>
          <nav className="[&>*]:border-b [&>*]:border-border">
            <div className="overflow-y-auto space-y-2 pb-3">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center text-sm text-foreground/80 font-semibold px-4 min-h-8 rounded-md hover:bg-secondary/5",
                      isActive && "bg-secondary/5 border-primary/50 border-[1px] "
                    )
                  }
                >
                  <item.icon className="w-4 h-4 mr-2 stroke-primary" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
            <div className="py-4 border-b border-border">
              <div className="flex items-center justify-between pl-4 pr-2 pb-3">
                <p className="font-semibold text-sm text-foreground/50">
                  Job Boards
                </p>
                <Button
                  variant="outlineMuted"
                  className="flex items-center justify-center w-5 h-5 p-1"
                >
                  <LuPlus className="stroke-foreground/50" />
                </Button>
              </div>
              <div className="">
                {tempBoards.map((board) => (
                  <NavLink
                    key={board.name}
                    to="/"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center w-full pl-4 pr-3 min-h-8 rounded-md hover:bg-secondary/5 group",
                        isActive && "bg-secondary/5 border-primary/50 border-[1px] "
                      )
                    }
                  >
                    <LuHash className="stroke-foreground/80 h-4 w-4 mr-2" />
                    <span className="text-sm text-foreground/80 font-semibold">
                      {board.name}
                    </span>
                    <div className="flex grow justify-end">
                      <Button
                        variant="outlineMuted"
                        className="items-center justify-center w-5 h-5 p-1 hidden group-hover:flex text-foreground"
                      >
                        <LuTrash className="stroke-foreground/50" />
                      </Button>
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-left h-10 w-auto px-3 py-1 border-border border-[1px] rounded-md focus:outline-none mt-auto">
                <Avatar
                  src={user.data?.avatar}
                  className="w-6 h-6 mr-3 fill-primary"
                />
                <span className="text-foreground/80 text-sm font-semibold">
                  {user.data?.firstName}
                </span>
                <LuMoreHorizontal className="w-4 h-4 ml-auto stroke-foreground/80" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="!min-w-[12rem]"
              sideOffset={6}
            >
              <DropdownMenuItem>Account Settings</DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-5 bottom-5 flex justify-center items-center p-1 h-[50px] w-[50px] border-border border-[1px] text-white rounded-lg shadow-lg md:hidden"
      >
        <LuAlignJustify className="stroke-black stroke-width-[0.1px] w-[30px] h-[30px]" />
      </button>
    </div>
  );
};

export default AppLayout;
