<script setup lang="ts">
import { Rules } from '#rules/user'

const user = useCurrentUser()
const route = useRoute()
const router = useRouter()
const isRegister = ref(false)
const form = reactive({
    username: '',
    password: '',
    confirm: '',
})

Rules.username.push({
    required: true,
    trigger: 'change',
    async validator(_, v: string) {
        const { error } = await useFetch('/api/account/username-exists', {
            method: 'POST',
            body: {
                username: form.username,
            },
        })

        if (error.value) return Promise.reject('Username exists')

        return Promise.resolve()
    },
})

Rules.confirm.push({
    required: true,
    trigger: 'change',
    async validator(_, value: string) {
        if (form.password !== value)
            return Promise.reject('Does not match password')

        return Promise.resolve()
    },
})

async function Register() {
    if (isRegister.value) return
    isRegister.value = true

    const { error } = await useFetch('/api/account/register', {
        method: 'POST',
        body: {
            username: form.username,
            password: form.password,
        },
    })

    isRegister.value = false

    if (error.value) return

    Rules.username.pop()

    console.log(Rules.username)

    router.push('/login')
}

definePageMeta({
    layout: 'empty',
})
</script>

<template>
    <div
        class="top-0 bottom-0 left-0 right-0 fixed p-4 grid place-items-center"
    >
        <div
            class="w-full max-w-sm mx-auto h-auto my-auto p-8 shadow-lg shadow-black/15 rounded-md bg-white"
        >
            <nuxt-link
                to="/"
                class="h-10 flex gap-4 items-center text-dark-800"
            >
                <svg-logo-icon class="h-10" />

                <svg-logo-name class="h-6" />
            </nuxt-link>

            <br />

            <h1>Register</h1>

            <p class="text-sm">
                Have an account?
                <nuxt-link to="/login">
                    <a-button type="link" size="small"> Login </a-button>
                </nuxt-link>
            </p>

            <br />

            <a-form
                :rules="{ ...Rules }"
                :model="form"
                layout="vertical"
                autocomplete="off"
                @finish="Register"
            >
                <a-form-item label="Username" name="username">
                    <a-input v-model:value="form.username" />
                </a-form-item>

                <a-form-item label="Password" name="password">
                    <a-input-password v-model:value="form.password" />
                </a-form-item>

                <a-form-item label="Confirm Password" name="confirm">
                    <a-input-password v-model:value="form.confirm" />
                </a-form-item>

                <a-button
                    type="primary"
                    html-type="submit"
                    :loading="isRegister"
                    :disabled="isRegister"
                >
                    Register Now
                </a-button>
            </a-form>
        </div>
    </div>
</template>
