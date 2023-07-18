<script setup lang="ts">
import { App, AppFunction } from '#types/app'
import { NuxtLink } from '#components'
import { watchOnce } from '@vueuse/core'

const app = ref<App>()
const functions = ref<AppFunction[]>([])
const route = useRoute()
const refresh = ref<() => Promise<void>>()
const fnPending = ref(true)

const appTab = computed(() => route.path.split('/')[3])
const path = computed(() => route.path.split('/').slice(0, 3).join('/'))

watch(
    computed(() => route.params.name),
    async (name) => {
        if (!name) return (app.value = undefined)

        const { data } = await useFetch<App>(`/api/apps/${name}`, {
            method: 'POST',
        })

        if (!data.value) return

        app.value = data.value
    },
    { immediate: true }
)

watch(
    app,
    async (a) => {
        if (!a) return

        fnPending.value = true

        const { data, refresh: r } = await useFetch<AppFunction[]>(
            `/api/functions`,
            {
                method: 'POST',
                body: {
                    id: a.id,
                },
            }
        )

        watchOnce(data, (d) => (functions.value = d || []))
        refresh.value = r

        fnPending.value = false
    },
    {
        immediate: true,
    }
)

provide('useApp', app)
provide('useAppTab', appTab)
provide('useAppPath', path)
provide('useFunctions', functions)
provide('useFunctionsPending', fnPending)
provide('useRefreshFunctions', () => {
    if (!refresh.value) return Promise.resolve()

    return refresh.value()
})
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <div class="p-4 sm:px-8 sm:pt-8 bg-white">
            <div class="max-w-5xl mx-auto flex justify-between items-center">
                <nuxt-link
                    to="/dashboard"
                    class="h-10 flex gap-3 items-center text-dark-800"
                >
                    <svg-logo-icon class="h-full" />

                    <svg-logo-name class="h-1/2 <sm:hidden" />
                </nuxt-link>

                <div class="flex gap-4 items-center">
                    <nuxt-link to="/docs">
                        <a-button> Docs </a-button>
                    </nuxt-link>

                    <nuxt-link to="/account">
                        <a-button type="bordered"> Account </a-button>
                    </nuxt-link>
                </div>
            </div>
        </div>

        <div class="w-full relative">
            <div
                class="absolute bottom-0 w-screen h-px bg-light-900 bottom-0"
            />

            <div class="max-w-5xl mx-auto flex overflow-x-auto z-10">
                <auth-tab
                    name="functions"
                    icon="fluent:math-formula-20-regular"
                />

                <auth-tab name="code" icon="file-icons:lua" />

                <auth-tab
                    name="insights"
                    icon="fluent:arrow-trending-lines-20-regular"
                />

                <auth-tab name="settings" icon="fluent:settings-20-regular" />
            </div>
        </div>

        <main class="flex-grow">
            <slot />
        </main>

        <Footer />
    </div>
</template>
