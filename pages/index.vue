<script setup lang="ts">
import hljs from 'highlight.js/lib/core'
import lua from 'highlight.js/lib/languages/lua'

hljs.registerLanguage('lua', lua)

const LuaCode = ref('')
const FullLuaCode =
    '-- function.lua\n\nreturn function(req, res)\n   local name = req.header("x-name")\n\n   if not name then\n      res.status(401)\n      return res.send("who are you?")\n   end\n\n   if name ~= "mom" then\n      return res.send("you\'re not my mom")\n   end\n\n   res.send("hi mom")\nend'

const highlighted = computed(() => {
    return hljs.highlightAuto(LuaCode.value).value
})

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

onMounted(async () => {
    for (const char of FullLuaCode) {
        LuaCode.value += char

        await sleep(25)
    }
})
</script>

<template>
    <div class="p-4 sm:p-12">
        <div
            class="grid place-items-center"
            style="min-height: calc(100vh - 10.5rem)"
        >
            <div>
                <h1
                    class="flex <md:flex-col text-7xl justify-center gap-4 text-white"
                >
                    <div>Deploy</div>
                    <div>Lua</div>
                    <div>Codes.</div>
                </h1>

                <p class="text-xl max-w-lg mx-auto py-4 text-center">
                    Luacel gives developers the tools, infrastructure, and
                    databases to use and deploy the programming language, Lua,
                    to millions of users.
                </p>

                <div class="flex justify-center gap-4">
                    <nuxt-link to="/register">
                        <a-button type="primary" size="large">
                            Let's get started
                        </a-button>
                    </nuxt-link>

                    <nuxt-link to="/docs">
                        <a-button type="text" size="large">
                            Read docs
                        </a-button>
                    </nuxt-link>
                </div>

                <br />
                <br />

                <div>
                    <h3 class="text-center text-white/50 tracking-wider">
                        TRUSTED BY
                    </h3>

                    <div
                        class="grid grid-cols-2 sm:grid-cols-4 gap-4 gap-y-8 my-4"
                    >
                        <div class="grid place-items-center">
                            <img
                                class="h-10"
                                src="/logos/aws.png"
                                alt="aws logo"
                            />
                        </div>

                        <div class="grid place-items-center">
                            <img
                                class="h-8"
                                src="/logos/neatfix.png"
                                alt="neatfix logo"
                            />
                        </div>

                        <div class="grid place-items-center">
                            <img
                                class="h-8"
                                src="/logos/ritogames.png"
                                alt="rito games logo"
                            />
                        </div>

                        <div class="grid place-items-center">
                            <img
                                class="h-7"
                                src="/logos/goggles.png"
                                alt="goggles logo"
                            />
                        </div>

                        <div class="grid place-items-center">
                            <img
                                class="h-6"
                                src="/logos/roblocks.png"
                                alt="roblocks logo"
                            />
                        </div>
                    </div>

                    <br />
                </div>
            </div>
        </div>

        <div class="max-w-5xl mx-auto">
            <div
                class="max-w-full rounded p-4 bg-dark-900 shadow shadow-black/50"
                style="height: calc(384px + 1rem)"
            >
                <pre
                    class="md:overflow-hidden w-sm"
                ><code v-html="highlighted" class="language-lua"></code></pre>
            </div>
        </div>
    </div>
</template>
