<script setup lang="ts">
import { useDark, usePrevious } from '@vueuse/core'
import { Rules } from '#rules/user'

const auth = useSupabaseAuthClient().auth
const user = useSupabaseUser()
const form = reactive({
    name: user.value?.user_metadata.name || '',
})

async function NewName() {
    auth.updateUser({
        data: {
            name: form.name.trim(),
        },
    })
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
                :model="form"
                :rules="Rules"
                @finish="NewName"
            >
                <a-form-item label="Name" name="name" class="max-w-md">
                    <a-input v-model:value="form.name" spellcheck="false" />
                </a-form-item>

                <a-button type="primary" html-type="submit"> Save </a-button>
            </a-form>
        </div>
    </div>
</template>
