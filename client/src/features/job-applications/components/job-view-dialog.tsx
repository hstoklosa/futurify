import React, { useState } from "react";
import {
  LuPenSquare,
  LuSparkles,
  LuInfo,
  LuCat,
  LuCalendarPlus,
} from "react-icons/lu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs/tabs";
import { ScrollArea } from "@components/ui/scroll-area";
import { formatUTCDate } from "@utils/format";

import { ApplicationTab, InsightsTab, ActionsTab, NotesTab } from "./job-view-tabs";

type TabItem = {
  name: string;
  Icon: React.ElementType;
  Content: React.ElementType;
};

const tabs: TabItem[] = [
  { name: "Application", Icon: LuInfo, Content: ApplicationTab },
  { name: "AI Insights", Icon: LuSparkles, Content: InsightsTab },
  { name: "Interviews", Icon: LuCat, Content: ActionsTab },
  { name: "Notes", Icon: LuPenSquare, Content: NotesTab },
] as const;

type JobViewDialog = {
  jobId: number;
  boardId: number;
  title: string;
  companyName: string;
  createdAt: string;
  children: React.ReactNode;
};

const JobViewDialog = ({
  jobId,
  boardId,
  title,
  companyName,
  createdAt,
  children,
}: JobViewDialog) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger className="w-full outline-none">{children}</DialogTrigger>
      <DialogContent className="w-[900px] h-[80vh] max-w-[95vw]">
        <Tabs
          defaultValue={tabs[0].name}
          className="flex flex-col h-full"
        >
          <DialogHeader className="flex-col items-start min-h-[40px] h-max mx-5 pt-6">
            <JobViewHeader
              title={title}
              companyName={companyName}
              createdAt={createdAt}
            />

            <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]{display:none}">
              <TabsList
                aria-label="Explore your application."
                className="flex w-max gap-6 px-0"
              >
                {tabs.map(({ name, Icon }) => (
                  <TabsTrigger
                    key={name}
                    value={name}
                    className="px-2 transition duration-200 ease-in-out whitespace-nowrap"
                  >
                    <Icon className="size-4" />
                    <span className="inline-block pb-[1px] ml-2">{name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </DialogHeader>

          <div className="flex-1 min-h-0">
            <ScrollArea>
              {tabs.map(({ name, Content }) => (
                <TabsContent
                  key={name}
                  value={name}
                  className="h-full px-5 py-5"
                >
                  <Content
                    jobId={jobId}
                    boardId={boardId}
                  />
                </TabsContent>
              ))}
            </ScrollArea>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

type JobViewHeaderProps = {
  title: string;
  companyName: string;
  createdAt: string;
};

const JobViewHeader = ({ title, companyName, createdAt }: JobViewHeaderProps) => {
  return (
    <div className="text-secondary px-2 py-3 mb-3">
      <DialogTitle className="font-semibold text-3xl text-start truncate mb-1">
        {title}
        <span className="font-medium ml-4">{companyName}</span>
      </DialogTitle>

      <div className="flex items-center">
        <LuCalendarPlus className="size-[18px] stroke-foreground/40 mr-3" />
        <span className="text-foreground/70 text-base tracking-[-0.3px]">
          {formatUTCDate(createdAt)}
        </span>
      </div>
    </div>
  );
};

export default JobViewDialog;
