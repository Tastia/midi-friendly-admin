import { RemoveNullFromObject } from "~/utils/data/object";
import ActionsCellRenderer from "./RootCellRenderers/ActionsCellRenderer.vue";
import ComponentCellRenderer from "./RootCellRenderers/ComponentCellRenderer.vue";
import FloatingFilterRenderer from "./RootCellRenderers/FloatingFilterRenderer.vue";
import JsxCellRenderer from "./RootCellRenderers/JsxCellRenderer.vue";
import SelectionHeaderRenderer from "./RootCellRenderers/SelectionHeaderRenderer.vue";
import {
  Column,
  TableFilter,
  FilterType,
  MappedFilters,
  FilterMatchMode,
} from "./types";

export const isArray = (value: any) => Array.isArray(value);

export const MapFiltersToSchema = (filters: any[]) =>
  filters.filter(Boolean).map((filter) => {
    return {
      ...filter,
      fieldParams: {
        ...(filter?.fieldParams ?? {}),
        ...(filter.type === "select" && {
          multiple: filter?.fieldParams?.multiple ?? true,
        }),
        ...(filter.type === "checkbox" && {
          hasThirdState: filter?.fieldParams?.hasThirdState ?? true,
        }),
      },
    };
  });
// SERVER SIDE UTILS

export const MapSSRFiltersState = (
  state: { [key: string]: any },
  filters: any[],
  { required = false } = {}
) => {
  const GetMatchMode = (value: any, type: FilterType) => {
    if (Array.isArray(value)) return "arrayContains";
    else return "contains";
  };

  const output: { [key: string]: any } = {};
  for (const { key, value } of Object.entries(state).map(([key, value]) => ({
    key,
    value,
  }))) {
    const filter = filters?.find?.((filter) => filter.key === key);
    if (!filter || output[key]) continue;
    output[key] =
      (Array.isArray(value) && value?.length) ||
      (!Array.isArray(value) && value)
        ? [
            {
              value,
              matchMode: filter?.matchMode ?? GetMatchMode(value, filter.type),
              params: filter?.params ?? {},
              ...(required && { required }),
              ...(filter?.postCondition && {
                postCondition: filter.postCondition,
              }),
            },
          ]
        : [];
  }
  return output;
};

export const MapStaticFilters = (
  filters: {
    key: string;
    value: any;
    matchMode: "contains" | "arrayContains" | "between";
    required?: boolean;
  }[]
) => {
  const output: {
    [key: string]: { value: any; matchMode: string; required?: boolean }[];
  } = {};
  for (const { key, value, matchMode, required } of filters)
    output[key] = [{ value, matchMode, required }];
  return output as { [key: string]: MappedFilters[] };
};

export const MapPanelFilters: (...args: any[]) => {
  [key: string]: MappedFilters[];
} = (
  filtersState: { [key: string]: any },
  filters: {
    key: string;
    matchMode: "contains" | "arrayContains" | "between" | "equals";
    params?: { [key: string]: any };
    postCondition?: any;
  }[]
) => {
  const GetMatchMode = (value: any) =>
    isArray(value) ? "arrayContains" : "contains";
  const output: {
    [key: string]:
      | { value: any; matchMode: string; required?: boolean }[]
      | null;
  } = {};
  for (const { key, value } of Object.entries(filtersState).map(
    ([key, value]) => ({ key, value })
  )) {
    const filter = filters?.find?.((filter) => filter.key === key);
    if (!filter) continue;
    output[key] =
      (isArray(value) && value?.length) ||
      (!isArray(value) && value) ||
      (filter?.matchMode === "equals" && value != undefined)
        ? [
            {
              value,
              matchMode: (filter?.matchMode ??
                GetMatchMode(value)) as FilterMatchMode,
              params: filter?.params ?? {},
              ...(filter?.postCondition && {
                postCondition: filter.postCondition,
              }),
            },
          ]
        : null;
  }
  return RemoveNullFromObject(output) as { [key: string]: MappedFilters[] };
};

export const MapFiltersInitState = (
  filters: TableFilter[],
  baseState: { [key: string]: any },
  clearMode = false
): { [key: string]: any } => {
  const GetInitState = (type: FilterType, defaultValue: any) =>
    typeof defaultValue != "undefined"
      ? defaultValue
      : ["select", "checkboxGroup"].includes(type)
      ? []
      : ["daterange", "datetimerange"].includes(type)
      ? [null, null]
      : null;
  const state: { [key: string]: any } = {};
  filters.filter(Boolean).forEach((filter) => {
    baseState[filter.key] && !clearMode
      ? (state[filter.key] = baseState[filter.key])
      : (state[filter.key] = GetInitState(
          (filter as any).inputType,
          (filter as any).defaultValue
        ));
  });
  return state;
};

// SHARED TABLE UTILS

export const ColumnsMapper = ({
  columns,
  enableSelection,
  rowActions,
  SetGlobalSelection,
  // GetSelectionApi,
  SetFilterValue,
  tableApi,
  searchQueryFields,
  isRemote = false,
}: any) =>
  [
    !enableSelection
      ? null
      : {
          checkboxSelection: true,
          ...(isRemote && {
            headerComponentFramework: SelectionHeaderRenderer,
            headerComponentParams: {
              SetGlobalSelection,
            },
          }),
          ...(!isRemote && {
            headerCheckboxSelection: true,
          }),
          width: 80,
          resizable: false,
        },
    rowActions?.length && {
      headerName: "Actions",
      cellRendererFramework: ActionsCellRenderer,
      cellRendererParams: {
        _rowActions: rowActions,
        tableApi,
      },
      width: 80 + rowActions.length * 35,
    },
    ...columns.filter(Boolean).map((column: Column, index: number) => ({
      headerName: column.label,
      field: column.key,
      width: column.width,
      hide: column.hide ?? false,
      resizable: column.resizable ?? true,
      sortable: column.sortable ?? true,
      // ...(index > 0 && {
      //     headerComponentFramework: FieldHeaderRenderer,
      //     headerComponentParams: {
      //         quickSearch: searchQueryFields?.includes(column.field),
      //     },
      // }),
      ...(column.filter && {
        filter: true,
        floatingFilterComponentFramework: FloatingFilterRenderer,
        floatingFilterComponentParams: {
          filterConfig: column.filter,
          suppressFilterButton: true,
          SetFilterValue,
          tableApi,
        },
      }),
      ...(column.render && {
        cellRendererFramework: JsxCellRenderer,
        cellRendererParams: {
          _cellRenderer: column.render,
          tableApi,
        },
      }),
      ...(column.cellComponent && {
        cellRendererFramework: ComponentCellRenderer,
        cellRendererParams: {
          _cellRenderer: column.cellComponent,
          ...(column.cellComponentParams && column.cellComponentParams),
          tableApi,
        },
      }),
    })),
  ].filter((col) => col);

export function obsoletableFn(fn: (...args: any[]) => void) {
  let lastCaller: symbol | null = null;
  return (...args: any[]) => {
    const me = Symbol();
    lastCaller = me;
    const isObsolete = () => lastCaller !== me;
    return fn(isObsolete, ...args);
  };
}
