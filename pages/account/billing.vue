<script setup lang="ts">
const Rules = {
    number: [
        {
            required: true,
            trigger: 'change',
            validator(_: any, value: string) {
                if (!value) return Promise.reject('')
                if (value.length < 16) return Promise.reject('Invalid number')
                if (/[\D]+/.test(value)) return Promise.reject('Invalid number')

                return Promise.resolve()
            },
        },
    ],
    expiration: [
        {
            required: true,
            trigger: 'change',
            validator(_: any, value: string) {
                if (!value) return Promise.reject('')
                if (value.length < 4)
                    return Promise.reject('Invalid expiration')
                if (/[\D]+/.test(value))
                    return Promise.reject('Invalid expiration')

                return Promise.resolve()
            },
        },
    ],
    ccv: [
        {
            required: true,
            trigger: 'change',
            validator(_: any, value: string) {
                if (!value) return Promise.reject('')
                if (value.length < 3) return Promise.reject('Invalid ccv')
                if (/[\D]+/.test(value)) return Promise.reject('Invalid ccv')

                return Promise.resolve()
            },
        },
    ],
}
const emptyForm = {
    number: '',
    expiration: '',
    ccv: '',
}
const form = reactive(emptyForm)

async function UpdateCard() {
    Object.assign(form, emptyForm)
}

definePageMeta({
    layout: 'account',
})
</script>

<template>
    <div class="p-4">
        <div class="max-w-5xl mx-auto">
            <h1>Billing</h1>

            <p>
                Credit card details so I know how much to steal.

                <br />

                <span class="text-xs text-black/50">
                    * Please don't actually enter any sensitive information
                </span>
            </p>

            <a-form
                layout="vertical"
            autocomplete="off"
                :model="form"
                :rules="Rules"
                @finish="UpdateCard"
            >
                <a-form-item label="Card Number" name="number" class="max-w-sm">
                    <a-input-number
                        :formatter="(v:string) => v"
                        :controls="false"
                        style="width: 100%"
                        placeholder="0000 0000 0000 0000"
                    />
                </a-form-item>

                <a-row :gutter="16" class="max-w-sm">
                    <a-col :span="12">
                        <a-form-item label="Expiration" name="expiration">
                            <a-input-number
                                :formatter="(v:string) => v"
                                :controls="false"
                                style="width: 100%"
                                placeholder="00/00"
                            />
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item label="CCV" name="ccv">
                            <a-input-number
                                :controls="false"
                                style="width: 100%"
                                placeholder="000"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-space>
                    <a-button type="primary">Update</a-button>

                    <a-tooltip>
                        <template #title>
                            Button does NOT do anything except clear the inputs
                        </template>

                        <a-button size="small" type="text">
                            <template #icon>
                                <icon name="fluent:info-20-regular" />
                            </template>
                        </a-button>
                    </a-tooltip>
                </a-space>
            </a-form>
        </div>
    </div>
</template>
