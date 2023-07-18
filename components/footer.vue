<template>
    <br />

    <footer class="p-4">
        <div class="max-w-5xl mx-auto flex justify-between items-center">
            <div class="text-xs space-y-2">
                <p class="whitespace-nowrap font-bold">Services used:</p>

                <span class="flex gap-4">
                    <nuxt-link to="https://aws.amazon.com">AWS</nuxt-link>
                    <nuxt-link to="https://cloudflare.com">
                        Cloudflare
                    </nuxt-link>
                    <nuxt-link to="https://planetscale.com">
                        Planetscale
                    </nuxt-link>
                    <nuxt-link to="https://supabase.com">Supabase</nuxt-link>
                </span>
            </div>

            <nuxt-link to="https://github.com/justboereh/luacel.com">
                <icon name="fe:github" class="text-2xl" />
            </nuxt-link>
        </div>
    </footer>
</template>
