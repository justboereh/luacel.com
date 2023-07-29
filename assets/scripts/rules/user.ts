import type { Rule } from 'ant-design-vue/es/form'
const EmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

export const Rules: Record<string, Rule[]> = {
    username: [
        {
            required: true,
            trigger: 'change',
            async validator(_, v: string) {
                if (!v) return Promise.reject('Required')

                return Promise.resolve()
            },
        },
        {
            required: true,
            trigger: 'change',
            async validator(_, v: string) {
                if (!/^[\w\d]+$/g.test(v))
                    return Promise.reject('Invalid username')

                return Promise.resolve()
            },
        },
        {
            required: true,
            trigger: 'change',
            async validator(_, v: string) {
                if (v.length < 3) return Promise.reject('Min. 3 characters')

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

                return Promise.resolve()
            },
        },
        {
            required: true,
            trigger: 'change',
            async validator(_, v: string) {
                if (/['";]+/g.test(v)) return Promise.reject('Invalid password')

                return Promise.resolve()
            },
        },
        {
            required: true,
            trigger: 'change',
            async validator(_, v: string) {
                if (v.length < 8) return Promise.reject('Min. 8 Characters')

                return Promise.resolve()
            },
        },
        {
            required: true,
            trigger: 'change',
            async validator(_, v: string) {
                if (!v.match(/[\w]+/g))
                    return Promise.reject('Required at least a letter')

                return Promise.resolve()
            },
        },
        {
            required: true,
            trigger: 'change',
            async validator(_, v: string) {
                if (!v.match(/[\d]+/g)) {
                    return Promise.reject('Required at least a number')
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
