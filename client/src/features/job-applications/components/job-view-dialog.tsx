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
import { Job } from "@/types/api";

type JobViewDialog = {
  job: Job;
  children: React.ReactNode;
};

const InfoTab = () => {
  return <div>Info</div>;
};

const AiTab = () => {
  return (
    <div className="text-base font-semibold text-secondary ">
      AI Powered Insights
    </div>
  );
};

const InterviewsTab = () => {
  return <div>Interviews</div>;
};

const NotesTab = () => {
  return <span>Notes</span>;
};

type TabItem = {
  name: string;
  Icon: React.ElementType;
  Content: React.ElementType;
};

const tabs: TabItem[] = [
  { name: "Info", Icon: LuInfo, Content: InfoTab },
  { name: "AI Integration", Icon: LuSparkles, Content: AiTab },
  { name: "Interviews", Icon: LuCat, Content: InterviewsTab },
  { name: "Notes", Icon: LuPenSquare, Content: NotesTab },
] as const;

const JobViewDialog = ({ job, children }: JobViewDialog) => {
  const [open, setOpen] = useState(false);
  const formattedDate = formatUTCDate(job.createdAt);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger className="w-full outline-none">{children}</DialogTrigger>

      <DialogContent className="flex flex-col justify-start h-[80vh] w-[900px] max-w-[95%]">
        <Tabs defaultValue="Info">
          {/* DIALOG HEADER WITH TAB BUTTONS */}
          <DialogHeader className="flex-col items-start min-h-[40px] h-max mx-4 pt-6">
            <div className="px-2 py-3 mb-3 text-secondary">
              <DialogTitle className="font-[600] text-3xl text-start mb-1 truncate">
                {job.title}
                <span className="ml-4 font-[500]">{job.companyName}</span>
              </DialogTitle>
              <div className="flex items-center">
                <LuCalendarPlus className="size-[18px] stroke-foreground/40 mr-3" />
                <span className="text-foreground/70 text-base tracking-[-0.3px]">
                  {formattedDate}
                </span>
              </div>
            </div>

            <TabsList
              aria-label="Explore your application."
              className="flex gap-6 px-0"
            >
              {tabs.map(({ name, Icon }) => (
                <TabsTrigger
                  key={name}
                  value={name}
                  className="px-2 transition duration-200 ease-in-out"
                >
                  <Icon />
                  <span className="ml-2">{name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </DialogHeader>

          {/* DIALOG BODY */}
          {tabs.map(({ name, Content }) => (
            <TabsContent
              className="p-4"
              value={name}
            >
              <Content />
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default JobViewDialog;
