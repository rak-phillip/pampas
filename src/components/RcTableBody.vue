<script setup lang="ts">
import { FlexRender } from '@tanstack/vue-table';
import type { Row } from '@tanstack/vue-table';
import { toRefs } from 'vue';

const props = defineProps < {
 rows: Row<any[]>[] 
}>();

const { rows } = toRefs(props);
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
        :key="cell.id"
        class="
          py-3
          px-2
          border-none
          font-normal
        "
      >
        <FlexRender
          :render="cell.column.columnDef.cell"
          :props="cell.getContext()"
        />
      </td>
    </tr>
  </tbody>
</template>
