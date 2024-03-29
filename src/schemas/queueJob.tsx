import { DataTableSchema } from "~/components/Core/DataTable/types";
import { QueueJob } from "~/types/queueJob";

export function QueueJobTableSchema(): DataTableSchema<QueueJob> {
  return {
    remote: false,
    columns: [],
    datasource: QueueJobController.getQueueJobs,
  };
}
