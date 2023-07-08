const EmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

export type RuleValidation = (v: string) => true | string
export type RulesT = {
    [k: string]: Array<RuleValidation>
}
export type ValidateForm = {
    [k: string]: any
}
export type ValidateResult = {
    valid: boolean
    results: {
        [k: string]: {
            valid: boolean
            message: string
        }
    }
}

export const Regions = [
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

export const Rules: RulesT = {
    name: [
        (v: string) => !!v || 'Required',
        (v: string) => v.length > 2 || 'Min. 3 characters',
        (v: string) =>
            /^[a-z0-9-\s]+$/.test(v) ||
            'Only lowercase letters, numbers, and - (dash) allowed',
    ],
    memory: [
        (v: string) => !!v || 'Required',
        (v: string) => Number(v) >= 128 || 'Minimum 128',
        (v: string) => Number(v) <= 10240 || 'Maximum 10240',
    ],
    subdomain: [
        (v: string) => v.length > 2 || 'Min. 3 characters',
        (v: string) => /^[a-zA-Z0-9]+$/.test(v) || 'Only alphanumeric allowed',
    ],
    timout: [
        (v: string) => !!v || 'Required',
        (v: string) => Number(v) >= 1 || 'Minimum 1 second',
    ],
    region: [
        (v: string) => !!v || 'Required',
        (v: string) =>
            Regions.some(({ value }) => v === value) || 'Region not valid',
    ],
}

export function Validate(form: ValidateForm) {
    const result: ValidateResult = { valid: true, results: {} }

    for (const key of Object.keys(form)) {
        if (!Rules[key]) continue

        for (const fn of Rules[key]) {
            const value = fn(form[key])

            result.results[key] = {
                valid: value === true,
                message: value === true ? '' : value,
            }

            if (value === true) continue

            result.valid = false
        }
    }

    return result
}
