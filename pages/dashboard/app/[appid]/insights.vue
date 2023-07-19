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

const app = inject<AppRef>('useApp')
const timerange = ref('Last 3 hours')
const metrics = ref<DataResult[]>([])
const isGettingMetrics = ref(false)

const invocationsCount = computed(() => {
    if (!metrics.value) return 0

    return metrics.value.reduce((a: number, func) => {
        const value = func.invocations?.values.reduce((ac, cu) => ac + cu, 0)

        return a + (value ? value : 0)
    }, 0)
})

const invocationsChart = computed(() => {
    const result = { datasets: [] as any[] }

    if (!metrics.value) return result

    metrics.value.every((func) => {
        const data = func.invocations?.timestamps.map((timestamp, index) => ({
            x: dayjs(timestamp).format('h:m a'),
            y: func.invocations?.values[index],
        }))

        result.datasets.push({
            label: func.name,
            data,
        })
    })

    return result
})

const totalDuration = computed(() => {
    if (!metrics.value) return 0

    const v = metrics.value.reduce((a: number, func) => {
        const value = func.duration?.values.reduce((ac, cu) => ac + cu, 0)

        return a + (value ? value : 0)
    }, 0)

    return Math.floor(v / 10) / 100
})

const averageDuration = computed(() => {
    if (!metrics.value) return 0

    const v = metrics.value.reduce((a: number, func) => {
        const firstvalue = func.duration?.values[0] || 0
        const value = func.duration?.values.reduce(
            (ac: number, cu) => (ac + cu) / 2,
            firstvalue
        )

        return (a + (value ? value : 0)) / 2
    }, 0)

    return (totalDuration.value / invocationsCount.value).toFixed(2) || 0
})

const errorsCount = computed(() => {
    if (!metrics.value) return 0

    return metrics.value.reduce((a: number, func) => {
        const value = func.errors?.values.reduce((ac, cu) => ac + cu, 0)

        return a + (value ? value : 0)
    }, 0)
})

async function GetMetrics() {
    if (isGettingMetrics.value) return
    isGettingMetrics.value = true

    const { data } = await useFetch<DataResult[]>('/api/insights', {
        method: 'POST',
        body: {
            id: app?.value?.id,
        },
    })

    isGettingMetrics.value = false

    if (!data.value) return

    metrics.value = data.value
}

function Stat(props: any, { slots }: { slots: any }) {
    let value = props.value
        ? h('p', { class: 'text-2xl' }, props.value)
        : slots.default()

    return h(Card, { ...props }, [
        h('p', { class: 'text-sm text-dark-800/50' }, props.name),
        value,
    ])
}

GetMetrics()
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
                    <a-select v-model:value="timerange">
                        <a-select-option value="Last 3 hours">
                            Last 3 hours
                        </a-select-option>
                    </a-select>
                </a-col>
            </a-row>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <insights-stat
                    name="Invocations Count"
                    :value="invocationsCount"
                />

                <insights-stat name="Error">
                    <span class="text-red text-2xl">
                        {{ errorsCount }}
                    </span>
                </insights-stat>

                <insights-stat
                    name="Total Duration"
                    :value="totalDuration + ' sec'"
                />

                <insights-stat
                    name="Average Duration"
                    :value="averageDuration + ' sec'"
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
