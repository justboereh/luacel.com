<script setup lang="ts">
import { App as AppT } from '#types/app'
import { NuxtLink } from '#components'

const app = useState<AppT>('useStateApp')
const tab = inject<globalThis.Ref<string>>('useAppTab')
const path = inject<globalThis.Ref<string>>('useAppPath')

defineProps({ name: { type: String, required: true }, icon: String })
</script>

<template>
    <nuxt-link
        class="px-4 py-2 capitalize relative"
        :to="path && app ? `${path}/${name}` : ''"
        :class="tab === name ? '' : 'text-dark-800'"
    >
        <span class="flex gap-2 items-center">
            <icon v-if="icon" :name="icon" />

            {{ name }}
        </span>

        <div
            class="absolute w-full h-px left-0 bottom-0"
            :class="tab === name ? 'bg-blue' : 'bg-light-900'"
        />
    </nuxt-link>
</template>
