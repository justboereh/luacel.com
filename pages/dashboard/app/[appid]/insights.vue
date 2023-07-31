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
    TimeScale,
} from 'chart.js'

import { App } from '#types/app'
import type { DataResult } from '#types/insights'
import uniqolor from 'uniqolor'
import dayjs from 'dayjs'
import { Card } from 'ant-design-vue'

// prettier-ignore
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement, TimeScale)

type AppRef = globalThis.Ref<App | undefined>

const route = useRoute()
const app = useState<App>('useStateApp')
const timerange = ref('Last 3 hours')
const metrics = ref<DataResult[]>([])
const isGettingMetrics = ref(false)

const invocationsCount = computed(() => {
    if (!metrics.value) return 0

    let result = 0

    for (const { invocations } of metrics.value) {
        for (const { value } of invocations) {
            result += value
        }
    }

    return result
})

const invocationsChart = computed(() => {
    const result = { datasets: [] as any[] }

    if (!metrics.value) return result

    result.datasets = metrics.value.map((func) => {
        const color = uniqolor(func.name, {
            lightness: [30, 50],
        }).color

        return {
            label: func.name,
            borderColor: color,
            backgroundColor: color,
            data: func.invocations
                .map(({ timestamp, value }) => ({
                    x: dayjs(timestamp).format('h:mm a'),
                    y: value,
                }))
                .reverse(),
        }
    })

    return result
})

const averageDuration = computed(() => {
    if (!metrics.value) return 0

    let result: number | null = null

    for (const { duration } of metrics.value) {
        for (const { value } of duration) {
            if (!result) {
                result = value

                continue
            }

            result = (result + value) / 2
        }
    }

    return Math.floor((result || 0) * 100) / 100
})

const durationChart = computed(() => {
    const result = { datasets: [] as any[] }

    if (!metrics.value) return result

    result.datasets = metrics.value.map((func) => {
        const color = uniqolor(func.name, {
            lightness: [30, 50],
        }).color

        return {
            borderColor: color,
            backgroundColor: color,
            label: func.name,
            data: func.duration
                .map(({ timestamp, value }) => ({
                    x: dayjs(timestamp).format('h:mm a'),
                    y: value,
                }))
                .reverse(),
        }
    })

    return result
})

const averageMemory = computed(() => {
    if (!metrics.value) return 0

    let result: number | null = null

    for (const { memory } of metrics.value) {
        for (const [_, { value }] of memory) {
            if (!result) {
                result = Number(value)

                continue
            }

            result = (result + Number(value)) / 2
        }
    }

    return Math.floor((result || 0) * 100) / 100
})

const errorsCount = computed(() => {
    if (!metrics.value) return 0

    let result = 0

    for (const { errors } of metrics.value) {
        for (const { value } of errors) {
            result += value
        }
    }

    return result
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
            <a-row justify="end" :gutter="[8]">
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

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <insights-stat name="Invocations" :value="invocationsCount" />

                <insights-stat name="Errors">
                    <span class="text-red text-2xl">
                        {{ errorsCount }}
                    </span>
                </insights-stat>

                <insights-stat
                    name="Average Durations"
                    :value="averageDuration + ' ms'"
                />

                <insights-stat
                    name="Average Memory"
                    :value="averageMemory + ' MB'"
                />

                <insights-stat
                    name="Invocations"
                    tooltip="The count of invocations of every minute for the last 3 hours with only the minutes with invocations showing."
                    class="col-span-2 row-span-2"
                >
                    <Line
                        :options="{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                            scales: {
                                y: {
                                    min: 0,
                                },
                            },
                        }"
                        :data="invocationsChart"
                    />
                </insights-stat>

                <insights-stat
                    name="Average Durations"
                    tooltip="The sum of durations for every invocation of every minute for the last 3 hours with only the minutes with invocations showing."
                    class="col-span-2 row-span-2"
                >
                    <Line
                        :options="{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                            scales: {
                                y: {
                                    min: 0,
                                },
                            },
                        }"
                        :data="durationChart"
                    />
                </insights-stat>
            </div>
        </div>
    </div>
</template>
