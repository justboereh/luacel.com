import { User } from '#types/auth'

let alreadyWatched = false

export const useCurrentUser = () => {
    const user = useState<User | null>('useCurrentUser', () => null)

    if (alreadyWatched) return user
    alreadyWatched = true

    watch(
        useCookie('luacel-access'),
        async (access) => {
            if (!access) return (user.value = null)

            const { data } = await useFetch<User>('/api/account/session', {
                method: 'POST',
            })

            if (!data.value) return (user.value = null)

            user.value = {
                ...data.value,
                created: new Date(data.value.created),
            }
        },
        { immediate: true }
    )

    return user
}
