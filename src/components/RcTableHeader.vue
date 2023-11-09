<script setup lang="ts">
import { FlexRender } from '@tanstack/vue-table';
import type { ColumnPinningState, Header, HeaderGroup } from '@tanstack/vue-table';
import { ref, toRefs } from 'vue';

const props = defineProps<{
  headerGroups: HeaderGroup<any>[],
  pinnedColumns: ColumnPinningState,
}>();

const { pinnedColumns } = toRefs(props);

const elementsToMeasure = ref(null);

const thClass = (header: Header<any, unknown>) => {
  const base = {
    'py-3': true,
    'px-2': true,
    'border-none': true,
    'font-normal': true,
    'dark:bg-neutral-900': true,
    'z-10': true,
  };

  if (header.column.getIsPinned()) {
    return {
      ...base,
      'sticky': true,
    };
  }

  return base;
};

const stickyOffset = (header: Header<any, unknown>) => {
  if (header.column.getIsPinned()) {
    const all = elementsToMeasure.value;
    let offsetLeft = null;

    if (all) {
      const elementIndex = pinnedColumns.value.left?.findIndex(x => x === header.id);
      if (typeof elementIndex === 'undefined') {
        return { };
      }
      if (elementIndex >= 1) {
        const offsetElement = (all as any[]).find(x => x.__vnode.key === pinnedColumns.value.left?.[elementIndex - 1]);
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
  <thead class="sticky top-0 z-30">
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
        ref="elementsToMeasure"
        :colSpan="header.colSpan"
        :class="thClass(header)"
        :style="stickyOffset(header)"
      >
        <span 
          v-if="!header.isPlaceholder"
          class="
            flex
            items-center
            gap-2
            w-fit
            cursor-pointer
            select-none
          "
        >
          <template v-if="header.column.getCanPin()">
            <font-awesome-icon
              :icon="['fas', 'arrow-right-to-bracket']"
              class="
                rotate-180
                z-0
              "
              @click="header.column.pin('left')"
            />
          </template>
          <span
            class="
              group
              flex
              items-center
              gap-2
              dark:hover:text-neutral-100
            "
            @click="header.column.getToggleSortingHandler()?.($event)"
          >
            <FlexRender
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />

            <template v-if="header.column.getCanSort()">
              <font-awesome-icon
                v-if="!header.column.getIsSorted()"
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
            </template>
          </span>
        </span>
      </th>
    </tr>
  </thead>
</template>
