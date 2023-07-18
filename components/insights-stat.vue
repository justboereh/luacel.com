<script setup lang="ts">
const props = defineProps({ value: null, name: String })
</script>

<template>
    <a-card>
        <p class="text-sm text-dark-800/50">{{ name }}</p>

        <p v-if="value" class="text-2xl">{{ value }}</p>

        <slot />
    </a-card>
</template>
