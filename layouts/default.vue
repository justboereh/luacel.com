<template>
    <div class="sticky top-0 z-100 bg-[#141414]">
        <div class="p-4">
            <div
                class="max-w-5xl mx-auto h-10 flex justify-between items-center"
            >
                <nuxt-link
                    to="/"
                    class="text-white hover:text-white/75 h-full flex items-center gap-4"
                >
                    <svg-logo-icon class="h-full" />

                    <svg-logo-name class="h-2/3 <sm:hidden" />
                </nuxt-link>

                <div class="<sm:hidden flex items-center h-full gap-2">
                    <nuxt-link to="/dashboard" class="text-white p-2">
                        Dashboard
                    </nuxt-link>

                    <nuxt-link to="/pricing" class="text-white p-2">
                        Pricing
                    </nuxt-link>

                    <nuxt-link to="/docs" class="text-white p-2">
                        Documentations
                    </nuxt-link>

                    <nuxt-link to="/login">
                        <a-button type="primary"> Login </a-button>
                    </nuxt-link>
                </div>

                <div class="sm:hidden">
                    <a-dropdown :trigger="['click']">
                        <a-button>
                            <template #icon>
                                <icon
                                    name="fluent:line-horizontal-3-20-regular"
                                />
                            </template>
                        </a-button>

                        <template #overlay>
                            <a-menu class="min-w-40">
                                <a-menu-item key="dashboard">
                                    <nuxt-link to="/dashboard">
                                        Dashboard
                                    </nuxt-link>
                                </a-menu-item>

                                <a-menu-item key="pricing">
                                    <nuxt-link to="/pricing">Pricing</nuxt-link>
                                </a-menu-item>

                                <a-menu-item key="docs">
                                    <nuxt-link to="/docs">
                                        Documentations
                                    </nuxt-link>
                                </a-menu-item>

                                <a-divider></a-divider>

                                <a-menu-item key="login">
                                    <nuxt-link to="/login"> Login </nuxt-link>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
            </div>
        </div>

        <a-divider style="margin: 0" />
    </div>

    <slot />
</template>
