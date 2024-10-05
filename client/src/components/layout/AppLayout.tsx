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
import icon from "../../assets/icon.png";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@components/ui/dropdown";
import { Button } from "@components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@components/ui/tooltip";
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
  disabled: boolean;
};

const navigation: SidebarItem[] = [
  { name: "Home", to: PathConstants.HOME, Icon: LuHome, disabled: false },
  { name: "Contacts", to: "/contacts", Icon: LuContact2, disabled: true },
  { name: "Documents", to: "/documents", Icon: LuFile, disabled: true },
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

  return (
    <div>
      {disabled ? (
        <Tooltip>
          <TooltipTrigger className="">{link}</TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={15}
          >
            {disabled && <span>Coming Soon</span>}
          </TooltipContent>
        </Tooltip>
      ) : (
        link
      )}
    </div>
  );
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

    <div className="flex grow justify-end">
      <ArchiveBoardDialog id={id.toString()} />
    </div>
  </NavLink>
);

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

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
    <div className="flex w-full h-full bg-background overflow-x-auto">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 max-w-[215px] w-full bg-background transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-border border-r-[1px]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="px-2 pt-3 mb-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center w-full text-left h-10 px-3 py-1 border-border border-[1px] rounded-md focus:outline-none mt-auto">
                  <img
                    src={icon}
                    alt="icon"
                    className="w-5 h-5 mr-2"
                  />
                  <span className="text-foreground/80 text-sm font-semibold truncate max-w-[80px]">
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

          {/* App/Board Routes */}
          <nav className="flex-grow w-[215px] overflow-y-auto">
            <div className="px-2 py-3 [&>*]:border-b [&>*]:border-border">
              <div className="overflow-y-auto space-y-2 pb-3">
                {navigation.map((item) => (
                  <SidebarLink
                    key={item.name}
                    {...item}
                  />
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
                    boards.map((board) => (
                      <SidebarBoardLink
                        key={board.id}
                        {...board}
                      />
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
          <div className="px-2 pb-3 [&>*]:w-full [&>*]:min-h-8">
            <button className="flex items-center px-4 rounded-md hover:bg-primary/5 text-foreground/80 text-sm font-semibold truncate disabled cursor-not-allowed">
              <LuHelpCircle className="w-[17px] h-[17px] mr-2" /> Support
            </button>
            <button className="flex items-center px-4 rounded-md hover:bg-primary/5 text-foreground/80 text-sm font-semibold truncate disabled cursor-not-allowed">
              <LuSettings className="w-[17px] h-[17px] mr-2" /> Settings
            </button>
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
