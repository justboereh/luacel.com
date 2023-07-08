import type { Rule } from 'ant-design-vue/es/form'
const EmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

export const Rules: Record<string, Rule[]> = {
    name: [
        {
            required: true,
            trigger: 'change',
            async validator(_, v: string) {
                if (!v) return Promise.reject('Required')
                if (v.length < 3) return Promise.reject('Min. 3 characters')

                return Promise.resolve()
            },
        },
    ],
    email: [
        {
            required: true,
            trigger: 'change',
            async validator(_, v: string) {
                if (!v) return Promise.reject('Required')

                if (!EmailRegex.test(v)) {
                    return Promise.reject('Invalid email address')
                }

                return Promise.resolve()
            },
        },
    ],
    password: [
        {
            required: true,
            trigger: 'change',
            async validator(_, v: string) {
                if (!v) return Promise.reject('Required')
                if (v.length < 8) return Promise.reject('Min. 8 Characters')

                if (!v.match(/[a-zA-Z]+/)) {
                    return Promise.reject('Requires letters')
                }
                if (!v.match(/[a-zA-Z]+/)) {
                    return Promise.reject('Requires at least a number')
                }

                return Promise.resolve()
            },
        },
    ],
    confirm: [
        {
            required: true,
            trigger: 'change',
            async validator(_, value: string) {
                if (!value) return Promise.reject('Required')

                return Promise.resolve()
            },
        },
    ],
}
