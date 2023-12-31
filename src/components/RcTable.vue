<script setup lang="tsx">
import {
  getCoreRowModel,
  useVueTable,
  createColumnHelper,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/vue-table';
import type { ColumnPinningState, SortingFnOption, SortingState } from '@tanstack/vue-table';
import { ref, toRefs } from 'vue';
import RcTableHeader from './RcTableHeader.vue';
import RcTableBody from './RcTableBody.vue';
import RcCheckbox from './RcCheckbox.vue';

type TableColumns = {
  [key: string]: {
    header: string,
    enableSorting?: boolean,
    sortingFn?: SortingFnOption<any[]> | undefined
  }
}

const props = defineProps<{
  tableData: any[],
  tableColumns: TableColumns,
  hasRowSelection?: boolean,
  hasRowAction?: boolean,
}>();

const { tableData, tableColumns, hasRowSelection, hasRowAction } = toRefs(props);

const columnHelper = createColumnHelper<typeof tableData.value>();

const selectColumn = hasRowSelection.value
  ? [
    {
      id: 'select',
      header: ({ table }: { table: any }) => {
        return <RcCheckbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        ></RcCheckbox>;
      },
      cell: ({ row }: { row: any }) => {
        return <RcCheckbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        ></RcCheckbox>;
      },
      enablePinning: false,
    },
  ]
  : [];

const actionColumn = hasRowAction.value
  ? [
    {
      id: 'action',
      header: () => {
        return <div class="w-10"></div>;
      },
      cell: () => {
        return <div class="flex justify-center">🪬</div>;
      },
      enablePinning: false,
    },
  ] :
  [];

const providedColumns = Object.entries(tableColumns.value)
  .map(([key, val]) => {
    return {
      ...columnHelper.accessor(key, {
        header: val.header,
        enableSorting: val.enableSorting || false,
      }),
      ...(val.sortingFn ? { sortingFn: val.sortingFn } : {}),
    };
  });

const columns = [...selectColumn, ...providedColumns, ...actionColumn];

const data = ref(tableData.value);

const sorting = ref<SortingState>([]);

const rowSelection = ref({});
const globalFilter = ref('');

const columnPinning = ref<ColumnPinningState>({ left: ['select'] });

const table = useVueTable({
  get data() {
    return data.value;
  },
  columns,
  state: {
    get sorting() {
      return sorting.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get globalFilter() {
      return globalFilter.value;
    },
    get columnPinning() {
      return columnPinning.value;
    },
  },
  enableRowSelection: true,
  onRowSelectionChange: updateOrValue => {
    rowSelection.value =
      typeof updateOrValue === 'function'
        ? updateOrValue(rowSelection.value)
        : updateOrValue;
  },
  onSortingChange: updateOrValue => {
    sorting.value =
      typeof updateOrValue === 'function'
        ? updateOrValue(sorting.value)
        : updateOrValue;
  },
  enableGlobalFilter: true,
  onGlobalFilterChange: updateOrValue => {
    globalFilter.value =
      typeof updateOrValue === 'function'
        ? updateOrValue(globalFilter.value)
        : updateOrValue;
  },
  onColumnPinningChange: updateOrValue => {
    columnPinning.value =
      typeof updateOrValue === 'function'
        ? updateOrValue(columnPinning.value)
        : updateOrValue;
  },
  globalFilterFn: "auto",
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
});
</script>

<template>
  <div>
    <input v-model="globalFilter">
  </div>
  <div
    class="
      rounded 
      overflow-auto
      border 
      dark:border-neutral-500 
      w-96
      h-96
    "
  >
    <table 
      class="
        dark:bg-neutral-800
        dark:text-neutral-200
        border-collapse 
        border-none
      "
    >
      <rc-table-header
        :header-groups="table.getHeaderGroups()"
        :pinned-columns="columnPinning"
      />
      <rc-table-body
        :rows="table.getRowModel().rows" 
        :pinned-columns="columnPinning"
      />
    </table>
  </div>
  {{ columnPinning }}
</template>
