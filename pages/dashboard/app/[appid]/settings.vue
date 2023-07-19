<script setup>
import { Rules } from '#rules/app'
import { usePrevious, watchDebounced, watchOnce } from '@vueuse/core'

const app = inject('useApp')
const canSubmit = ref(false)
const settings = reactive({
    name: '',
    region: '',
    domain_custom: '',
    domain_generated: '',
    domain_set: '',
    timeout: '',
    memory: '',
})

watchOnce(app, (a) => {
    for (const key of Object.keys(a)) {
        if (!(key in settings)) continue

        settings[key] = a[key]
    }
})

watchDebounced(Object.values(toRefs(settings)), (value, old) => {
    console.log(value, old)
    if (!old) return (canSubmit.value = false)

    for (const key of Object.keys(value)) {
        if (value[key] === old[value]) continue

        return (canSubmit.value = true)
    }

    canSubmit.value = true
})

definePageMeta({
    layout: 'app',
})
</script>

<template>
    <div class="p-4 sm:px-8">
        <div class="max-w-5xl mx-auto space-y-4">
            <h2>General</h2>

            <p>Settings and options for the app.</p>

            <a-form layout="vertical" :model="settings" :rules="Rules">
                <a-form-item
                    label="Name"
                    name="name"
                    class="max-w-md"
                    hasFeedback
                >
                    <a-input v-model:value="settings.name" />
                </a-form-item>

                <a-form-item
                    label="Region"
                    name="region"
                    class="max-w-md"
                    hasFeedback
                >
                    <a-select :value="settings.region" disabled />
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

                <a-form-item label="Subdomain" class="max-w-md" hasFeedback>
                    <a-input
                        v-model:value="settings.domain_set"
                        :placeholder="settings.domain_generated"
                        addon-after=".luacel.app"
                    />
                </a-form-item>

                <a-button type="primary" :disabled="!canSubmit">
                    Save settings
                </a-button>
            </a-form>
        </div>
    </div>
</template>
