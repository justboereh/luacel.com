<script setup lang="ts">
const { page } = useContent()
useHead({
    titleTemplate: `${page.value.title} : Luacel Docs`,
})
</script>

<template>
    <div class="h-screen w-screen flex flex-col">
        <div class="sticky top-0 z-100 backdrop-blur">
            <div class="p-4">
                <div
                    class="max-w-5xl mx-auto h-8 flex justify-between items-center relative"
                >
                    <nuxt-link
                        to="/"
                        class="h-full flex items-center gap-2 text-dark-800"
                    >
                        <svg-logo-icon class="h-full" />

                        <svg-logo-name class="h-3/5" />
                    </nuxt-link>

                    <div class="<sm:hidden flex items-center h-full gap-2">
                        <nuxt-link to="/pricing" class="p-2 text-dark-800">
                            Pricing
                        </nuxt-link>

                        <nuxt-link to="/docs" class="p-2 text-dark-800">
                            Docs
                        </nuxt-link>
                    </div>

                    <div class="sm:hidden">
                        <!-- <a-dropdown :trigger="['click']">
                            <a-button>
                                <template #icon>
                                    <icon
                                        name="fluent:line-horizontal-3-20-regular"
                                    />
                                </template>
                            </a-button>

                            <template #overlay>
                                <a-menu class="min-w-40">
                                    <a-menu-item key="pricing">
                                        <nuxt-link to="/pricing">
                                            Pricing
                                        </nuxt-link>
                                    </a-menu-item>

                                    <a-menu-item key="docs">
                                        <nuxt-link to="/docs"> Docs </nuxt-link>
                                    </a-menu-item>

                                    <a-divider style="margin: 0"></a-divider>

                                    <a-menu-item v-if="user" key="dashboard">
                                        <nuxt-link to="/dashboard">
                                            Dashboard
                                        </nuxt-link>
                                    </a-menu-item>

                                    <a-menu-item v-if="!user" key="login">
                                        <nuxt-link to="/login">
                                            Login
                                        </nuxt-link>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown> -->
                    </div>
                </div>
            </div>
        </div>

        <slot />

        <Footer />
    </div>
</template>
