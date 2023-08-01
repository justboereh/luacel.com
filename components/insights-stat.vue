<script setup lang="ts">
const props = defineProps({
    value: null,
    name: String,
    tooltip: String,
    loading: Boolean,
})
</script>

<template>
    <a-card>
        <p class="flex items-center gap-2 text-sm text-dark-800/50">
            {{ name }}

            <client-only>
                <a-tooltip v-if="tooltip">
                    <template #title>{{ tooltip }}</template>

                    <icon name="fluent:info-16-regular" />
                </a-tooltip>
            </client-only>
        </p>

        <div class="relative">
            <p v-if="value" class="text-2xl">{{ value }}</p>

            <slot />

            <div
                v-if="loading"
                class="grid place-items-center w-full h-full top-0 left-0 absolute bg-white/75"
            >
                Loading...
            </div>
        </div>
    </a-card>
</template>
