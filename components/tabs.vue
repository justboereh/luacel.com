<script setup lang="ts">
type Props = {
    tabs: Array<{
        icon: string
        name: string
        url: string
    }>
    path: string
    tab: string
}

defineProps<Props>()
</script>

<template>
    <div class="w-full relative">
        <div class="absolute bottom-0 w-screen h-px bg-light-900 bottom-0" />

        <div class="max-w-5xl mx-auto flex overflow-x-auto z-10">
            <nuxt-link
                v-for="thistab of tabs"
                class="px-4 py-2 capitalize relative no-underline"
                :to="`${path}/${thistab.url}`"
                :class="
                    thistab.url === tab ? 'text-[#1677ff]' : 'text-dark-800'
                "
            >
                <span class="flex gap-2 items-center">
                    <icon v-if="thistab.icon" :name="thistab.icon" />

                    {{ thistab.name }}
                </span>

                <div
                    class="absolute w-full h-px left-0 bottom-0"
                    :class="
                        tab === thistab.url ? 'bg-[#1677ff]' : 'bg-light-900'
                    "
                />
            </nuxt-link>
        </div>
    </div>
</template>
