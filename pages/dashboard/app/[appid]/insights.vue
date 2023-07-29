<script setup lang="ts">
import { Bar, Line } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
} from 'chart.js'

import { App } from '#types/app'
import type { DataResult } from '#types/insights'
import dayjs from 'dayjs'
import { Card } from 'ant-design-vue'

// prettier-ignore
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement)

type AppRef = globalThis.Ref<App | undefined>

const route = useRoute()
const app = useState<App>('useStateApp')
const timerange = ref('Last 3 hours')
const metrics = ref<DataResult[]>([])
const isGettingMetrics = ref(false)

const invocationsCount = computed(() => {
    if (!metrics.value) return 0

    return (
        metrics.value.reduce((a: number, func) => {
            const values = Object.values(func.invocations)
            const value = values.reduce((ac, cu) => ac + cu, 0)

            return a + (value ? value : 0)
        }, 0) || 0
    )
})

const invocationsChart = computed(() => {
    const result = { datasets: [] as any[] }

    if (!metrics.value) return result

    metrics.value.every((func) => {
        result.datasets.push({
            label: func.name,
            data: func.invocations,
        })
    })

    return result
})

const averageDuration = computed(() => {
    if (!metrics.value) return 0

    const v = metrics.value.reduce((a: number, func) => {
        const values = Object.values(func.duration)
        const firstvalue = values[0] || 0
        const value = values.reduce(
            (ac: number, cu) => (ac + cu) / 2,
            firstvalue
        )

        return (a + (value ? value : 0)) / 2
    }, 0)

    return v || 0
})

const averageMemory = computed(() => {
    if (!metrics.value) return 0

    const v = metrics.value.reduce((a: number, { memory }) => {
        const value = memory.reduce(
            (ac: number, cu) => (ac + Number(cu[1].value)) / 2,
            0
        )

        return (a + (value ? value : 0)) / 2
    }, 0)

    return v || 0
})

const errorsCount = computed(() => {
    if (!metrics.value) return 0

    return metrics.value.reduce((a: number, func) => {
        const values = Object.values(func.errors)
        const value = values.reduce((ac, cu) => ac + cu, 0)

        return a + (value ? value : 0)
    }, 0)
})

async function GetMetrics() {
    if (!route.params.appid) return
    if (isGettingMetrics.value) return
    isGettingMetrics.value = true

    const { data } = await useFetch<DataResult[]>(
        () => `/api/apps/${route.params.appid}/insights`,
        {
            method: 'POST',
        }
    )

    isGettingMetrics.value = false

    if (!data.value) return

    metrics.value = data.value
}

watch(route, GetMetrics, { immediate: true })
definePageMeta({
    layout: 'app',
})
</script>

<template>
    <div class="p-4 sm:px-8">
        <div class="max-w-5xl mx-auto space-y-4">
            <a-row justify="end" :gutter="[16]">
                <a-col>
                    <a-button :disabled="isGettingMetrics" @click="GetMetrics">
                        <template #icon>
                            <icon
                                name="fluent:arrow-counterclockwise-16-regular"
                                :style="
                                    isGettingMetrics
                                        ? 'animation: spin 0.5s linear infinite;'
                                        : ''
                                "
                            />
                        </template>
                    </a-button>
                </a-col>

                <a-col>
                    <ClientOnly>
                        <a-select v-model:value="timerange">
                            <a-select-option value="Last 3 hours">
                                Last 3 hours
                            </a-select-option>
                        </a-select>
                    </ClientOnly>
                </a-col>
            </a-row>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <insights-stat name="Invocations" :value="invocationsCount" />

                <insights-stat name="Error">
                    <span class="text-red text-2xl">
                        {{ errorsCount }}
                    </span>
                </insights-stat>

                <insights-stat
                    name="Average Duration"
                    :value="averageDuration + ' sec'"
                />

                <insights-stat
                    name="Average Memory Usage"
                    :value="averageMemory + ' MB'"
                />

                <insights-stat name="Invocations" class="col-span-2 row-span-2">
                    <Line
                        :options="{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                        }"
                        :data="invocationsChart"
                    />
                </insights-stat>

                <insights-stat name="Duration" class="col-span-2 row-span-2">
                    <Line
                        :options="{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                        }"
                        :data="invocationsChart"
                    />
                </insights-stat>
            </div>
        </div>
    </div>
</template>
