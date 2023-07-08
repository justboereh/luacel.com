<script setup lang="ts">
import {
    sendEmailVerification,
    updateEmail,
    updatePassword,
} from '@firebase/auth'
import { usePrevious } from '@vueuse/core'
import { updateCurrentUserProfile } from 'vuefire'
import { Rules } from '../../assets/scripts/user-creds-validate'

const user = useCurrentUser()
const showPassword = ref(false)
const editEmail = ref(false)
const isValid = reactive({
    name: false,
    email: false,
    password: false,
    confirm: false,
})

const showDialogs = reactive({
    displayName: false,
    email: false,
    password: false,
})
const form = reactive({
    name: user.value?.displayName || '',
    email: user.value?.email || '',
    password: '',
    confirm: '',
})
const prevEmail = usePrevious(toRef(form, 'email'))

const rules = {
    ...Rules,
    confirm: [(v: string) => v === form.password || 'Does not match'],
}

function SubmitDisplayName() {
    if (!user.value) return
    if (!isValid.name) return

    showDialogs.displayName = false

    updateCurrentUserProfile({ displayName: form.name })
}

function SubmitNewEmail() {
    if (!user.value) return
    if (!isValid.email) return

    showDialogs.email = false

    updateEmail(user.value, form.email)
}

function VerifyEmail() {
    if (!user.value) return

    sendEmailVerification(user.value)
}

async function UpdatePassword() {
    if (!user.value) return
    if (!isValid.password) return
    if (!isValid.confirm) return

    showDialogs.password = false

    updatePassword(user.value, form.password)

    form.password = ''
    form.confirm = ''
}

function AccountItem({ label }: { label: string }, { slots }: { slots: any }) {
    const td = h('td', { class: 'flex-grow' }, slots)

    return h('tr', { class: '' }, [h('td', { class: 'pr-4' }, label), td])
}

async function SignOut() {
    await useFirebaseAuth()?.signOut()

    useRouter().replace('/login?redirect=/account')
}

watch(toRef(showDialogs, 'email'), () => {
    if (!user.value) return (form.email = '')

    form.email = user.value?.email || ''
})

watch(toRef(showDialogs, 'password'), () => {
    form.password = ''
    form.confirm = ''
})

definePageMeta({
    layout: 'dashboard',
})
useHead({ title: 'Account : Luacel' })
</script>

<template>
    <a-divider style="margin: 0" />

    <div class="p-4">
        <div class="max-w-5xl mx-auto grid lg:grid-cols-2 gap-4">
            <a-card title="Account" size="small">
                <template #extra>
                    <a-button type="primary" :disabled="true">Save</a-button>
                </template>

                <a-form>
                    <a-form-item label="Name">
                        <a-input class="w-full" v-model:value="form.name" />
                    </a-form-item>

                    <a-form-item label="Email">
                        <div class="flex">
                            <a-input
                                html-type="email"
                                v-model:value="form.email"
                                :bordered="editEmail"
                                :disabled="!editEmail"
                            />

                            <a-button
                                v-if="!editEmail"
                                type="link"
                                @click="editEmail = true"
                            >
                                Edit
                            </a-button>

                            <a-button
                                v-if="
                                    editEmail &&
                                    (prevEmail === form.email || !prevEmail)
                                "
                                type="text"
                                danger
                                @click="editEmail = false"
                            >
                                Cancel
                            </a-button>

                            <a-button
                                v-if="
                                    editEmail &&
                                    prevEmail &&
                                    prevEmail !== form.email
                                "
                                type="text"
                                @click=""
                            >
                                Save
                            </a-button>
                        </div>
                    </a-form-item>

                    <a-form-item label="Name">
                        <a-input v-model:value="form.name" />
                    </a-form-item>
                </a-form>
            </a-card>

            <a-button type="text" danger @click="SignOut">Log Out</a-button>
        </div>
    </div>
</template>
