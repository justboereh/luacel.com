<script setup lang="ts">
const props = defineProps({ value: null, name: String, tooltip: String })
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

        <p v-if="value" class="text-2xl">{{ value }}</p>

        <slot />
    </a-card>
</template>
