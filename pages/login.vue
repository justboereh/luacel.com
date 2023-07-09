<script setup lang="ts">
import { Rules } from '#rules/app'

const auth = useSupabaseAuthClient().auth
const route = useRoute()
const router = useRouter()
const isLoggingIn = ref(false)
const showPassword = ref(false)
const dialogProps = reactive({
    show: false,
    title: '',
    text: '',
})
const form = reactive({
    email: '',
    password: '',
})

async function Submit() {
    if (!auth) return
    if (isLoggingIn.value) return

    isLoggingIn.value = true

    const { data, error } = await auth.signInWithPassword({
        email: form.email,
        password: form.password,
    })

    if (error) {
        isLoggingIn.value = false

        return
    }

    if (!data.user) {
        isLoggingIn.value = false
        return
    }

    if (!route.query.redirect) return router.push('/dashboard')

    router.replace(decodeURIComponent(route.query.redirect as string))
}

onBeforeMount(() => {
    if (!route.query.dialog) return

    const dialog = JSON.parse(route.query.dialog as string)

    dialogProps.show = true
    dialogProps.text = dialog.text
    dialogProps.title = dialog.title

    router.replace('/login')
})

definePageMeta({
    layout: 'auth',
})
</script>

<template>
    <h2>Login</h2>

    <div class="text-sm">
        Don't have an account?

        <nuxt-link to="/register">Register</nuxt-link>
    </div>

    <br />

    <a-form layout="vertical" :model="form" :rules="Rules" @finish="Submit">
        <a-form-item label="Email" name="email">
            <a-input v-model:value="form.email" placeholder="you@example.com" />
        </a-form-item>

        <a-form-item label="Password" name="password">
            <a-input v-model:value="form.password" type="password" />
        </a-form-item>

        <br />

        <a-button
            type="primary"
            block
            :loading="isLoggingIn"
            html-type="submit"
        >
            Log in
        </a-button>
    </a-form>

    <a-modal
        v-model:visible="dialogProps.show"
        :title="dialogProps.title"
        :closable="false"
        :footer="false"
        :centered="true"
        cancelText="Alright"
    >
        <p>{{ dialogProps.text }}</p>

        <br />

        <a-button @click="dialogProps.show = false"> Okay</a-button>
    </a-modal>
</template>
