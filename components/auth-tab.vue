<script setup lang="ts">
import { App as AppT } from '#types/app'
import { NuxtLink } from '#components'

const App = inject<globalThis.Ref<AppT>>('useApp')
const tab = inject<globalThis.Ref<string>>('useAppTab')
const path = inject<globalThis.Ref<string>>('useAppPath')

defineProps({ name: { type: String, required: true }, icon: String })
</script>

<template>
    <component
        class="px-4 py-2 capitalize relative"
        :to="`${path}/${name}`"
        :is="path && App ? NuxtLink : 'span'"
        :class="tab === name ? '' : 'text-white'"
    >
        <span class="flex gap-2 items-center">
            <icon v-if="icon" :name="icon" />

            {{ name }}
        </span>

        <div
            class="absolute w-full h-px left-0 bottom-0"
            :class="tab === name ? 'bg-blue' : 'bg-dark-50'"
        />
    </component>
</template>
