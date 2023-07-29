<script setup>
import { Rules } from '#rules/app'
import { usePrevious, watchDebounced, watchOnce } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const app = useState('useStateApp')
const form = reactive({
    updating: false,
    deleting: false,
})
const settings = reactive({
    name: '',
    region: '',
    domain_custom: '',
    domain_generated: '',
    domain_set: '',
    timeout: 1,
    memory: 128,
})

async function UpdateSettings() {
    if (form.updating) return
    form.updating = true

    const { error } = await useFetch(() => `/api/apps/${route.params.appid}`, {
        method: 'PATCH',
        body: settings,
    })

    form.updating = false

    if (!error.value) return
}

async function DeleteApp() {
    if (form.deleting) return
    form.deleting = true

    const { error } = await useFetch(() => `/api/apps/${route.params.appid}`, {
        method: 'DELETE',
    })

    if (error.value) {
        return
    }

    router.push('/dashboard')
}

watch(
    app,
    (a) => {
        if (!a && location) return location.reload()

        for (const key of Object.keys(a)) {
            if (!(key in settings)) continue

            settings[key] = a[key]
        }
    },
    {
        immediate: true,
    }
)

watchDebounced(Object.values(toRefs(settings)), (value, old) => {
    if (old.every((x) => x === '')) return (form.disabled = false)
    if (!old) return (form.disabled = false)

    for (const key of Object.keys(value)) {
        if (value[key] === old[value]) continue

        return (form.disabled = true)
    }

    form.disabled = true
})

definePageMeta({
    layout: 'app',
})
</script>

<template>
    <div class="p-4 sm:px-8">
        <div class="max-w-5xl mx-auto space-y-4">
            <h1>General</h1>

            <p>Settings and options for the app.</p>

            <a-form
                layout="vertical"
                autocomplete="off"
                :model="settings"
                :rules="Rules"
                @finish="UpdateSettings"
            >
                <a-form-item label="Name" name="name" class="max-w-md">
                    <a-input v-model:value="settings.name" />
                </a-form-item>

                <a-form-item label="Region" name="region" class="max-w-md">
                    <ClientOnly>
                        <a-select :value="settings.region" disabled />
                    </ClientOnly>
                </a-form-item>

                <a-row class="max-w-md">
                    <a-col :span="12">
                        <a-form-item label="Memory" name="memory">
                            <a-input-number
                                v-model:value="settings.memory"
                                :min="128"
                                :max="10240"
                            />
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item label="Timeout" name="timeout">
                            <a-input-number
                                v-model:value="settings.timeout"
                                :min="1"
                                :max="10"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-form-item label="Subdomain" class="max-w-md">
                    <a-input
                        v-model:value="settings.domain_set"
                        :placeholder="settings.domain_generated"
                        addon-after=".luacel.app"
                    />
                </a-form-item>

                <a-button
                    type="primary"
                    :disabled="form.updating"
                    :loading="form.updating"
                    html-type="submit"
                >
                    Save settings
                </a-button>
            </a-form>

            <br />

            <h1>Danger</h1>

            <p>Dangerous actions for the app.</p>

            <a-button
                danger
                ghost
                :disabled="form.deleting"
                :loading="form.deleting"
                @click="DeleteApp"
            >
                Delete app
            </a-button>
        </div>
    </div>
</template>
