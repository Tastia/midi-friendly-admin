import { VNodeChild } from "vue";

export type NavigationMenuItem = {
  label: string | (() => VNodeChild);
  icon?: string;
  key: string;
  type?: "divider" | "group";
  children?: Array<NavigationMenuItem>;
};
