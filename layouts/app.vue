<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import { App, AppFunction } from '#types/app'
import { NuxtLink } from '#components'

const route = useRoute()
const router = useRouter()
const { data: App } = useFetch<App>(
    computed(() => `/api/apps/${route.params.name}`),
    {
        method: 'POST',
    }
)
const {
    data: Functions,
    execute: FunctionsExecute,
    pending: isFunctionsPending,
} = useFetch<AppFunction[]>(`/api/functions`, {
    method: 'POST',
    body: {
        id: computed(() => App.value?.id),
    },
})

const AppTab = computed(() => route.path.split('/').slice(3, 4)[0])
const Path = computed(() => route.path.split('/').slice(0, 3).join('/'))

provide('useApp', App)
provide('useAppTab', AppTab)
provide('useAppPath', Path)
provide('useFunctions', Functions)
provide('useFunctionsPending', isFunctionsPending)
provide('useRefreshFunctions', FunctionsExecute)
</script>

<template>
    <div class="min-h-screen">
        <div class="p-4 sm:px-8 sm:pt-8 flex justify-between items-center">
            <nuxt-link
                to="/dashboard"
                class="h-10 flex gap-3 items-center text-white"
            >
                <svg-logo-icon class="h-full" />

                <svg-logo-name class="h-1/2 <sm:hidden" />
            </nuxt-link>

            <div class="flex gap-4 items-center">
                <nuxt-link to="/docs">
                    <a-button> Docs </a-button>
                </nuxt-link>

                <nuxt-link to="/account">
                    <a-button> Account </a-button>
                </nuxt-link>
            </div>
        </div>

        <div class="flex items-end w-full">
            <div class="w-4 sm:w-8 h-px bg-dark-50 bottom-0" />

            <div class="flex overflow-x-auto">
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

            <div class="min-w-4 flex-grow h-px bg-dark-50 bottom-0" />
        </div>

        <slot />
    </div>
</template>
