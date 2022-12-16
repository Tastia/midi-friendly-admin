import { QueueJob } from "~/types/queueJob";
import { ApiInstance } from "./../instance";

export const QueueJobController = {
  getQueueJobs: () =>
    ApiInstance.get<QueueJob[]>("/queue-job").then((res) => res.data),
};
