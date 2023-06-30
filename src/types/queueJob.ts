export enum QueueTypes {
  MailQueue = "Mail",
  MapsQueue = "Maps",
}

export enum QueueJobStatus {
  Pending = "Pending",
  InProgress = "InProgress",
  Completed = "Success",
  Failed = "Failed",
}

export type QueueJob = {
  _id: string;
  queue: QueueTypes;
  operation: string;
  params: Record<string, any>;
  result: Record<string, any>;
  status: QueueJobStatus;
  attempts: number;
};
