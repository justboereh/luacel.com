import { AppFunction } from '#types/app'

export async function GetAppFunctions() {
    const route = useRoute()
    const stateFunctions = useState<AppFunction[]>('useStateFunctions')

    const { data } = await useFetch<AppFunction[]>(() => `/api/functions`, {
        method: 'POST',
        body: {
            id: () => route.params.appid,
        },
    })

    if (!data.value) return

    stateFunctions.value = data.value
}
