export const apiURL = () => {
    return process.env.NODE_ENV !== 'production'
        ? 'http://localhost:3001'
        : 'https://api.luacel.com'
}

type RequestURL = string | (() => string)

export function unFetch<DataT>(url: RequestURL, options?: any) {
    return useFetch<DataT>(url, {
        baseURL:
            process.env.NODE_ENV === 'development'
                ? 'http://localhost:8787'
                : 'https://api.luacel.com',
        method: 'POST',
        headers: {
            'luacel-access': useCookie('luacel-access'),
        },
        ...options,
    })
}
