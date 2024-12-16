<script setup lang="ts">
import { ref } from 'vue'
import type { EffectsCtx } from 'webgl-effects'

import { filters as _filters } from '../../common/filters'

interface Props {
  effectsCtx?: EffectsCtx
}
const { effectsCtx } = defineProps<Props>()

const filters = ref(
  _filters.map((filter) => ({
    ...filter,
    preset: { ...filter.filterClass.preset },
    active: false
  }))
)

function onClick(filter: (typeof filters.value)[number]) {
  if (!effectsCtx) {
    return
  }

  filter.active = !filter.active

  if (filter.active) {
    effectsCtx.filter.add(filter.filterClass)
    // TODO: Modify configuration through the form
    effectsCtx.filter.updateOptions(filter.filterClass, filter.preset)
  } else {
    effectsCtx.filter.remove(filter.filterClass)
  }
}
</script>

<template>
  <ul class="filters">
    <li v-for="filter in filters" :key="filter.label">
      <button
        class="filter-button"
        :class="{
          active: filter.active
        }"
        @click="onClick(filter)"
      >
        {{ filter.label }}
      </button>
    </li>
  </ul>
</template>
