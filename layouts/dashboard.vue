<script setup lang="ts"></script>

<template>
    <div class="min-h-screen">
        <div class="p-4 sm:px-8 sm:pt-8 flex justify-between items-center">
            <nuxt-link
                to="/dashboard"
                class="h-10 flex gap-3 items-center text-white"
            >
                <svg-logo-icon class="h-full" />

                <svg-logo-name class="h-1/2 <sm:hidden" />
            </nuxt-link>

            <div class="flex gap-4 items-center">
                <nuxt-link to="/docs">
                    <a-button> Docs </a-button>
                </nuxt-link>

                <nuxt-link to="/account">
                    <a-button> Account </a-button>
                </nuxt-link>
            </div>
        </div>

        <slot />
    </div>
</template>
