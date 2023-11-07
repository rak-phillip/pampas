<script setup lang="ts">
import { FlexRender } from '@tanstack/vue-table';
import type { HeaderGroup } from '@tanstack/vue-table';

defineProps<{
  headerGroups: HeaderGroup<any>[],
}>();
</script>

<template>
  <thead>
    <tr
      v-for="headerGroup in headerGroups"
      :key="headerGroup.id"
      class="
        dark:bg-neutral-900
        border-b
        dark:border-neutral-500 
        text-left
      "
    >
      <th
        v-for="header in headerGroup.headers"
        :key="header.id"
        :colSpan="header.colSpan"
        class="
          py-3
          px-2
          border-none
          font-normal
        "
        @click="header.column.getToggleSortingHandler()?.($event)"
      >
        <template v-if="!header.isPlaceholder">
          <FlexRender
            :render="header.column.columnDef.header"
            :props="header.getContext()"
          />

          {{
            { asc: ' 🔼', desc: ' 🔽' }[
              header.column.getIsSorted() as string
            ]
          }}
        </template>
      </th>
    </tr>
  </thead>
</template>
