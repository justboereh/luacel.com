<script setup lang="ts">
const auth = useSupabaseAuthClient().auth
const user = useSupabaseUser()
const route = useRoute()
const router = useRouter()

function Login(provider: any) {
    let redirect = '/dashboard'

    if (route.query.redirect) {
        redirect = decodeURIComponent(route.query.redirect as string)
    }

    auth.signInWithOAuth({
        provider: provider,
        options: {
            redirectTo: `${location.origin}/${redirect}`,
        },
    })
}

watch(
    user,
    (u) => {
        if (!u) return

        let path = '/dashboard'

        if (route.query.redirect) {
            path = decodeURIComponent(route.query.redirect as string)
        }

        router.push(path)
    },
    {
        immediate: true,
    }
)

definePageMeta({
    layout: 'empty',
})
</script>

<template>
    <div
        class="top-0 bottom-0 left-0 right-0 fixed p-4 sm:grid sm:place-items-center"
    >
        <div
            class="w-full max-w-sm mx-auto h-auto my-auto p-8 shadow-lg shadow-black/15 rounded-md bg-white"
        >
            <div class="h-10 flex gap-4 items-center">
                <svg-logo-icon class="h-10" />

                <svg-logo-name class="h-6" />
            </div>

            <br />

            <h2>Login</h2>

            <div class="text-sm">to continue using Luacel</div>

            <br />

            <a-space>
                <a-button size="large" @click="Login('github')">
                    <a-space>
                        <icon name="fe:github" class="text-xl" />

                        Github
                    </a-space>
                </a-button>

                <a-divider type="vertical" />

                <a-button size="large" @click="Login('discord')">
                    <a-space>
                        <icon name="bi:discord" class="text-xl" />

                        Discord
                    </a-space>
                </a-button>
            </a-space>
        </div>
    </div>
</template>
