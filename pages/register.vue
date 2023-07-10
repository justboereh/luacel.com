<script setup lang="ts">
import { Rules } from '#rules/user'

const isRegistering = ref(false)
const showPassword = ref(false)
const dialogProps = reactive({
    show: false,
    title: '',
    text: '',
})
const form = reactive({
    name: '',
    email: '',
    password: '',
    confirm: '',
})

Rules.confirm = [
    {
        required: true,
        trigger: 'change',
        async validator(_, value: string) {
            if (!value) return Promise.reject('Required')
            if (value !== form.password) return Promise.reject('Does not match')

            return Promise.resolve()
        },
    },
]

async function Submit() {
    isRegistering.value = true

    const { error } = await useFetch('/api/account/register', {
        method: 'POST',
        body: {
            email: form.email,
            password: form.password,
            name: form.name,
        },
    })

    if (error.value) {
        dialogProps.title = 'Register Error!'
        // prettier-ignore
        dialogProps.text = 'Seems like something went wrong. Double check and try again.'
        dialogProps.show = true

        isRegistering.value = false

        return
    }

    const dialog = JSON.stringify({
        title: 'Email Verification',
        text: 'We sent you an email to verify your account. You will not be able to log in without verifying.',
    })

    useRouter().push('/login')
}

definePageMeta({
    layout: 'auth',
})
</script>

<template>
    <h2>Login</h2>

    <div class="text-sm">
        Already have an account?

        <nuxt-link to="/login">Login</nuxt-link>
    </div>

    <br />

    <a-form layout="vertical" :model="form" :rules="Rules" @finish="Submit">
        <a-form-item has-feedback label="Name" name="name">
            <a-input v-model:value="form.name" />
        </a-form-item>

        <a-form-item has-feedback label="Email" name="email">
            <a-input v-model:value="form.email" placeholder="you@example.com" />
        </a-form-item>

        <a-form-item has-feedback label="Password" name="password">
            <a-input v-model:value="form.password" type="password" />
        </a-form-item>

        <a-form-item has-feedback label="Confirm password" name="confirm">
            <a-input v-model:value="form.confirm" type="password" />
        </a-form-item>

        <br />

        <a-button
            type="primary"
            block
            :loading="isRegistering"
            html-type="submit"
        >
            Register
        </a-button>
    </a-form>

    <a-modal
        v-model:visible="dialogProps.show"
        :title="dialogProps.title"
        :closable="false"
        :footer="false"
        :centered="true"
    >
        <p>{{ dialogProps.text }}</p>

        <br />

        <a-button @click="dialogProps.show = false"> Okay</a-button>
    </a-modal>
</template>
