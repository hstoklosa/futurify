import { Form, Input, ToggleInput, Select, TextEditor } from "@components/ui/form";
import { Button } from "@components/ui/button";
import { enumToArray } from "@utils/format";
import { renderOptions } from "@utils/select";

import { JobType, updateJobSchema } from "@schemas/job-application";
import { Job, Stage } from "@/types/api";
import { useUpdateJob } from "../api/update-job";

type UpdateJobFormProps = {
  currentJob: Job;
  currentStages: Stage[];
  onSuccess: () => void;
  onCancel: () => void;
};

const UpdateJobForm = ({
  currentJob,
  currentStages,
  onSuccess,
  onCancel,
}: UpdateJobFormProps) => {
  const jobTypes = enumToArray(JobType);

  const updateJobMutation = useUpdateJob({
    onSuccess: () => {
      onSuccess && onSuccess();
    },
  });

  // Convert numeric values to strings for the form
  const defaultValues = {
    ...currentJob,
    stageId: String(currentJob.stageId),
  };

  return (
    <Form
      schema={updateJobSchema}
      onSubmit={(data) => {
        updateJobMutation.mutate({
          jobId: currentJob.id,
          data: data,
        });
      }}
      options={{ defaultValues }}
      className="px-7 py-6 space-y-6"
    >
      {({ register, control }) => (
        <>
          <div className="inline-flex flex-col w-full gap-2 sm:flex-row">
            <Input
              type="text"
              label="Job Title"
              placeholder="+ add job title"
              className="text-[14px]"
              register={register("title")}
              required
            />
            <Input
              type="text"
              className="text-[14px]"
              label="Company Name"
              placeholder="+ add company name"
              register={register("companyName")}
              required
            />
            <Select
              label="Application Stage"
              className="text-[14px] h-[38.33px]"
              options={renderOptions(currentStages, "name", "id")}
              register={register("stageId")}
              required
            />
          </div>

          <div className="inline-flex sm:flex-row flex-col w-full gap-2">
            <Input
              type="text"
              className="text-[14px] w-[100%]"
              label="Location"
              placeholder="+ add location"
              register={register("location")}
              required
            />
            <Select
              label="Type"
              className="text-[14px] h-[38.33px] w-[100%]"
              options={renderOptions(jobTypes, "value", "key")}
              register={register("type")}
              required
            />
          </div>

          <div className="inline-flex sm:flex-row flex-col w-full gap-2">
            <ToggleInput
              type="text"
              className="text-[14px]"
              label="Listing URL"
              placeholder="+ add listing url"
              register={register("postUrl")}
            >
              <span>Add URL</span>
            </ToggleInput>
            <Input
              type="text"
              className="text-[14px]"
              label="Salary"
              placeholder="+ add salary"
              register={register("salary")}
            />
          </div>

          <TextEditor
            name="description"
            label="Job Description"
            control={control}
          />

          <div className="flex justify-end w-full gap-2">
            <Button
              size="sm"
              variant="outlineMuted"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={updateJobMutation.isPending}
            >
              {updateJobMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default UpdateJobForm;
