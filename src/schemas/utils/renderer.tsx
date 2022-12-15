export const RenderBoolean = (value: boolean) => (
  <span
    class={`iconify ${value ? "text-green-500" : "text-red-500"}`}
    data-icon={value ? "mdi:check" : "mdi:close"}
  />
);
