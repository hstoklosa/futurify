import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LuFile,
  LuHome,
  LuContact2,
  LuPlus,
  LuAlignJustify,
  LuSettings,
  LuHash,
  LuChevronsUpDown,
  LuHelpCircle,
} from "react-icons/lu";

import icon from "@assets/icon.png";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown";
import { Button } from "../ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import { PathConstants } from "@utils/constants";
import { cn } from "@utils/cn";

import { useUser } from "@/features/auth/api/get-user";
import { useLogout } from "@features/auth/api/logout";
import { useActiveBoards } from "@/features/boards/api/get-active-boards";
import { SettingsDialog, ContactDialog } from "@features/user/components";
import CreateBoard from "@/features/boards/components/create-board";
import ArchiveBoardDialog from "@/features/boards/components/archive-board-dialog";
import useOutsideClick from "@/hooks/use-outside-click";

type SidebarItem = {
  name: string;
  to: string;
  Icon: React.ElementType;
  disabled: boolean;
};

const navigation: SidebarItem[] = [
  { name: "Home", to: PathConstants.HOME, Icon: LuHome, disabled: false },
  { name: "Contacts", to: "/contacts", Icon: LuContact2, disabled: true },
  { name: "Documents", to: "/documents", Icon: LuFile, disabled: true },
];

const buttons: Omit<SidebarItem, "to">[] = [
  { name: "Help", Icon: LuHelpCircle, disabled: false },
  { name: "Settings", Icon: LuSettings, disabled: false },
];

const SidebarLink = ({ to, Icon, name, disabled }: SidebarItem) => {
  const link = (
    <NavLink
      key={name}
      to={to}
      onClick={(e) => disabled && e.preventDefault()}
      className={({ isActive }) =>
        cn(
          "flex items-center px-4 min-h-8 border-transparent border-[1px] rounded-md hover:bg-primary/5",
          isActive && "bg-primary/5 border-primary/50",
          disabled && "cursor-not-allowed"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              "w-[17px] h-[17px] mr-2 stroke-foreground/60",
              isActive && "stroke-primary"
            )}
          />
          <span className="text-foreground/80 text-sm font-semibold">{name}</span>
        </>
      )}
    </NavLink>
  );

  if (disabled) {
    return (
      <Tooltip>
        <TooltipTrigger>{link}</TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={15}
        >
          {disabled && <span>Coming soon...</span>}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
};

const SidebarBoardLink = ({ id, name }: { id: number; name: string }) => (
  <NavLink
    key={id}
    to={PathConstants.BOARD_VIEW(id)}
    className={({ isActive }) =>
      cn(
        "flex shrink-0 items-center w-full pl-4 pr-3 min-h-8 border-transparent border-[1px] rounded-md hover:bg-primary/5 group",
        isActive && "bg-primary/5 border-primary/50"
      )
    }
  >
    <LuHash className="stroke-foreground/80 min-h-4 min-w-4 mr-2" />
    <span className="text-sm text-foreground/80 font-semibold truncate tracking-[-0.2px]">
      {name}
    </span>

    <div className="flex grow justify-end ml-[2.5px]">
      <ArchiveBoardDialog id={id.toString()} />
    </div>
  </NavLink>
);

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const sidebarRef = useOutsideClick(() => {
    if (window.innerWidth < 768) {
      // Only close on mobile
      setSidebarOpen(false);
    }
  });

  const { data: currentUser } = useUser();
  const boardsQuery = useActiveBoards({});
  const logoutMutation = useLogout({
    onSuccess: () =>
      navigate(PathConstants.LANDING, {
        replace: true,
      }),
  });

  const boards = boardsQuery.data?.data.reverse();

  return (
    <div className="flex w-full h-full">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[rgba(26,0,82,0.8)] z-20 md:hidden"
          aria-hidden="true"
        />
      )}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-[280px] md:w-[215px] bg-background border-border border-r-[1px] shadow-4xl",
          "transform transition-transform duration-300 ease-in-out",
          "md:sticky md:top-0 md:h-screen",
          !sidebarOpen && "translate-x-[-100%] md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* User Profile Dropdown */}
          <div className="flex-shrink-0 px-2 pt-3 mb-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center w-full text-left h-10 px-3 py-1 border-border shadow-4xl border-[1px] rounded-md focus:outline-none">
                  <img
                    src={icon}
                    alt="icon"
                    className="w-5 h-5 mr-2"
                  />
                  <span className="text-foreground/80 text-sm font-semibold truncate max-w-[120px]">
                    {currentUser!.data.firstName}
                  </span>
                  <LuChevronsUpDown className="w-4 h-4 ml-auto stroke-foreground/80" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="!min-w-[200px]"
                sideOffset={6}
              >
                <DropdownMenuItem
                  className="!select-none !cursor-default text-foreground/30"
                  disabled
                >
                  {currentUser!.data.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logoutMutation.mutate(undefined)}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 min-h-0">
            <ScrollArea>
              <div className="px-2">
                <div className="py-3 [&>*]:border-b [&>*]:border-border">
                  {/* Navigation Links */}
                  <div className="space-y-2 pb-3">
                    {navigation.map((item) => (
                      <SidebarLink
                        key={item.name}
                        {...item}
                      />
                    ))}
                  </div>

                  {/* Job Boards Section */}
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
                        boards.map((board) => (
                          <SidebarBoardLink
                            key={board.id}
                            {...board}
                          />
                        ))}

                      {!boardsQuery.isLoading && !boards?.length && (
                        <p className="text-foreground/30 text-sm px-4 py-1">
                          No Boards Created
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex-shrink-0 px-2 pb-1.5">
            {buttons.map(({ name, Icon, disabled }) => {
              if (name === "Settings") {
                return (
                  <SettingsDialog
                    key={name}
                    triggerButton={
                      <button className="flex items-center w-full min-h-8 px-4 rounded-md hover:bg-primary/5 text-foreground/80 text-sm font-semibold truncate">
                        <Icon className="w-[17px] h-[17px] mr-2" />
                        {name}
                      </button>
                    }
                  />
                );
              }

              if (name === "Help") {
                return (
                  <ContactDialog
                    key={name}
                    triggerButton={
                      <button className="flex items-center w-full min-h-8 px-4 rounded-md hover:bg-primary/5 text-foreground/80 text-sm font-semibold truncate">
                        <Icon className="w-[17px] h-[17px] mr-2" />
                        {name}
                      </button>
                    }
                  />
                );
              }

              return (
                <button
                  key={name}
                  disabled={disabled}
                  className="flex items-center w-full min-h-8 px-4 rounded-md hover:bg-primary/5 text-foreground/80 text-sm font-semibold truncate disabled cursor-not-allowed"
                >
                  <Icon className="w-[17px] h-[17px] mr-2" />
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <main className="flex-1 h-full min-w-0">
        <Outlet />
      </main>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-5 bottom-5 flex justify-center items-center bg-background p-1 h-[40px] w-[40px] border-border border-[1px] text-white rounded-lg shadow-lg md:hidden"
      >
        <LuAlignJustify className="stroke-black stroke-width-[0.1px] w-[22px] h-[22px]" />
      </button>
    </div>
  );
};

export default AppLayout;
