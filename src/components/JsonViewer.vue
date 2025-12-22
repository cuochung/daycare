<template>
  <div class="json-viewer">
    <JsonNode :data="data" :depth="0" :max-depth="maxDepth" :path="'root'"></JsonNode>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import JsonNode from './JsonNode.vue'

defineProps({
  data: {
    type: [Object, Array, String, Number, Boolean, null],
    required: true
  },
  maxDepth: {
    type: Number,
    default: 3
  }
})
</script>

<style scoped>
.json-viewer {
  font-family: 'Courier New', Courier, monospace;
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  max-height: 600px;
  overflow-y: auto;
}
</style>

