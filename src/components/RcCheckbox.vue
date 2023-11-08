<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue';

const props = defineProps<{
  modelValue?: boolean,
  checked?: boolean,
  indeterminate?: boolean,
  disabled?: boolean,
}>();

const { modelValue } = toRefs(props);

defineEmits(['update:modelValue', 'change']);

const isChecked = ref<boolean | undefined>(false);
const isIndeterminate = ref(false);

onMounted(() => {
  if (modelValue.value == undefined) {
    isIndeterminate.value = true;
  } else {
    isChecked.value = modelValue.value;
  }
});

</script>

<template>
  <div 
    @click="$emit('change', $event)"
  >
    <input
      type="checkbox"
      :indeterminate="indeterminate"
      :checked="checked"
      :value="modelValue"
      :disabled="disabled"
      class="
        opacity-0
        absolute
      "
      @input="$emit('update:modelValue', isChecked)"
      @change="$emit('change', $event)"
    >
    <span class="fa-layers fa-fw">
      <font-awesome-icon
        :icon="['fas', 'circle']"
        class="
          dark:text-sky-50
          fa-xs
        "
      />
      <font-awesome-icon
        v-if="checked"
        :icon="['fas', 'square-check']"
        class="
          dark:text-sky-600
        "
      />
      <font-awesome-icon
        v-if="indeterminate"
        :icon="['fas', 'square-minus']"
        class="
          dark:text-sky-600
        "
      />
      <font-awesome-icon
        v-if="!checked && !indeterminate"
        :icon="['fas', 'square']"
      />
    </span>
  </div>
</template>
