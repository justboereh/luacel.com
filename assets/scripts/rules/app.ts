import type { Rule } from 'ant-design-vue/es/form'

export type RegionItem = {
    title: string
    value: string
}

export const Regions: RegionItem[] = [
    { title: 'US East (N. Virginia)', value: 'us-east-1' },
    { title: 'US East (Ohio)', value: 'us-east-2' },
    { title: 'US West (Northern California)', value: 'us-west-1' },
    { title: 'US West (Oregon)', value: 'us-west-2' },
    { title: 'Africa (Cape Town)', value: 'af-south-1' },
    { title: 'Asia Pacific (Hong Kong)', value: 'ap-east-1' },
    { title: 'Asia Pacific (Hyderabad)', value: 'ap-south-2' },
    { title: 'Asia Pacific (Jakarta)', value: 'ap-southeast-3' },
    { title: 'Asia Pacific (Melbourne)', value: 'ap-southeast-4' },
    { title: 'Asia Pacific (Mumbai)', value: 'ap-south-1' },
    { title: 'Asia Pacific (Osaka)', value: 'ap-northeast-3' },
    { title: 'Asia Pacific (Seoul)', value: 'ap-northeast-2' },
    { title: 'Asia Pacific (Singapore)', value: 'ap-southeast-1' },
    { title: 'Asia Pacific (Sydney)', value: 'ap-southeast-2' },
    { title: 'Asia Pacific (Tokyo)', value: 'ap-northeast-1' },
    { title: 'Canada (Central)', value: 'ca-central-1' },
    { title: 'Europe (Frankfurt)', value: 'eu-central-1' },
    { title: 'Europe (Ireland)', value: 'eu-west-1' },
    { title: 'Europe (London)', value: 'eu-west-2' },
    { title: 'Europe (Milan)', value: 'eu-south-1' },
    { title: 'Europe (Paris)', value: 'eu-west-3' },
    { title: 'Europe (Spain)', value: 'eu-south-2' },
    { title: 'Europe (Stockholm)', value: 'eu-north-1' },
    { title: 'Europe (Zurich)', value: 'eu-central-2' },
    { title: 'Middle East (Bahrain)', value: 'me-south-1' },
    { title: 'Middle East (UAE)', value: 'me-central-1' },
    { title: 'South America (Sao Paulo)', value: 'sa-east-1' },
]

export const Rules: Record<string, Rule[]> = {
    name: [
        {
            required: true,
            trigger: 'change',
            async validator(_rule: any, v: string) {
                if (!v) return Promise.reject('Required')
                if (v.length < 3) return Promise.reject('Min. 3 characters')

                return Promise.resolve()
            },
        },
    ],
    memory: [
        {
            required: true,
            trigger: 'change',
            async validator(_rule: any, v: string) {
                if (!v) return Promise.reject('Required')

                if (!Number(v)) return Promise.reject('Invalid Memory')
                if (Number(v) < 128) return Promise.reject('Min. 128 MB')
                if (Number(v) > 10240) return Promise.reject('Max. 10,240 MB')

                return Promise.resolve()
            },
        },
    ],
    timeout: [
        {
            required: true,
            trigger: 'change',
            async validator(_rule: any, v: string) {
                if (!v) return Promise.reject('Required')
                if (!Number(v)) return Promise.reject('Invalid Memory')
                if (Number(v) < 1) return Promise.reject('Min. 1 second')
                if (Number(v) > 10) return Promise.reject('Max. 10 seconds')

                return Promise.resolve()
            },
        },
    ],
    region: [
        {
            required: true,
            trigger: 'change',
            async validator(_rule: any, value: string) {
                if (!value) return Promise.reject('Required')

                const isInList = Regions.find((x) => value === x.value)
                if (!isInList) return Promise.reject('Required')

                return Promise.resolve()
            },
        },
    ],
}
