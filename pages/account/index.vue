<script setup lang="ts">
import { useDark, usePrevious } from '@vueuse/core'
import { Rules } from '#rules/user'

const user = useCurrentUser()
const updating = ref(false)
const form = reactive({
    username: user.value?.username || '',
})

async function NewName() {
    if (updating.value) return
    updating.value = true

    const { error } = await useFetch('/api/account/update', {
        method: 'POST',
        body: {
            username: form.username,
        },
    })

    await GetUserClient()

    updating.value = false

    if (error.value) {
        console.log(error.value)
    }
}

definePageMeta({
    layout: 'account',
})
useHead({ title: 'Account : Luacel' })
</script>

<template>
    <div class="p-4">
        <div class="max-w-5xl mx-auto">
            <h1>Account</h1>

            <p>Your account information.</p>

            <a-form
                layout="vertical"
                autocomplete="off"
                :model="form"
                :rules="Rules"
                @finish="NewName"
            >
                <a-form-item label="Username" name="username" class="max-w-md">
                    <a-input v-model:value="form.username" spellcheck="false" />
                </a-form-item>

                <a-button
                    type="primary"
                    html-type="submit"
                    :disabled="updating"
                    :loading="updating"
                >
                    Save
                </a-button>
            </a-form>
        </div>
    </div>
</template>
