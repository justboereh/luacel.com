<script setup lang="ts">
import Zip from 'jszip'
import type { TableColumnsType } from 'ant-design-vue'
import { Rules } from '#rules/app'
import { App as AppT, AppFunction } from '#types/app'

type AppRef = globalThis.Ref<AppT | undefined>
type FunctionsRef = globalThis.Ref<AppFunction[]>
type FunctionsPendingRef = globalThis.Ref<boolean>
type RefreshFunctionsRef = () => Promise<void>

const showCreate = ref(false)
const App = inject<AppRef>('useApp')
const Functions = inject<FunctionsRef>('useFunctions')
const isFunctionsPending = inject<FunctionsPendingRef>('useFunctionsPending')
const RefreshFunctions = inject<RefreshFunctionsRef>('useRefreshFunctions')

const isRefreshing = ref(false)
const isCreating = ref(false)
const prevNameValidValue = ref<string | boolean>(false)
const prevName = ref('')
const form = reactive({
    name: '',
    error: null,
})
const functionsColumns = ref<TableColumnsType>([
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Path',
        dataIndex: 'path',
        key: 'path',
    },
    {
        title: 'Action',
        key: 'action',
        width: '10%',
    },
])

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
    if (!App?.value) return

    isCreating.value = true

    const code = new Zip()

    code.file(
        'function.lua',
        "return function(event)\n\treturn 'hi mom'\nend\n"
    )

    const { error } = await useFetch('/api/functions', {
        method: 'PUT',
        body: {
            name: form.name,
            code: await code.generateAsync({ type: 'array' }),
            app: App.value.id,
        },
    })

    isCreating.value = false

    if (error.value) {
        form.error = error.value.data

        return
    }

    Refresh()

    showCreate.value = false
}

async function Refresh() {
    if (isRefreshing.value) return
    if (!RefreshFunctions) return

    isRefreshing.value = true

    await RefreshFunctions()

    isRefreshing.value = false
}

definePageMeta({
    layout: 'app',
})
</script>

<template>
    <div class="p-4 sm:px-8">
        <div class="max-w-5xl mx-auto space-y-4">
            <a-row justify="end" :gutter="[16]">
                <a-col>
                    <a-button :disabled="isRefreshing" @click="Refresh">
                        <template #icon>
                            <icon
                                name="fluent:arrow-counterclockwise-16-regular"
                                :style="
                                    isRefreshing
                                        ? 'animation: spin 0.5s linear infinite;'
                                        : ''
                                "
                            />
                        </template>
                    </a-button>
                </a-col>

                <a-col>
                    <a-button type="primary" @click="showCreate = true">
                        Create Function
                    </a-button>
                </a-col>
            </a-row>

            <a-table
                :columns="functionsColumns"
                :data-source="Functions"
                size="small"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'path'">
                        <nuxt-link :to="record.path" target="_blank">
                            {{ record.path }}
                        </nuxt-link>
                    </template>
                </template>

                <template #emptyText>
                    <div
                        class="min-h-sm flex flex-col justify-center items-center gap-2"
                    >
                        <icon
                            :name="
                                isFunctionsPending
                                    ? 'fluent:circle-line-24-regular'
                                    : 'fluent:document-error-24-regular'
                            "
                            class="text-4xl"
                            :class="isFunctionsPending ? 'animate-spin' : ''"
                        />

                        {{
                            isFunctionsPending
                                ? 'Data Pending...'
                                : 'No functions created.'
                        }}
                    </div>
                </template>
            </a-table>
        </div>
    </div>

    <a-modal
        v-model:visible="showCreate"
        title="Create app"
        :centered="true"
        :destroyOnClose="true"
        :maskClosable="false"
        :closable="!isCreating"
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
                <a-input v-model:value="form.name" />
            </a-form-item>

            <p v-if="form.error" class="text-red-500">
                Error: {{ form.error }}
            </p>

            <a-button type="primary" :loading="isCreating" html-type="submit">
                Submit
            </a-button>
        </a-form>
    </a-modal>
</template>

<style>
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(-360deg);
    }
}
</style>
