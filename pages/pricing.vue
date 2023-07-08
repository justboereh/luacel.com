<script setup lang="ts">
import { Icon } from '#components'

const PricingColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Description',
        dataIndex: 'desc',
        key: 'desc',
    },
    {
        title: 'Pricing',
        dataIndex: 'pricing',
        key: 'pricing',
    },
    {
        title: 'Unit',
        dataIndex: 'unit',
        key: 'unit',
    },
]

const PricingData = [
    {
        name: 'Functions',
        desc: 'Number of functions your app has',
        pricing: '$0.015',
        unit: '100 functions',
    },
    {
        name: 'Function Request Units',
        desc: 'Number of HTTP request to your app functions',
        pricing: '$0.109',
        unit: '100K requests',
    },
    {
        name: 'Function Duration',
        desc: 'The total amount of time your app functions took to run',
        pricing: '$0.024',
        unit: '100K seconds',
    },
    {
        name: 'Database Storage',
        desc: 'Amount of data is stored in your database',
        pricing: '$0.067',
        unit: '100K bytes',
    },
    {
        name: 'Database Reads',
        desc: 'The number of times your function reads the database',
        pricing: '$0.035',
        unit: '100K reads',
    },
    {
        name: 'Database Write',
        desc: 'The number of times your function writes to the database',
        pricing: '$0.035',
        unit: '100K writes',
    },
]

const Plans = [
    {
        title: 'Starter',
        price: '0.99',
        features: [
            '50 functions',
            '10K requests per day',
            '10s wall time per request',
            '500MB of data stored per month',
            '100k database reads per day',
            '100k database writes per day',
            'Custom subdomain',
        ],
    },
    {
        title: 'Pro',
        price: '19.99',
        features: [
            '300 functions',
            '100K requests per day',
            '30s wall time per request',
            '10GB of data stored per month',
            '1M database reads per day',
            '1M database writes per day',
            'Custom subdomain',
            'Custom domain',
            'Email support',
        ],
    },
    {
        title: 'Team',
        price: '49.99',
        features: [
            '1500 functions',
            '1M requests per day',
            '5m wall time per request',
            '50GB of data stored per month',
            '50M database reads per day',
            '50M database writes per day',
            'Custom subdomain',
            'Custom domain',
            'Email support',
            'Chat support',
        ],
    },
    {
        title: 'Business',
        price: '124.99',
        features: [
            '10K functions',
            '100M requests per day',
            '15m wall time per request',
            '175GB of data stored per month',
            '100M database reads per day',
            '100M database writes per day',
            'Custom subdomain',
            'Custom domain',
            'Email support',
            'Chat support',
            'Call support',
        ],
    },
]

useHead({
    title: 'Pricing : Luacel',
})
</script>

<template>
    <div class="p-4">
        <div class="max-w-5xl mx-auto">
            <h1 class="text-5xl text-center mb-12 pt-8">Pricing</h1>

            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <a-card v-for="plan of Plans" :title="plan.title">
                    <template #extra>
                        <div class="flex flex-col items-center">
                            <span class="text-xl">${{ plan.price }}</span>
                            <span class="text-sm text-white/50">/ month</span>
                        </div>
                    </template>

                    <div class="flex flex-col gap-2">
                        <span
                            v-for="feature of plan.features"
                            class="flex items-start gap-2"
                        >
                            <span
                                class="h-5 w-5 min-w-5 grid place-items-center"
                            >
                                <icon name="fluent:checkmark-20-regular" />
                            </span>

                            <span>{{ feature }}</span>
                        </span>
                    </div>
                </a-card>
            </div>

            <br />
            <br />
            <br />

            <p>
                The table below is for additional usage beyond the limits of
                each plan.
            </p>

            <a-table
                size="small"
                :dataSource="PricingData"
                :columns="PricingColumns"
                :pagination="false"
            >
            </a-table>
        </div>
    </div>
</template>
