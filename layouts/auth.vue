<script setup lang="ts"></script>

<template>
    <div
        class="top-0 bottom-0 left-0 right-0 fixed p-4 sm:grid sm:place-items-center"
    >
        <div class="w-full max-w-sm mx-auto h-auto my-auto">
            <div class="h-10 flex gap-4 items-center">
                <svg-logo-icon class="h-10" />

                <svg-logo-name class="h-6" />
            </div>

            <br />

            <slot />
        </div>
    </div>
</template>
