<script setup lang="ts">
import { watchOnce } from '@vueuse/core'
import { App, AppFunction } from '#types/app'
import { NuxtLink } from '#components'

const App = ref<App>()
const AppName = ref<string>()
const Functions = ref<AppFunction[]>([])
const isFunctionsPending = ref(true)
const RefreshFunctions = ref<() => Promise<void>>()
const route = useRoute()
const router = useRouter()
const AppTab = ref()
const Path = ref()

watchOnce(AppName, async (name) => {
    const token = await GetUserToken()
    if (!token) return

    const { data: app } = await useFetch<App>(`/api/apps/${name}`, {
        method: 'POST',
        headers: {
            token,
        },
    })

    if (!app.value) return router.replace('/dashboard')

    useHead({ title: `App - ${app.value.name} : Luacel` })

    App.value = app.value

    const { data, execute, pending } = await useFetch<AppFunction[]>(
        `/api/functions`,
        {
            method: 'POST',
            headers: {
                token,
            },
            body: {
                id: app.value.id,
            },
        }
    )

    RefreshFunctions.value = execute

    watch(data, (v) => (Functions.value = v || []), {
        immediate: true,
    })

    watch(pending, (v) => (isFunctionsPending.value = v), {
        immediate: true,
    })
})

watch(
    route,
    (r) => {
        AppTab.value = r.path.split('/').slice(3, 4)[0]

        if (!r.params.name) return
        AppName.value = r.params.name as string
    },
    {
        immediate: true,
    }
)

watch(
    App,
    (a) => {
        if (!a) return

        Path.value = route.path.split('/').slice(0, 3).join('/')
    },
    {
        immediate: true,
    }
)

provide('useApp', App)
provide('useAppTab', AppTab)
provide('useAppPath', Path)
provide('useFunctions', Functions)
provide('useFunctionsPending', isFunctionsPending)
provide('useRefreshFunctions', RefreshFunctions)
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
