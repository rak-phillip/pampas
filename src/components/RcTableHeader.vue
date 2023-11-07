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
      >
        <span 
          v-if="!header.isPlaceholder"
          class="
            group
            flex
            items-center
            gap-2
            w-fit
            cursor-pointer
            select-none
            dark:hover:text-neutral-100
          "
          @click="header.column.getToggleSortingHandler()?.($event)"
        >
          <FlexRender
            :render="header.column.columnDef.header"
            :props="header.getContext()"
          />

          <font-awesome-icon
            v-if="header.column.getCanSort() && !header.column.getIsSorted()"
            :icon="['fas', 'sort']"
            class="
              dark:text-neutral-700
              dark:group-hover:text-neutral-100
            "
          />
          <font-awesome-icon
            v-if="header.column.getIsSorted() === 'asc'"
            :icon="['fas', 'sort-up']"
            class="
              dark:text-neutral-200
              dark:group-hover:text-neutral-100
            "
          />
          <font-awesome-icon
            v-if="header.column.getIsSorted() === 'desc'"
            :icon="['fas', 'sort-down']"
            class="
              dark:text-neutral-200
              dark:group-hover:text-neutral-100
            "
          />
        </span>
      </th>
    </tr>
  </thead>
</template>
