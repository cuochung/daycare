<template>
  <div class="d-flex">
    <v-btn
      v-if="printChoice"
      color="primary"
      variant="flat"
      class="ml-2"
      @click="changeChoice"
    >
      列印選擇
    </v-btn>
    <v-btn
      v-if="!printChoice && printItems.length > 0"
      color="success"
      variant="flat"
      class="ml-2"
      @click="openPrintDialog"
    >
      列印表單選擇
    </v-btn>
    <MultiPrintOption
      ref="printOptionRef"
      :print-items="printItems"
    />
    <v-btn
      v-if="!printChoice"
      color="primary"
      variant="flat"
      class="ml-2"
      @click="changeChoice"
    >
      顯示功能
    </v-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MultiPrintOption from '@/components/MultiPrintOption.vue'

defineProps({
  printChoice: {
    type: Boolean,
    default: true,
  },
  printItems: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['changeChoice'])

const printOptionRef = ref(null)

const changeChoice = () => {
  emit('changeChoice')
}

const openPrintDialog = () => {
  printOptionRef.value?.open()
}
</script>

<style scoped lang="scss">
// 樣式已由 Vuetify 3 元件處理
</style>
