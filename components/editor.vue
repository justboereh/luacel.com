<script setup lang="ts">
const props = defineProps({
    modelValue: String,
})

const isMounted = ref(false)
const emit = defineEmits(['update:modelValue'])
const isLoading = ref(true)

onMounted(() => {
    isMounted.value = true

    const editor = ace.edit('EditorElement', {
        mode: 'ace/mode/lua',
        selectionStyle: 'text',
    })

    editor.setTheme('ace/theme/twilight')

    editor.session.on('change', function () {
        console.log(editor.getValue())
    })

    const editorResize = new ResizeObserver(() => editor.resize())
    editorResize.observe(document.querySelector('#EditorElement') as Element)
})

watch(props, ({ modelValue }) => {
    if (!isMounted.value) return
})
</script>

<template>
    <div id="EditorElement">
        <slot v-if="isLoading" />
    </div>
</template>
