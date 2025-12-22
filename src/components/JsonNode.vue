<template>
  <div class="json-node" :style="{ paddingLeft: depth * 20 + 'px' }">
    <!-- 物件或陣列 -->
    <div v-if="isObjectOrArray" class="json-object">
      <div class="json-line" @click="toggleExpand">
        <v-icon :class="['toggle-icon', { 'expanded': expanded }]" size="small">
          {{ expanded ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
        </v-icon>
        <span class="json-key" v-if="showKey">{{ displayKey }}:</span>
        <span class="json-preview">
          {{ isArray ? '[' : '{' }}
          <span v-if="!expanded" class="json-collapsed-hint">
            {{ collapsedHint }}
          </span>
          {{ expanded ? '' : (isArray ? ']' : '}') }}
        </span>
      </div>
      
      <div v-if="expanded" class="json-children">
        <JsonNode
          v-for="(value, key) in data"
          :key="key"
          :data="value"
          :depth="depth + 1"
          :max-depth="maxDepth"
          :path="`${path}.${key}`"
          :node-key="key"
        ></JsonNode>
        <div class="json-line" :style="{ paddingLeft: (depth + 1) * 20 + 'px' }">
          <span class="json-bracket">{{ isArray ? ']' : '}' }}</span>
        </div>
      </div>
    </div>

    <!-- 基本型別 -->
    <div v-else class="json-primitive json-line">
      <span class="json-key" v-if="showKey">{{ displayKey }}:</span>
      <span :class="['json-value', valueClass]">{{ displayValue }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'

const props = defineProps({
  data: {
    type: [Object, Array, String, Number, Boolean, null],
    required: true
  },
  depth: {
    type: Number,
    default: 0
  },
  maxDepth: {
    type: Number,
    default: 3
  },
  path: {
    type: String,
    default: 'root'
  },
  nodeKey: {
    type: [String, Number],
    default: null
  }
})

const expanded = ref(props.depth < props.maxDepth)

const isObjectOrArray = computed(() => {
  return typeof props.data === 'object' && props.data !== null
})

const isArray = computed(() => {
  return Array.isArray(props.data)
})

const showKey = computed(() => {
  return props.nodeKey !== null
})

const displayKey = computed(() => {
  if (typeof props.nodeKey === 'number') {
    return `[${props.nodeKey}]`
  }
  return `"${props.nodeKey}"`
})

const valueClass = computed(() => {
  const type = typeof props.data
  if (props.data === null) return 'json-null'
  if (type === 'string') return 'json-string'
  if (type === 'number') return 'json-number'
  if (type === 'boolean') return 'json-boolean'
  return ''
})

const displayValue = computed(() => {
  if (props.data === null) return 'null'
  if (props.data === undefined) return 'undefined'
  if (typeof props.data === 'string') return `"${props.data}"`
  return String(props.data)
})

const collapsedHint = computed(() => {
  if (isArray.value) {
    return `${props.data.length} 項`
  }
  const keys = Object.keys(props.data)
  return `${keys.length} 個屬性`
})

const toggleExpand = () => {
  expanded.value = !expanded.value
}
</script>

<style scoped>
.json-node {
  margin: 2px 0;
}

.json-line {
  cursor: pointer;
  padding: 2px 0;
  display: flex;
  align-items: center;
  user-select: none;
}

.json-line:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.toggle-icon {
  margin-right: 4px;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.toggle-icon.expanded {
  transform: rotate(0deg);
}

.json-key {
  color: #881391;
  font-weight: 600;
  margin-right: 8px;
}

.json-preview {
  color: #666;
}

.json-collapsed-hint {
  color: #999;
  font-style: italic;
  margin: 0 4px;
}

.json-bracket {
  color: #666;
}

.json-primitive .json-line {
  cursor: default;
}

.json-value {
  margin-left: 4px;
}

.json-string {
  color: #d14;
}

.json-number {
  color: #0086b3;
}

.json-boolean {
  color: #0086b3;
  font-weight: 600;
}

.json-null {
  color: #999;
  font-style: italic;
}

.json-children {
  margin-left: 0;
}
</style>

