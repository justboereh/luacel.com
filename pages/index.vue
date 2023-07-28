<script setup lang="ts">
const user = useCurrentUser()

useHead({
    title: 'Luacel',
})
</script>

<template>
    <div
        class="flex-grow p-4 sm:p-12 text-center flex flex-col items-center justify-center"
    >
        <div>
            <h1 class="flex <md:flex-col text-4xl lg:text-5xl">
                The Way to Deploy Lua Codes.
            </h1>

            <p class="max-w-lg mx-auto py-4 text-center">
                Luacel gives developers the tools, infrastructure, and databases
                to use and deploy the programming language, Lua, to millions of
                users.
            </p>
            <div class="flex justify-center gap-4">
                <nuxt-link :to="user ? '/dashboard' : '/register'">
                    <a-button type="primary" size="large">
                        Get started
                    </a-button>
                </nuxt-link>

                <nuxt-link to="/docs">
                    <a-button type="text" size="large"> Read docs </a-button>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>
