import { useMemo } from "react";
import { ScrollArea } from "@components/ui/scroll-area";
import { Checkbox } from "@components/ui/checkbox";
import { useActions, useUpdateAction } from "../../api/actions";

type JobActionsProps = {
  jobId: number;
};

const JobActions = ({ jobId }: JobActionsProps) => {
  const { data: actionsResponse, isLoading } = useActions(jobId);
  const updateAction = useUpdateAction({});

  const { completedActions, uncompletedActions } = useMemo(() => {
    if (!actionsResponse?.data)
      return { completedActions: [], uncompletedActions: [] };

    return {
      completedActions: actionsResponse.data.filter((action) => action.completed),
      uncompletedActions: actionsResponse.data.filter(
        (action) => !action.completed
      ),
    };
  }, [actionsResponse]);

  const handleToggleComplete = (actionId: number, completed: boolean) => {
    updateAction.mutate({
      actionId,
      jobId,
      data: { completed },
    });
  };

  if (isLoading || !actionsResponse?.data) {
    return <div className="p-4">Loading actions...</div>;
  }

  const ActionItem = ({ action }: { action: (typeof actionsResponse.data)[0] }) => (
    <div className="flex items-center gap-3 py-2">
      <Checkbox
        id={`action-${action.id}`}
        checked={action.completed}
        onCheckedChange={(checked) =>
          handleToggleComplete(action.id, checked as boolean)
        }
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{action.title}</span>
        <span className="text-xs text-muted-foreground">{action.type}</span>
      </div>
    </div>
  );

  const ActionSection = ({
    title,
    actions,
    emptyMessage,
  }: {
    title: string;
    actions: typeof completedActions;
    emptyMessage: string;
  }) => (
    <div className="space-y-2">
      <h3 className="font-medium text-sm">{title}</h3>
      {actions.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="space-y-1">
          {actions.map((action) => (
            <ActionItem
              key={action.id}
              action={action}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-6">
        <ActionSection
          title="To Do"
          actions={uncompletedActions}
          emptyMessage="No pending actions"
        />
        <ActionSection
          title="Completed"
          actions={completedActions}
          emptyMessage="No completed actions"
        />
      </div>
    </ScrollArea>
  );
};

export default JobActions;
