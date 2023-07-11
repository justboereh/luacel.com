<script setup lang="ts">
// import { VAceEditor } from 'vue3-ace-editor'
import { useRefHistory } from '@vueuse/core'
import JSZip from 'jszip'
import { App as AppT } from '#types/app'
import { watchDebounced } from '@vueuse/core'

// import 'ace-builds/src-noconflict/mode-lua'
// import 'ace-builds/src-noconflict/theme-twilight'

type AppRef = globalThis.Ref<AppT | undefined>
type FunctionsRef = globalThis.Ref<{ name: string }[]>

const App = inject<AppRef>('useApp')
const Functions = inject<FunctionsRef>('useFunctions')
const expandedKeys = ref()
const selectedKeys = ref()
const fnName = ref<string | null>(null)
const cwFile = ref<string | null>(null)
const zip = ref<typeof JSZip>()
const oldcode = ref<string | null>(null)
const code = ref<string>('')
const codeHistory = useRefHistory(code)
const dirs = computed(() => {
    if (!zip.value) return []

    return Object.keys(zip.value.files).map((x) => ({ title: x, key: x }))
})
// prettier-ignore
const testcode = ref('-- function.lua\n\nreturn function(req, res)\n   local name = req.header("x-name")\n\n   if not name then\n      res.status(401)\n      return res.send("who are you?")\n   end\n\n   if name ~= "mom" then\n      return res.send("you\'re not my mom")\n   end\n\n   res.send("hi mom")\nend')

watchDebounced(
    [selectedKeys, zip],
    async ([skeys, z], [oldsKeys]) => {
        if (!z) return (code.value = '')
        if (!skeys) return (code.value = '')
        if (oldsKeys && skeys[0] === oldsKeys[0]) return

        const file = z.files[skeys[0]]

        oldcode.value = code.value = await file.async('string')
    },
    { debounce: 500 }
)

watchDebounced(
    [fnName],
    async ([name]) => {
        if (!name || !App || !App.value) return

        const { data } = await useFetch<number[]>(
            `/api/functions/${name || ''}`,
            {
                method: 'POST',
                body: {
                    id: App.value.id,
                },
            }
        )

        if (!data.value) return

        const z = new JSZip()
        await z.loadAsync(Uint8Array.from(data.value))

        zip.value = z
    },
    { debounce: 500 }
)

definePageMeta({
    layout: 'app',
})
</script>

<template>
    <div class="p-4 sm:px-8">
        <div class="max-w-5xl mx-auto space-y-4">
            <div v-if="!zip" class="grid place-items-center min-h-sm">
                <a-form layout="vertical">
                    <a-form-item label="Select function">
                        <a-select v-model:value="fnName">
                            <a-select-option
                                v-for="fn of Functions || []"
                                :value="fn.name"
                            >
                                {{ fn.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form>
            </div>

            <div v-else class="flex">
                <div class="min-w-60">
                    <a-directory-tree
                        v-model:expandedKeys="expandedKeys"
                        v-model:selectedKeys="selectedKeys"
                        :tree-data="dirs"
                    ></a-directory-tree>
                </div>

                <div class="flex-grow">
                    <!-- <VAceEditor
                        v-model:value="code"
                        :options="{
                            fontSize: 16,
                        }"
                        theme="twilight"
                        lang="lua"
                        class="min-h-sm min-w-sm"
                    /> -->
                </div>
            </div>
        </div>
    </div>
</template>
