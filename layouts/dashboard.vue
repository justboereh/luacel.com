<script setup lang="ts"></script>

<template>
    <div class="min-h-screen flex flex-col">
        <div class="p-4 sm:px-8 sm:pt-8 backdrop-blur">
            <div class="max-w-5xl mx-auto flex justify-between items-center">
                <nuxt-link
                    to="/dashboard"
                    class="h-10 flex gap-3 items-center text-dark-800"
                >
                    <svg-logo-icon class="h-full" />

                    <svg-logo-name class="h-1/2 <sm:hidden" />
                </nuxt-link>

                <div class="flex items-center">
                    <nuxt-link to="/docs">
                        <a-button type="text"> Docs </a-button>
                    </nuxt-link>

                    <nuxt-link to="/account">
                        <a-button type="text"> Account </a-button>
                    </nuxt-link>
                </div>
            </div>
        </div>

        <main class="flex-grow">
            <slot />
        </main>

        <Footer />
    </div>
</template>
