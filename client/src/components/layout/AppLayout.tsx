import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LuFile,
  LuHome,
  LuContact2,
  LuPlus,
  LuAlignJustify,
  LuMoreHorizontal,
  LuHash,
} from "react-icons/lu";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@components/ui/dropdown";
import { Button } from "@components/ui/button";
import { Avatar } from "@components/ui/avatar";
import { cn } from "@utils/cn";
import { PathConstants } from "@utils/constants";

import { useUser } from "@features/auth/api/getUser";
import { useLogout } from "@features/auth/api/logout";
import { useActiveBoards } from "@features/boards/api/getActiveBoards";
import CreateBoard from "@features/boards/components/CreateBoard";
import ArchiveBoardDialog from "@features/boards/components/ArchiveBoardDialog";

type SidebarItem = {
  name: string;
  to: string;
  Icon: React.ElementType;
};

const navigation: SidebarItem[] = [
  { name: "Home", to: PathConstants.HOME, Icon: LuHome },
  { name: "Contacts", to: "/contacts", Icon: LuContact2 },
  { name: "Documents", to: "/documents", Icon: LuFile },
];

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const { data: currentUser } = useUser();
  const boardsQuery = useActiveBoards({});
  const logoutMutation = useLogout({
    onSuccess: () => {
      navigate(PathConstants.LANDING, {
        replace: true,
      });
    },
  });

  const boards = boardsQuery.data?.data.reverse();

  return (
    <div className="flex w-full h-full bg-background overflow-x-auto">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 max-w-[215px] w-full bg-background transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-border border-r-[1px]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* <div className="flex items-center justify-between h-16 px-4 md:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <h1>X</h1>
            </button>
          </div> */}

          {/* App/Board Routes */}
          <nav className="flex-grow overflow-y-auto">
            <div className="px-1.5 py-3 [&>*]:border-b [&>*]:border-border">
              <div className="overflow-y-auto space-y-2 pb-3">
                {navigation.map(({ name, to, Icon }) => (
                  <NavLink
                    key={name}
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-4 min-h-8 rounded-md hover:bg-primary/5",
                        isActive && "bg-primary/5 border-primary/50 border-[1px] "
                      )
                    }
                  >
                    <Icon className="w-[17px] h-[17px] mr-2 stroke-foreground/60" />
                    <span className="text-foreground/80 text-sm font-semibold">
                      {name}
                    </span>
                  </NavLink>
                ))}
              </div>

              <div className="py-4">
                <div className="flex items-center justify-between pl-4 pr-2 pb-3">
                  <p className="font-semibold text-sm text-foreground/50">
                    Job Boards
                  </p>

                  <CreateBoard>
                    <Button
                      variant="outlineMuted"
                      className="flex items-center justify-center w-5 h-5 p-1"
                    >
                      <LuPlus className="stroke-foreground/50" />
                    </Button>
                  </CreateBoard>
                </div>

                <div className="space-y-1">
                  {boards &&
                    boards.map(({ id, name }) => (
                      <NavLink
                        key={id}
                        to={PathConstants.BOARD_VIEW(id)}
                        className={({ isActive }) =>
                          cn(
                            "flex shrink-0 items-center w-full pl-4 pr-3 min-h-8 rounded-md hover:bg-primary/5 group",
                            isActive &&
                              "bg-primary/5 border-primary/50 border-[1px] "
                          )
                        }
                      >
                        <LuHash className="stroke-foreground/80 min-h-4 min-w-4 mr-2" />
                        <span className="text-sm text-foreground/80 font-semibold truncate tracking-[-0.2px]">
                          {name}
                        </span>

                        <div className="flex grow justify-end">
                          <ArchiveBoardDialog id={id.toString()} />
                        </div>
                      </NavLink>
                    ))}

                  {!boards?.length && !boardsQuery.isLoading && (
                    <p className="text-foreground/30 text-sm px-4 py-1">
                      No Boards Created
                    </p>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* User Options */}
          <div className="px-1.5 pb-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center w-full text-left h-10 w-auto px-3 py-1 border-border border-[1px] rounded-md focus:outline-none mt-auto">
                  <div className="flex items-center grow">
                    <Avatar
                      src={currentUser!.data.avatar}
                      className="w-6 h-6 mr-3 fill-primary"
                    />
                    <span className="text-foreground/70 text-sm font-semibold truncate max-w-[80px]">
                      {currentUser!.data.firstName}
                    </span>
                  </div>

                  <LuMoreHorizontal className="w-4 h-4 ml-auto stroke-foreground/80" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="!min-w-[200px]"
                sideOffset={6}
              >
                <DropdownMenuItem>Account Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => logoutMutation.mutate(undefined)}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* App Content */}
      <Outlet />

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-5 bottom-5 bg-background flex justify-center items-center p-1 h-[40px] w-[40px] border-border border-[1px] text-white rounded-lg shadow-lg md:hidden"
      >
        <LuAlignJustify className="stroke-black stroke-width-[0.1px] w-[22px] h-[22px]" />
      </button>
    </div>
  );
};

export default AppLayout;
