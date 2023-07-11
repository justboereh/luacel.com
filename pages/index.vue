<script setup lang="ts">
import { VAceEditor } from 'vue3-ace-editor'
import 'ace-builds/src-noconflict/mode-lua'
import 'ace-builds/src-noconflict/theme-twilight'

// prettier-ignore
const SimpleDXCode = ref('-- function.lua\n\nreturn function(req, res)\n\tlocal name = req.header("x-name")\n\n\tif not name then\n\t\tres.status(401)\n\n\t\treturn res.send("who are you?")\n\tend\n\n\tif name ~= "mom" then\n\t\treturn res.send("you\'re not my mom")\n\tend\n\n\tres.send("hi mom")\nend')
const KVCode = ref(`--function.lua

return function(req, res, KV)
    local name = req.header("x-name")

    if not name or name ~= "mom" then
        res.status(401)

        return res.send("you not my mom")
    end

    local data = KV.get(name)

    res.send("Your birthday is on " .. data.birthday)
end
`)
</script>

<template>
    <div class="p-4 sm:p-12">
        <div
            class="grid place-items-center"
            style="min-height: calc(100vh - 10.5rem)"
        >
            <div>
                <h1
                    class="flex <md:flex-col text-7xl lg:text-9xl justify-center text-center gap-4 text-white"
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

        <br />
        <br />

        <div class="max-w-5xl mx-auto flex <lg:flex-col gap-8">
            <div class="flex-grow">
                <h2>Simple DX</h2>

                <p>
                    I don't know, just look at the code. What else can I say
                    about that?
                </p>

                <p>
                    <nuxt-link to="/docs/kv"> Learn more </nuxt-link>
                    about how you can easily get started building and deploying
                    lua.
                </p>
            </div>

            <div
                class="min-w-lg rounded pt-px bg-dark-900 shadow shadow-black/50 overflow-hidden"
            >
                <VAceEditor
                    :value="SimpleDXCode"
                    :options="{
                        fontSize: 16,
                    }"
                    theme="twilight"
                    lang="lua"
                    class="min-h-sm min-w-sm"
                />
            </div>
        </div>

        <br />
        <br />

        <div class="max-w-5xl mx-auto flex <lg:flex-col-reverse gap-8">
            <div
                class="min-w-lg rounded pt-px bg-dark-900 shadow shadow-black/50 overflow-hidden"
            >
                <VAceEditor
                    :value="KVCode"
                    :options="{
                        fontSize: 16,
                    }"
                    theme="twilight"
                    lang="lua"
                    class="min-h-sm min-w-sm"
                />
            </div>

            <div class="flex-grow">
                <h2>Easily Connect to KV</h2>

                <p>
                    Connect to KV database with simple methods. No configs,
                    enviroment variables, etc needed. Plug and play kind of
                    thing.
                </p>

                <p>
                    Learn more aobut KV database
                    <nuxt-link to="/docs/kv">
                        here in the documentations.
                    </nuxt-link>
                </p>
            </div>
        </div>
    </div>
</template>
