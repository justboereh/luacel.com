<script setup lang="ts">
import { useRefHistory } from '@vueuse/core'
import JSZip from 'jszip'
import { App, AppFunction } from '#types/app'
import { watchDebounced } from '@vueuse/core'

type Code = {
    data: string
    oldData: string | null
    zip: typeof JSZip | null
    cwf: string | null
}

const route = useRoute()
const app = useState<App>('useStateApp')
const functions = useState<AppFunction[]>('useFunctions')
const expandedKeys = ref()
const selectedKeys = ref()
const func = reactive({
    selected: '',
    connecting: false, // fetching the selected func code
    fetching: false, // fetching all functions
})

const code = reactive<Code>({
    data: '',
    oldData: null,
    zip: null,
    cwf: null,
})
const codeHistory = useRefHistory(toRef(code, 'data'))
// prettier-ignore
const mobileRegEx = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i
const ismobile = ref(false)
const dirs = computed(() => {
    if (!code.zip) return []

    return Object.keys(code.zip.files).map((x) => ({ title: x, key: x }))
})
// prettier-ignore
const testcode = ref('-- function.lua\n\nreturn function(req, res)\n   local name = req.header("x-name")\n\n   if not name then\n      res.status(401)\n      return res.send("who are you?")\n   end\n\n   if name ~= "mom" then\n      return res.send("you\'re not my mom")\n   end\n\n   res.send("hi mom")\nend')

watchDebounced(
    [selectedKeys, toRef(code.zip)],
    async ([skeys, z], [oldsKeys]) => {
        if (!z) return (code.data = '')
        if (!skeys) return (code.data = '')
        if (oldsKeys && skeys[0] === oldsKeys[0]) return

        const file = z.files[skeys[0]]

        code.oldData = code.data = await file.async('string')
    },
    { debounce: 500 }
)

async function ConnectFunction() {
    if (func.selected === '') return
    if (func.fetching) return
    if (func.connecting) return
    func.connecting = true

    const { data } = await useFetch<number[]>(
        () => `/api/apps/${route.params.appid}/functions/${func.selected}`,
        {
            method: 'POST',
        }
    )

    func.connecting = false
    func.selected = ''
    if (!data.value) return

    const z = new JSZip()
    await z.loadAsync(Uint8Array.from(data.value))

    code.zip = z
}

watchDebounced(
    app,
    async (a) => {
        if (!a) return
        func.fetching = true

        const { data } = await useFetch<AppFunction[]>(
            () => `/api/apps/${route.params.appid}/functions`,
            {
                method: 'POST',
            }
        )

        func.fetching = false
        functions.value = data.value || []
    },
    {
        immediate: true,
    }
)

onMounted(() => {
    let name = route.query.fnname

    if (!name) return
    if (Array.isArray(name)) name = name[0]

    func.selected = name as string
})

onMounted(() => {
    ismobile.value = mobileRegEx.test(navigator.userAgent.substring(0, 4))
})

definePageMeta({
    layout: 'app',
})
</script>

<template>
    <div class="p-4 sm:px-8">
        <div class="max-w-5xl mx-auto space-y-4">
            <div v-if="ismobile">not supported on mobile</div>

            <div v-else-if="!code.zip" class="grid place-items-center min-h-lg">
                <div class="text-center">
                    <icon
                        name="fluent:code-block-20-regular"
                        class="text-6xl"
                    />
                    <h3>Select the function you'd like to connect to</h3>

                    <br />

                    <client-only>
                        <a-select
                            v-model:value="func.selected"
                            :disabled="func.connecting"
                            :loading="func.connecting"
                            :options="
                                functions.map(({ name }) => ({
                                    value: name,
                                    label: name,
                                }))
                            "
                            class="min-w-40"
                            placeholder="Function"
                        />
                    </client-only>
                </div>
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
                    <!-- <LazyMonacoEditor
                        v-model="code"
                        class="min-h-sm"
                        :options="{
                            theme: 'vs',
                            scrollBeyondLastLine: false,
                            padding: { bottom: 14, top: 14 },
                        }"
                        lang="lua"
                    /> -->
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.selection {
    border: 1px solid #ddd;
    border-radius: 5px;
    display: flex;
    width: fit-content;
    margin: auto;
}
</style>
