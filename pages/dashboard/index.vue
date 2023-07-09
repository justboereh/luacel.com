<script setup lang="ts">
import { Rules, Regions } from '#rules/app'

type App = {
    name: string
    event: string
    img: string
    functions: any
}

const auth = useSupabaseAuthClient().auth
const search = ref('')
const showCreate = ref(false)
const isCreating = ref(false)
const prevNameValidValue = ref<string | boolean>(false)
const prevName = ref('')
const formError = ref()
const form = reactive({
    name: '',
    region: Regions[0].value,
})
const { data: apps } = useFetch<App[]>('/api/apps', {
    method: 'POST',
})

const appsToShow = computed(() => {
    if (!apps.value) return []

    const value = search.value.trim()

    if (value === '') return apps.value

    return apps.value.filter(({ name }) => name.includes(value))
})

async function checkNameExists(name: string) {
    if (prevName.value === name) return prevNameValidValue.value
    prevName.value = name

    const { data } = await useFetch('/api/apps/name-exists', {
        method: 'POST',
        body: {
            name,
        },
    })

    const value = !data.value || 'App name already exists'

    prevNameValidValue.value = value

    return value
}

async function Submit() {
    if (isCreating.value) return
    isCreating.value = true

    const { error } = await useFetch<string>('/api/apps', {
        method: 'PUT',
        body: {
            ...form,
        },
    })

    if (error.value) {
        isCreating.value = false

        formError.value = error.value.data

        return
    }

    useRouter().push(`/dashboard/app-${form.name}`)
}

definePageMeta({
    layout: 'dashboard',
})
useHead({ title: 'Dashboard : Luacel' })
</script>

<template>
    <a-divider style="margin: 0" />

    <main class="p-4">
        <div class="space-y-4 max-w-5xl mx-auto">
            <div
                class="flex <sm:flex-col sm:flex-row-reverse sm:justify-between gap-4"
            >
                <div class="flex justify-end">
                    <a-button type="primary" @click="showCreate = true">
                        <template #icon>
                            <icon name="fluent:add-20-regular" class="mr-2" />
                        </template>

                        Create App
                    </a-button>
                </div>

                <div class="flex flex-grow sm:max-w-sm">
                    <a-input
                        v-model:value="search"
                        placeholder="Search app..."
                        class="min-w-full"
                    />
                </div>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <a-card v-for="app of appsToShow" :key="app.name" size="small">
                    <nuxt-link
                        class="h-20 flex gap-4 overflow-hidden"
                        :to="`/dashboard/app-${app.name}/functions`"
                    >
                        <img
                            class="h-full rounded-md"
                            :src="`https://api.dicebear.com/6.x/shapes/svg?seed=${app.name}`"
                            alt="App icon"
                        />

                        <div
                            class="flex flex-col flex grow justify-between whitespace-nowrap"
                        >
                            <span class="text-white text-lg">
                                {{ app.name }}
                            </span>

                            <span class="text-white/50">~ {{ app.event }}</span>

                            <div>
                                <span class="flex items-center gap-2">
                                    <icon
                                        name="fluent:math-formula-16-regular"
                                    />

                                    <span class="text-white/50">
                                        {{ app.functions }} functions
                                    </span>
                                </span>
                            </div>
                        </div>
                    </nuxt-link>
                </a-card>
            </div>
        </div>
    </main>

    <a-modal
        v-model:visible="showCreate"
        title="Create app"
        :centered="true"
        :destroyOnClose="true"
        :maskClosable="false"
        :footer="null"
        okText="Submit"
    >
        <a-form
            ref="formEl"
            layout="vertical"
            :model="form"
            :rules="Rules"
            @finish="Submit"
        >
            <a-form-item label="Name" name="name">
                <a-input
                    v-model:value="form.name"
                    :rules="[...Rules.name, checkNameExists]"
                />
            </a-form-item>

            <a-form-item label="Region" name="region">
                <a-select v-model:value="form.region" required>
                    <a-select-option
                        v-for="region of Regions"
                        :value="region.value"
                    >
                        {{ region.title }}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <p v-if="formError" class="text-red-500">Error: {{ formError }}</p>

            <a-button type="primary" :loading="isCreating" html-type="submit">
                Submit
            </a-button>
        </a-form>
    </a-modal>
</template>