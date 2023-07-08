<script setup lang="ts">
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
} from '@firebase/auth'
import { useFirebaseAuth } from 'vuefire'
import { Rules, RulesT } from '../assets/scripts/user-creds-validate'

const isFormValid = ref(false)
const isRegistering = ref(false)
const isInvalidCred = ref(false)
const showPassword = ref(false)
const auth = useFirebaseAuth()

const form = reactive({
    name: '',
    email: '',
    password: '',
    confirm: '',
})

const rules: RulesT = {
    ...Rules,
    confirm: [
        (v: string) => !!v || 'Required',
        (v: string) => v === form.password || 'Does not match',
    ],
}

async function Submit() {
    if (!isFormValid.value) return
    if (!auth) return

    isRegistering.value = true

    try {
        const { user } = await createUserWithEmailAndPassword(
            auth,
            form.email,
            form.password
        )

        await sendEmailVerification(user)

        await updateProfile(user, {
            displayName: form.name,
        })

        const dialog = JSON.stringify({
            title: 'Email Verification',
            text: 'We sent you an email to verify your account. You will not be able to log in without verifying.',
        })

        useRouter().push('/login?dialog=' + encodeURIComponent(dialog))
    } catch (error) {}
}

definePageMeta({
    layout: 'auth',
})
</script>

<template>
    <h2>Login</h2>

    <div class="text-sm">
        Have an account?

        <nuxt-link to="/login">login</nuxt-link>
    </div>

    <br />
    <br />

    <v-form v-model="isFormValid" class="space-y-2 w-full" @submit.prevent>
        <v-text-field
            v-model="form.name"
            :rules="rules.name"
            label="Name"
            variant="outlined"
            density="compact"
            required
        />

        <v-text-field
            v-model="form.email"
            :rules="rules.email"
            label="Email"
            type="email"
            variant="outlined"
            density="compact"
            required
        />

        <v-text-field
            v-model="form.password"
            :rules="rules.password"
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="
                showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
            "
            label="Password"
            variant="outlined"
            density="compact"
            required
            @click:append-inner="showPassword = !showPassword"
        />

        <v-text-field
            v-model="form.confirm"
            :rules="rules.confirm"
            :type="showPassword ? 'text' : 'password'"
            label="Confirm password"
            variant="outlined"
            density="compact"
            :append-inner-icon="
                showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
            "
            required
            @click:append-inner="showPassword = !showPassword"
        />

        <br />

        <a-button
            variant="flat"
            color="blue"
            class="px-4"
            block
            :loading="isRegistering"
            :disabled="!isFormValid || isRegistering"
            @click="Submit"
        >
            Sign up
        </a-button>
    </v-form>
</template>
