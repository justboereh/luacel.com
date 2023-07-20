<script setup lang="ts">
const route = useRoute()
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <div class="p-4 sm:px-8 sm:pt-8 bg-white">
            <div class="max-w-5xl mx-auto flex justify-between items-center">
                <nuxt-link
                    to="/dashboard"
                    class="h-10 flex gap-3 items-center text-dark-800"
                >
                    <svg-logo-icon class="h-full" />

                    <svg-logo-name class="h-1/2 <sm:hidden" />
                </nuxt-link>

                <div class="flex gap-4 items-center">
                    <nuxt-link to="/docs">
                        <a-button> Docs </a-button>
                    </nuxt-link>

                    <nuxt-link to="/account">
                        <a-button type="bordered"> Account </a-button>
                    </nuxt-link>
                </div>
            </div>
        </div>

        <tabs
            :tabs="[
                {
                    name: 'account',
                    icon: 'fluent:person-20-regular',
                    url: '',
                },
                {
                    name: 'billing',
                    icon: 'fluent:wallet-credit-card-20-regular',
                    url: 'billing',
                },
                {
                    name: 'danger',
                    icon: 'fluent:important-20-regular',
                    url: 'danger',
                },
            ]"
            :tab="route.path.split('/')[2] || ''"
            path="/account"
        />

        <main class="flex-grow">
            <slot />
        </main>

        <Footer />
    </div>
</template>
