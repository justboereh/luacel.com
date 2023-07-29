import { AppFunction } from '#types/app'

export async function GetAppFunctions() {
    const route = useRoute()
    const stateFunctions = useState<AppFunction[]>('useStateFunctions')

    const { data } = await useFetch<AppFunction[]>(
        () => `/api/apps/${route.params.appid}/functions`,
        {
            method: 'POST',
        }
    )

    if (!data.value) return

    stateFunctions.value = data.value
}
