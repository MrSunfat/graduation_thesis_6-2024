<template>
        <v-dialog v-model="props.isShow" width="auto" persistent class="">

            <v-card>
                <v-card-title>
                    {{ title }}
                </v-card-title>
                <v-card-text>
                    {{ content }}
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="primary" @click="closeDialog">Đóng</v-btn>
                    <v-btn v-if="confirmText" color="primary" @click="confirm">{{ confirmText }}</v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
    title: String,
    content: String,
    confirmText: String,
    data: {
        type: [String, Number, Object]
    },
    isShow: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['confirm', 'update:isShow'])

const closeDialog = () => {
    emit('update:isShow', false)
}

const confirm = () => {
    emit('confirm', props.data)
}
// const dialog = ref(true)
</script>