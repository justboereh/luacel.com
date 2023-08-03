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
import type {
    QueryResponse,
    DataResult,
    ResultsResponse,
    ResultsInvocation,
} from '#types/insights'
import uniqolor from 'uniqolor'
import dayjs from 'dayjs'
import { Card } from 'ant-design-vue'
import { watchDebounced } from '@vueuse/core'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

dayjs.extend(tz)
dayjs.extend(utc)

// prettier-ignore
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement, TimeScale)

const ChartOptions = ref({
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
        x: {
            ticks: {
                callback(v: any) {
                    console.log(v)

                    return v
                },
            },
        },
    },
})

type AppRef = globalThis.Ref<App | undefined>

const route = useRoute()
const timerange = ref('Last 3 hours')
const logs = ref<ResultsResponse[]>([])
const retries = ref(0)
const hasFailed = ref(false)
const isGettingLogs = ref(false)
const disableGetLogs = ref(true)
const toGetResults = ref<QueryResponse[]>()

type ChartitArgs = {
    value: (invocation: ResultsInvocation, data: number) => number
}

function Chartit({ value }: ChartitArgs) {
    return {
        datasets: logs.value.map((func) => {
            const color = uniqolor(func.name, {
                lightness: [30, 50],
            }).color

            type Data = {
                x: number
                y: number
            }

            const dataset = {
                label: func.name,
                borderColor: color,
                backgroundColor: color,
                data: [] as Data[],
            }

            if (!func.invocations) return dataset

            const data: Record<number, number> = {}

            for (const invocation of func.invocations) {
                const stamp = dayjs.utc(invocation.timestamp).valueOf()

                data[stamp] = value(invocation, data[stamp])
            }

            console.log(data)

            dataset.data = Object.keys(data).map((timestamp) => {
                return {
                    x: Number(timestamp),
                    y: Math.floor(data[Number(timestamp)] * 100) / 100,
                }
            })

            return dataset
        }),
    }
}

const invocationsCount = computed(() => {
    let result = 0

    for (const { invocations } of logs.value) {
        if (!invocations) continue

        result += invocations.length
    }

    return result
})

const invocationsChart = computed(() => {
    return Chartit({
        value: (_, data) => (data ? data + 1 : 1),
    })
})

const averageDuration = computed(() => {
    let result: number | null = null

    for (const { invocations } of logs.value) {
        if (!invocations) continue

        for (const { duration } of invocations) {
            if (!result) {
                result = Number(duration)

                continue
            }

            result = (result + Number(duration)) / 2
        }
    }

    return Math.floor((result || 0) * 100) / 100
})

const durationChart = computed(() => {
    return Chartit({
        value: ({ duration }, data) => {
            if (!data) return Number(duration)

            return (data + Number(duration)) / 2
        },
    })
})

const averageMemory = computed(() => {
    let result: number | null = null

    for (const { invocations } of logs.value) {
        if (!invocations) continue

        for (const { memory } of invocations) {
            if (!result) {
                result = Number(memory)

                continue
            }

            result = (result + Number(memory)) / 2
        }
    }

    return Math.floor((result || 0) * 100) / 100
})

const errorsCount = computed(() => {
    let result = 0

    return result
})

async function GetResults() {
    if (!process.client || !toGetResults.value || toGetResults.value.length < 1)
        return (isGettingLogs.value = false)
    if (retries.value >= 10) return (hasFailed.value = true)
    retries.value += 1

    const toRetry: QueryResponse[] = []

    for (const body of toGetResults.value) {
        const { data } = await useFetch<ResultsResponse>(
            () => `/api/apps/${route.params.appid}/insights/results`,
            { method: 'POST', body }
        )

        if (!data.value || !data.value.invocations) {
            toRetry.push(body)

            continue
        }

        logs.value.push(data.value)
    }

    setTimeout(() => {
        toGetResults.value = toRetry
    }, 2000)
}

async function QueryLogs() {
    if (!route.params.appid) return
    if (isGettingLogs.value) return
    isGettingLogs.value = true
    logs.value = []

    const { data } = await useFetch<QueryResponse[]>(
        () => `/api/apps/${route.params.appid}/insights/query`,
        { method: 'POST' }
    )

    if (!data.value) return (hasFailed.value = true)

    toGetResults.value = data.value
}

watchDebounced(toGetResults, GetResults, { debounce: 500, immediate: true })

watch(route, QueryLogs, { immediate: true })
definePageMeta({
    layout: 'app',
})
</script>

<template>
    <div class="p-4 sm:px-8">
        <div class="max-w-5xl mx-auto space-y-4">
            <a-row justify="end" :gutter="[8]">
                <a-col>
                    <a-button :disabled="isGettingLogs" @click="QueryLogs">
                        <template #icon>
                            <icon
                                name="fluent:arrow-counterclockwise-16-regular"
                                :style="
                                    isGettingLogs
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
                <insights-stat
                    name="Invocations"
                    :value="invocationsCount"
                    :loading="isGettingLogs"
                />

                <insights-stat name="Errors" :loading="isGettingLogs">
                    <span class="text-red text-2xl">
                        {{ errorsCount }}
                    </span>
                </insights-stat>

                <insights-stat
                    name="Average Duration"
                    :value="averageDuration + ' ms'"
                    :loading="isGettingLogs"
                />

                <insights-stat
                    name="Average Memory"
                    :value="averageMemory + ' MB'"
                    :loading="isGettingLogs"
                />

                <insights-stat
                    name="Invocations (UTC)"
                    tooltip="The count of invocations per minute for the last 3 hours, with only the minutes with invocations showing"
                    class="col-span-2 row-span-2"
                    :loading="isGettingLogs"
                >
                    <Line :options="ChartOptions" :data="invocationsChart" />
                </insights-stat>

                <insights-stat
                    name="Average Durations (UTC)"
                    tooltip="The sum of durations for every invocation of every minute for the last 3 hours, with only the minutes with invocations showing"
                    class="col-span-2 row-span-2"
                    :loading="isGettingLogs"
                >
                    <Line :options="ChartOptions" :data="durationChart" />
                </insights-stat>
            </div>
        </div>
    </div>
</template>
