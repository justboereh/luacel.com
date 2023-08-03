import { User } from '#types/auth'

export const GetUserClient = async () => {
    const user = useState<User | null>('useCurrentUser')

    const access = useCookie('luacel-access')

    if (!access) return (user.value = null)

    const { data } = await useFetch<User>('/api/account/session', {
        method: 'POST',
    })

    console.log(data.value)

    if (!data.value) return (user.value = null)

    user.value = {
        ...data.value,
        created: new Date(data.value.created),
    }
}

let alreadyWatched = false

export const useCurrentUser = () => {
    const user = useState<User | null>('useCurrentUser', () => null)

    if (alreadyWatched) return user
    alreadyWatched = true

    GetUserClient()

    return user
}
