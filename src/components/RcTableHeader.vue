<!-- <script setup lang="ts">
import type { HeaderGroup, RowData } from '@tanstack/vue-table';

defineProps<{
  headers: HeaderGroup<RowData>[]
}>()
</script>

<template>
  <thead>
    <th v-for="header in headers" :key="header.id" :colspan="header.colspan">
      <FlexRender
        v-if="!header.isPlaceholder"
        :render="header.column.columnDef.header"
        :props="header.getContext()"
      />
    </th>
  </thead>
</template> -->
