import {
  ColumnsMapper,
  MapFiltersInitState,
  MapPanelFilters,
  obsoletableFn,
  MapStaticFilters,
} from "./tableUtils";
import {
  Column,
  FetchParams,
  GridConfig,
  GridContent,
  GridControls,
  MappedFilters,
  TableAction,
  TableApi,
} from "./types";
import { useMessage } from "naive-ui";
import { useRoute } from "vue-router";
import { RemovableRef } from "@vueuse/core";

export const useServerTable = (props: any) => {
  const {
    columns,
    datasource,
    tableKey,
    searchQuery: searchQueryFields,
    actions,
    columnFitMode,
    filters,
    staticFilters,
    enableSelection,
    rowActions,
    optimizeQuery,
  } = toRefs(props);
  const message = useMessage();
  const route = useRoute();

  const tableApi = ref({});

  const gridConfig = reactive<GridConfig>({
    loading: true,
    mounted: false,
    gridApi: {},
    columnApi: {},
    defaultColDef: {
      sortable: true,
      resizable: true,
      suppressMenu: true,
      floatingFilter: columns.value
        .filter(Boolean)
        .some((col: Column) => col?.filter),
      suppressFilterButton: true,
      comparator: () => 0,
    },
    columnDefs: ColumnsMapper({
      columns: columns.value,
      rowActions: rowActions.value,
      enableSelection: enableSelection.value,
      SetGlobalSelection,
      GetSelectionApi,
      SetFilterValue,
      tableApi,
      searchQueryFields: searchQueryFields.value,
      isRemote: true,
    }),
  });

  const gridContent = reactive<GridContent>({
    selectAll: false,
    data: [],
    selected: [],
    nbSelected: computed(() =>
      gridContent.selectAll
        ? gridControls.value.pagination?.rowTotalCount
        : gridContent.selected?.length
    ),
  });

  const gridControls: RemovableRef<GridControls> = useStorage(
    `${tableKey.value}__${route.name?.toString()}__#gridControls`,
    {
      sort: {
        colId: "",
        key: "",
        dir: null,
      },
      pagination: {
        pageSize: 50,
        pageIndex: 1,
        pageTotalCount: 1,
        rowTotalCount: 0,
      },
      filters: {
        searchQuery: "",
        panelFilters: {},
        inlineFilters: {},
        staticFilters: {},
      },
    },
    sessionStorage
  );

  const fetchParams = computed<FetchParams>(() => ({
    page: gridControls.value.pagination.pageIndex,
    limit: gridControls.value.pagination.pageSize,
    sortKey: gridControls.value.sort.key,
    sortOrder: gridControls.value.sort.dir,
    searchQuery: !gridControls.value.filters.searchQuery
      ? null
      : {
          value: gridControls.value.filters.searchQuery,
          fields: searchQueryFields.value,
        },
    query: MapQueryForFetchParams(gridControls.value.filters),
    ...(optimizeQuery?.value?.length && { select: optimizeQuery.value }),
  }));

  const FetchGridData = obsoletableFn(async (isObsolete) => {
    try {
      gridConfig.loading = true;
      const { docs, totalPages, totalDocs } = await datasource.value(
        fetchParams.value
      );
      if (isObsolete()) return;
      gridContent.data = docs;
      gridControls.value.pagination.pageTotalCount = totalPages;
      gridControls.value.pagination.rowTotalCount = totalDocs;
      gridConfig.loading = false;
      if (totalPages < gridControls.value.pagination.pageIndex)
        gridControls.value.pagination.pageIndex =
          totalPages < 1 ? 1 : totalPages;
      await sleep(10);
      gridContent.selectAll && gridConfig?.gridApi?.selectAll();
    } catch (err) {
      console.error(err);
      message.error("Unexpected server error !");
    }
  });

  function MapQueryForFetchParams(
    filtersState: any
  ): { [key: string]: MappedFilters[] } | null {
    const mappedFilters: { [key: string]: MappedFilters[] } = pipeMergeObject(
      MapPanelFilters(filtersState.panelFilters, filters.value.filter(Boolean)),
      MapStaticFilters(staticFilters.value)
    );

    return Object.keys(mappedFilters).length > 0 ? mappedFilters : null;
  }

  // GRID EVENTS

  function SetFilterValue(fieldKey: string, value: any) {
    gridControls.value.filters.inlineFilters[fieldKey] = value;
  }
  function SetGlobalSelection(value: boolean) {
    gridContent.selectAll = value;
  }

  function GetSelectionApi() {
    const selectAll = computed({
      get: () => gridContent.selectAll,
      set: (value: boolean) => (gridContent.selectAll = value),
    });
    const selected = computed({
      get: () => gridContent.selected,
      set: (value: any) => (gridContent.selected = value),
    });
    return {
      selectAll,
      selected,
    };
  }

  const SetupFiltersState = (clearMode = false) => {
    gridControls.value.filters.panelFilters = MapFiltersInitState(
      filters.value,
      gridControls.value.filters.panelFilters,
      clearMode
    );
    gridControls.value.filters.staticFilters = MapFiltersInitState(
      staticFilters.value,
      gridControls.value.filters.staticFilters,
      clearMode
    );
  };

  const HandleSortEvent = ({ columnApi }: any) => {
    const sortedCol = columnApi.columnModel.gridColumns.find(
      (col: { [key: string]: any }) => col?.sort
    );
    if (sortedCol)
      (gridControls.value.sort.colId = sortedCol.colId),
        (gridControls.value.sort.key = sortedCol.colDef.field),
        (gridControls.value.sort.dir = sortedCol.sort.toLowerCase());
    else
      (gridControls.value.sort.key = ""),
        (gridControls.value.sort.dir = null),
        (gridControls.value.sort.colId = "");
  };

  const HandleSelectionEvent = ({ api }: any) => {
    const selected = api.getSelectedRows();
    gridContent.selected = selected;
  };

  const HandleGridReadyEvent = ({ api, columnApi }: any) => {
    gridConfig.gridApi = api;
    gridConfig.columnApi = columnApi;
    gridConfig.mounted = true;
    if (columnFitMode.value === "fit") columnApi?.autoSizeAllColumns();
    if (gridControls.value.sort.colId)
      columnApi?.applyColumnState({
        state: [
          {
            colId: gridControls.value.sort.colId,
            sort: gridControls.value.sort.dir,
          },
        ],
      });
  };

  // GRID LIFECYCLE

  onMounted(() => {
    SetupFiltersState();
  }),
    watch(
      () => fetchParams.value,
      () => FetchGridData(),
      { deep: true }
    );
  watch(
    () => gridContent.selectAll,
    (value: boolean) =>
      value
        ? gridConfig?.gridApi?.selectAll()
        : gridConfig?.gridApi?.deselectAll()
  );

  tableApi.value = {
    refreshData: FetchGridData,
    setSearchQuery: (value: string) =>
      (gridControls.value.filters.searchQuery = value),
    resetFilters: () => SetupFiltersState(true),
    setSort: (key: string, dir?: "asc" | "desc" | null) => (
      (gridControls.value.sort.key = key), (gridControls.value.sort.dir = dir)
    ),
    setPage: (page: number) => (gridControls.value.pagination.pageIndex = page),
    setPageSize: (size: number) =>
      (gridControls.value.pagination.pageSize = size),
  };

  // ACTIONS

  const mappedActions = computed(() =>
    actions.value
      .filter(Boolean)
      .map((action: TableAction) => ({
        ...(action.icon && { icon: renderIcon(action.icon) }),
        label: action.link
          ? () => <router-link to={action.link}>{action.label}</router-link>
          : action.label,
        key: generateUUID(),
        props: {
          onClick: () =>
            action?.action?.({
              nbSelected: gridContent?.nbSelected,
              selectAll: gridContent?.selectAll,
              selected: gridContent?.selected,
              fetchParams: fetchParams.value,
              tableApi: tableApi as Ref<TableApi>,
            }),
        },
        _enable: ref(true), // usePermission(...(action?.permissions ?? [])),
      }))
      .filter((action: { _enable: Ref<boolean> }) => action._enable.value)
  );

  return {
    gridConfig,
    gridControls,
    gridContent,
    ResetFilters: () => SetupFiltersState(true),
    FetchGridData,
    HandleSortEvent,
    HandleSelectionEvent,
    HandleGridReadyEvent,
    mappedActions,
  };
};
