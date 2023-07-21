<script setup lang="ts">
const auth = useSupabaseAuthClient().auth
const user = useSupabaseUser()
const route = useRoute()
const router = useRouter()

async function Login(provider: any) {
    let redirect = '/dashboard'

    if (route.query.redirect) {
        redirect = decodeURIComponent(route.query.redirect as string)
    }

    auth.signInWithOAuth({
        provider: provider,
        options: {
            redirectTo: `${location.origin}/login?redirect=${redirect}`,
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

        router.replace(path)
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
        class="top-0 bottom-0 left-0 right-0 fixed p-4 grid place-items-center"
    >
        <div
            class="w-full max-w-sm mx-auto h-auto my-auto p-8 shadow-lg shadow-black/15 rounded-md bg-white"
        >
            <nuxt-link
                to="/"
                class="h-10 flex gap-4 items-center text-dark-800"
            >
                <svg-logo-icon class="h-10" />

                <svg-logo-name class="h-6" />
            </nuxt-link>

            <br />

            <h1>Login</h1>

            <p class="text-sm">to continue using Luacel.</p>

            <br />

            <div class="grid grid-cols-2 gap-3">
                <a-button @click="Login('github')">
                    <a-space>
                        <icon name="fe:github" class="text-lg" />

                        Github
                    </a-space>
                </a-button>

                <a-button @click="Login('discord')">
                    <a-space>
                        <icon name="bi:discord" />

                        Discord
                    </a-space>
                </a-button>

                <a-button @click="Login('google')">
                    <a-space>
                        <icon name="bi:google" />

                        Google
                    </a-space>
                </a-button>

                <a-button @click="Login('facebook')">
                    <a-space>
                        <icon name="bi:facebook" />

                        Facebook
                    </a-space>
                </a-button>
            </div>
        </div>
    </div>
</template>
