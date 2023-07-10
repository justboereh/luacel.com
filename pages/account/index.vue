<script setup lang="ts">
import { usePrevious } from '@vueuse/core'
import { Rules } from '#rules/user'

const auth = useSupabaseAuthClient().auth
const user = useSupabaseUser()

const form = reactive({
    name: user.value?.user_metadata.name || '',
    email: user.value?.email || '',
    ccnumber: user.value?.user_metadata.ccn || '',
})

async function SignOut() {
    await auth.signOut()

    useRouter().replace('/login?redirect=/account')
}

async function NewName() {
    const validator = Rules.name[0].validator

    if (!validator) return

    try {
        await validator({}, form.name.trim(), () => {})

        auth.updateUser({
            data: {
                ...user.value?.user_metadata,
                name: form.name.trim(),
            },
        })
    } catch (error) {}
}

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
                <a-form layout="vertical">
                    <a-form-item label="Name">
                        <a-input
                            class="w-full"
                            v-model:value="form.name"
                            @change="NewName"
                        />
                    </a-form-item>

                    <a-form-item label="Email">
                        <a-input
                            html-type="email"
                            v-model:value="form.email"
                            :disabled="true"
                        />
                    </a-form-item>

                    <a-form-item label="Password">
                        <a-input html-type="password" :disabled="true" />
                    </a-form-item>
                </a-form>
            </a-card>

            <a-card title="Billing" size="small">
                <a-form layout="vertical">
                    <a-form-item label="Number">
                        <a-input
                            class="w-full"
                            v-model:value="form.ccnumber"
                            @change="NewName"
                        />
                    </a-form-item>

                    <a-row flex="auto" :gutter="[16]">
                        <a-col flex="auto">
                            <a-form-item label="Expiration Date">
                                <a-input
                                    html-type="email"
                                    :value="form.ccnumber ? '**/**' : ''"
                                    :disabled="true"
                                />
                            </a-form-item>
                        </a-col>

                        <a-col flex="auto">
                            <a-form-item label="CCV">
                                <a-input
                                    html-type="number"
                                    :value="form.ccnumber ? '***' : ''"
                                    :disabled="true"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>


                    <a-button type="primary" :disabled="true">Save</a-button>
                </a-form>
            </a-card>
        </div>

        <div class="max-w-5xl mx-auto py-4">
            <a-button type="text" danger @click="SignOut">Log Out</a-button>
        </div>
    </div>
</template>
