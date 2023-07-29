<template>
    <br />

    <footer class="p-4">
        <div class="max-w-5xl mx-auto flex justify-between items-center">
            <div v-if="false" class="text-xs space-y-2">
                <p class="whitespace-nowrap font-bold">Services used:</p>

                <span class="flex">
                    <a-button
                        type="link"
                        target="_blank"
                        size="small"
                        href="https://aws.amazon.com"
                    >
                        AWS
                    </a-button>
                    <a-button
                        type="link"
                        target="_blank"
                        size="small"
                        href="https://planetscale.com"
                    >
                        Planetscale
                    </a-button>
                    <a-button
                        type="link"
                        target="_blank"
                        size="small"
                        href="https://supabase.com"
                    >
                        Supabase
                    </a-button>
                    <a-button
                        type="link"
                        target="_blank"
                        size="small"
                        href="https://vercel.com"
                    >
                        Vercel
                    </a-button>
                </span>
            </div>

            <p class="text-sm">© 2023 Luacel Inc. All rights reserved.</p>

            <a-button
                type="link"
                target="_blank"
                size="small"
                href="https://github.com/justboereh/luacel.com"
            >
                <icon name="fe:github" class="text-2xl" />
            </a-button>
        </div>
    </footer>
</template>
