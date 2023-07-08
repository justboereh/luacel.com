export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await getCurrentUser()

    const authPaths = ['/login', '/register']

    if (authPaths.includes(to.path) && user) {
        const redirect = to.query.redirect

        if (!redirect) return navigateTo('/dashboard')

        return navigateTo(decodeURIComponent(redirect as string))
    }

    const isInDashboard = to.path.indexOf('/dashboard') === 0
    const isInAccount = to.path.indexOf('/account') === 0

    if (!isInDashboard && !isInAccount) return

    if (!authPaths.includes(to.path) && !user) {
        const redirect = encodeURIComponent(to.path)

        return navigateTo('/login?redirect=' + redirect)
    }
})
