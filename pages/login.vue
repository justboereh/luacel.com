<script setup lang="ts">
import { Rules } from '#rules/user'

const user = useCurrentUser()
const route = useRoute()
const router = useRouter()
const isLoggingIn = ref(false)
const form = reactive({
    username: '',
    password: '',
})

async function Login() {
    if (isLoggingIn.value) return
    isLoggingIn.value = true

    const { error } = await useFetch('/api/account/login', {
        method: 'POST',
        body: {
            username: form.username,
            password: form.password,
        },
    })

    isLoggingIn.value = false
    if (error.value) return

    let to = '/dashboard'

    if (route.query.redirect) {
        to = decodeURIComponent(route.query.redirect as string)
    }

    router.push(to)
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

            <h1>Login</h1>

            <p class="text-sm">
                Need an account?
                <nuxt-link to="/register">
                    <a-button type="link" size="small"> Register </a-button>
                </nuxt-link>
            </p>

            <br />

            <a-form
                :rules="Rules"
                :model="form"
                layout="vertical"
                autocomplete="off"
                @finish="Login"
            >
                <a-form-item label="Username" name="username">
                    <a-input v-model:value="form.username" />
                </a-form-item>

                <a-form-item label="Password" name="password">
                    <a-input v-model:value="form.password" type="password" />
                </a-form-item>

                <a-button
                    type="primary"
                    html-type="submit"
                    :loading="isLoggingIn"
                    :disabled="isLoggingIn"
                >
                    Login
                </a-button>
            </a-form>
        </div>
    </div>
</template>
