import { Organization } from "./organization.type";
export interface User {
  firstName: string;
  lastName: string;
  avatar?: string;
  credentials: {
    type: "email" | "google" | "facebook" | "linkedin";
    email: string;
  };
  organizations: Organization[];
}
