<script setup lang="ts">
import { FlexRender } from '@tanstack/vue-table';
import type { Cell, ColumnPinningState, Row } from '@tanstack/vue-table';
import { split } from 'postcss/lib/list';
import { ref, toRefs } from 'vue';

const props = defineProps < {
  rows: Row<any[]>[],
  pinnedColumns: ColumnPinningState,
}>();

const { rows, pinnedColumns } = toRefs(props);

const elementsToMeasure = ref(null);

const tdClass = (cell: Cell<any, unknown>) => {
  const base = {
    'py-3': true,
    'px-2': true,
    'dark:bg-neutral-800': true,
    'bg-clip-padding': true,
    'font-normal': true,
    'z-20': true,
  };

  if (cell.column.getIsPinned()) {
    return {
      ...base,
      'sticky': true,
      'left-0': true,
    };
  }

  return base;
};

const stickyOffset = (cell: Cell<any, unknown>) => {
  if (cell.column.getIsPinned()) {
    const all = elementsToMeasure.value;
    let offsetLeft = null;

    if (all) {
      const key = cell.id.split('_')[0];
      const elementIndex = pinnedColumns.value.left?.findIndex(x => `${key}_${x}` === cell.id);

      if (typeof elementIndex === 'undefined') {
        return { };
      }

      if (elementIndex >= 1) {
        const offsetElement = (all as any[]).find(x => x.__vnode.key === `${key}_${pinnedColumns.value.left?.[elementIndex - 1]}`);
        offsetLeft = offsetElement.getBoundingClientRect().left + offsetElement.getBoundingClientRect().width;
        return { left: `${offsetLeft - 1}px` };
      } else {
        return { left: 0 };
      }
    }
  }
  return { };
};
</script>

<template>
  <tbody>
    <tr
      v-for="row in rows"
      :key="row.id"
      class="
        border-b
        dark:border-neutral-500
        dark:hover:bg-neutral-900
      "
    >
      <td
        v-for="cell in row.getVisibleCells()"
        ref="elementsToMeasure"
        :key="cell.id"
        :class="tdClass(cell)"
        :style="stickyOffset(cell)"
      >
        <FlexRender
          :render="cell.column.columnDef.cell"
          :props="cell.getContext()"
        />
      </td>
    </tr>
  </tbody>
</template>
