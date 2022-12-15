import {
  Invitation,
  CreateInvitationLinkDto,
  CreateInvitationEmailDto,
} from "~/types/invitation";
import { User } from "~/types/user";
import { ApiInstance } from "./../instance";

export const UserController = {
  getUsers: () =>
    ApiInstance.get<User[]>("/users").then((response) => response.data),

  getInvitations: () =>
    ApiInstance.get<Invitation[]>("/invitations").then((res) => res.data),

  createOpenInvitationLink: (data: CreateInvitationLinkDto) =>
    ApiInstance.post<string>(
      "/auth/invitation/create-invitation-link",
      data
    ).then((res) => res.data),

  sendInvitationToUsers: (data: CreateInvitationEmailDto) =>
    ApiInstance.post<Invitation>(
      "/auth/invitation/send-email-invitation",
      data
    ).then((res) => res.data),
};
