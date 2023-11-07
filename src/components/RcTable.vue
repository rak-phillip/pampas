<script setup lang="tsx">
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  createColumnHelper,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/vue-table'
import type { SortingFnOption, SortingState } from '@tanstack/vue-table';
import { ref, toRefs } from 'vue'

type TableColumns = {
  [key: string]: {
    header: string,
    enableSorting?: boolean,
    sortingFn?: SortingFnOption<any[]> | undefined
  }
}

const props = defineProps<{
  tableData: any[]
  tableColumns: TableColumns
  hasRowSelection?: boolean
  hasRowAction?: boolean
}>()

const { tableData, tableColumns, hasRowSelection, hasRowAction } = toRefs(props)

const columnHelper = createColumnHelper<typeof tableData.value>()

const selectColumn = hasRowSelection.value
  ? [
    {
      id: 'select',
      header: ({ table }: { table: any }) => {
        return <input
          type='checkbox'
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        ></input>
      },
      cell: ({ row }: { row: any }) => {
        return <input
          type='checkbox'
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        ></input>
      }
    }
  ]
  : []

const actionColumn = hasRowAction.value
  ? [
    {
      id: 'action',
      cell: () => {
        return <div>🪬</div>
      }
    }
  ] :
  []

const providedColumns = Object.entries(tableColumns.value)
  .map(([key, val]) => {
    return {
      ...columnHelper.accessor(key, {
        header: val.header,
        enableSorting: val.enableSorting || false,
      }),
      ...(val.sortingFn ? { sortingFn: val.sortingFn } : {})
    }
  })

const columns = [...selectColumn, ...providedColumns, ...actionColumn]

const data = ref(tableData.value)

const sorting = ref<SortingState>([])

const rowSelection = ref({});
const globalFilter = ref('')

const table = useVueTable({
  get data() {
    return data.value
  },
  columns,
  state: {
    get sorting() {
      return sorting.value
    },
    get rowSelection() {
      return rowSelection.value
    },
    get globalFilter() {
      console.debug
      return globalFilter.value
    }
  },
  enableRowSelection: true,
  onRowSelectionChange: updateOrValue => {
    rowSelection.value =
      typeof updateOrValue === 'function'
        ? updateOrValue(rowSelection.value)
        : updateOrValue
  },
  onSortingChange: updateOrValue => {
    sorting.value =
      typeof updateOrValue === 'function'
        ? updateOrValue(sorting.value)
        : updateOrValue
  },
  enableGlobalFilter: true,
  onGlobalFilterChange: updateOrValue => {
    globalFilter.value =
      typeof updateOrValue === 'function'
        ? updateOrValue(globalFilter.value)
        : updateOrValue
  },
  globalFilterFn: "auto",
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})
</script>

<template>
  <div>
    <input v-model="globalFilter" />
  </div>
  <table>
    <thead>
      <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <th v-for="header in headerGroup.headers" :key="header.id" :colSpan="header.colSpan"
          @click="header.column.getToggleSortingHandler()?.($event)">
          <template v-if="!header.isPlaceholder">
            <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />

            {{
              { asc: ' 🔼', desc: ' 🔽' }[
                header.column.getIsSorted() as string
              ]
            }}
          </template>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in table.getRowModel().rows" :key="row.id">
        <td v-for="cell in row.getVisibleCells()" :key="cell.id">
          <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style>
html {
  font-family: sans-serif;
  font-size: 14px;
}

table {
  border: 1px solid lightgray;
}

tbody {
  border-bottom: 1px solid lightgray;
}

th {
  border-bottom: 1px solid lightgray;
  border-right: 1px solid lightgray;
  padding: 2px 4px;
}

tfoot {
  color: gray;
}

tfoot th {
  font-weight: normal;
}
</style>

