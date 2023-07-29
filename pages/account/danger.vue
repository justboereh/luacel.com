<script setup>
const isDeleting = ref(false)
const router = useRouter()

async function SignOut() {
    useCookie('luacel-access').value = ''

    router.push('/login?redirect=/account')
}

async function DeleteAccount() {
    if (isDeleting.value) return
    isDeleting.value = true

    const { error } = await useFetch(`/api/account`, {
        method: 'DELETE',
    })

    if (error.value) {
        return
    }

    router.push('/login')
}

definePageMeta({
    layout: 'account',
})
</script>

<template>
    <div class="p-4">
        <div class="max-w-5xl mx-auto">
            <h1>Danger</h1>

            <p>All the dangerous actions you can do.</p>

            <p>
                Your account will be automatically deleted after a week. This is
                NOT an actual service. Please do NOT enter any sensitive
                information. I REPEAT! Actually, I'm not repeating. Here comes
                the Lorem stuff because things look weird short :( Lorem ipsum
                dolor sit, amet consectetur adipisicing elit. Doloremque
                veritatis corporis non mollitia aliquam? Velit architecto id
                quas libero quo quae voluptatum rem, aspernatur sed. Rerum unde
                atque maxime nihil!
            </p>

            <a-space>
                <a-button danger ghost @click="SignOut">Sign Out</a-button>

                <a-button type="text" danger @click="DeleteAccount">
                    Delete Account
                </a-button>
            </a-space>
        </div>
    </div>
</template>
