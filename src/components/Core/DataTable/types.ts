import { ComputedRef, Ref, VNodeChild, WritableComputedRef } from "vue";
import { RouteLocationRaw } from "vue-router";

export interface GenericObject {
  [key: string]: any;
}

export type FilterMatchMode =
  | "arrayContains"
  | "contains"
  | "between"
  | "equals"
  | "exists"
  | "objectStringMap"
  | "arrayLength";
export type FilterType =
  | "text"
  | "select"
  | "cascader"
  | "tree-select"
  | "checkbox"
  | "checkbox-group"
  | "number"
  | "radio"
  | "daterange"
  | "array"; // | "time" | "date" | "datetime" | "daterange" | "datetimerange" | "month" | "year" | "quarter";

export interface SelectOptions {
  label: string;
  value: any;
}

export interface OptimizedQueryFields {
  field: string;
  externalDocument?: boolean;
}

export interface TableFilter {
  label?:
    | string
    | ((dependencies?: { [key: string]: any }) => string | VNodeChild);
  key: string;
  type: FilterType;
  options?:
    | SelectOptions[]
    | ((
        dependencies?: { [key: string]: any } | undefined
      ) => SelectOptions[] | Promise<SelectOptions[]>);
  placeholder?: string;
  default?: any;
  dependencies?: (string | string[])[];
  fields?: Omit<TableFilter, "type">[];
  format?: "list" | "tabs" | "table";
  preformat?: (value: any) => any;
  transform?: (value: any) => any;
  matchMode?: FilterMatchMode;
  params?: {
    stringMap?: Array<
      | string
      | {
          propertyName: string;
          matchMode: Omit<FilterMatchMode, "objectStringMap">;
        }
    >;
    stringMapSeparator?: string;
    stringMapOperator?: "AND" | "OR";
    dateMode?: boolean;
  };
  postCondition?: boolean;
}

export interface StaticFilter {
  key: string;
  matchMode: FilterMatchMode;
  value: any;
}

export interface FilterState {
  [key: string]: string | number | boolean | any[] | object;
}

export interface Column {
  label: string;
  key: string;
  hide?: boolean;
  filter?: TableFilter;
  width?: number | string;
  sortable?: boolean;
  resizable?: boolean;
  render?: (
    value: any,
    row: GenericObject,
    params: GenericObject
  ) => VNodeChild | string;
  cellComponent?: GenericObject;
  cellComponentParams?: GenericObject;
}

interface MappedColumn {
  headerName?: string;
  chechboxSelection?: boolean;
  headerComponentFramework?: any;
  headerComponentParams?: {
    SetGlobalSelection?: (selection: boolean) => void;
  };
  width?: number;
  resizable?: boolean;
  sortable?: boolean;
  hide?: boolean;
  filter: boolean;
  floatingFilterComponentFramework: any;
  floatingFilterComponentParams?: {
    filterConfig: TableFilter;
    suppressFilterButton: true;
  };
  cellRendererFramework?: any;
  cellRendererParams?: {
    _cellRenderer: (
      value: any,
      row: GenericObject,
      params: GenericObject
    ) => VNodeChild | string | number;
  };
}

export interface MappedFilters {
  value: any;
  matchMode: FilterMatchMode;
  required?: boolean | undefined;
  params: { stringMap?: string[] };
}

export interface FetchParams {
  page: number;
  limit: number;
  sortKey: string | null;
  sortOrder: "asc" | "desc" | "" | null;
  searchQuery: null | {
    value: string | null;
    fields: string[];
  };
  query: null | {
    [key: string]: MappedFilters[];
  };
  fields?: OptimizedQueryFields;
}

export interface ActionParams {
  nbSelected: number;
  selectAll?: boolean;
  selected?: any[];
  fetchParams?: FetchParams;
}

export type DataSource = (params: FetchParams) => Promise<
  | {
      docs: any[];
      totalDocs: number;
      totalPages: number;
    }
  | any[]
>;

export interface TableActionParams {
  nbSelected: number;
  selectAll: boolean;
  selected: any[];
  fetchParams: FetchParams;
  tableApi: Ref<TableApi>;
}

export interface TableAction {
  label: string;
  icon: string;
  action?: (actionParams: TableActionParams) => void;
  link?: string | RouteLocationRaw;
  permissions?: (string | string[])[];
}

export interface TableApi {
  refreshData: () => void;
  setSearchQuery: (value: string) => void;
  resetFilters: () => void;
  setSort: (key: string, dir?: "asc" | "desc" | null) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

export type TableRowAction = (params: {
  value: any;
  data: { [key: string]: any };
  tableApi: TableApi;
}) => {
  icon: string;
  tooltip: string;
  action?: () => void;
  link?: string | RouteLocationRaw;
  permissions?: (string | string[])[];
  condition?: (data: { [key: string]: any }) => any;
}[];

export interface GridConfig {
  loading: boolean;
  mounted: boolean;
  gridApi: any;
  columnApi: any;
  defaultColDef: {
    sortable: boolean;
    resizable: boolean;
    suppressMenu: boolean;
    floatingFilter: boolean;
    suppressFilterButton: boolean;
    comparator?: () => number;
    filterParams?: {
      newRowsAction: string;
      filterOptions: any[];
    };
  };
  columnDefs: MappedColumn[];
}

export interface GridContent {
  selectAll?: boolean;
  data: any[];
  selected: any[];
  nbSelected?: ComputedRef<number>;
}

export interface GridControls {
  sort: {
    colId: string;
    key: string;
    dir: "asc" | "desc" | "" | null;
  };
  pagination: {
    pageIndex: number;
    pageSize: number;
    pageTotalCount: number;
    rowTotalCount: number;
  };
  filters: {
    searchQuery: string;
    panelFilters: { [key: string]: any };
    inlineFilters: { [key: string]: any };
    staticFilters: { [key: string]: any };
  };
}

export interface DataTableSchema {
  remote: boolean;
  optimizeQuery?: OptimizedQueryFields[];
  datasource: DataSource;
  tableKey?: string;
  columns: Column[];
  staticFilters?: StaticFilter[];
  filters?: TableFilter[];
  searchQuery?: string[];
  enableSelection?: boolean;
  actions?: TableAction[];
  rowActions?: TableRowAction;
  columnFitMode?: "fit" | "fill";
}

export type DataTableFactory = (...args: any[]) => DataTableSchema;
