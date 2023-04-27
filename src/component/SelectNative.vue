<template>
  <div>
    <label class="block text-sm font-medium text-gray-900">{{ title }}</label>
    <p
      v-if="description && description.length > 0"
      class="text-sm leading-5 text-gray-500"
    >
      {{ description }}
    </p>
    <div class="mt-2">
      <select
        @input="$emit('update:modelValue', parseInt($event.target.value))"
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md cursor-pointer"
      >
        <option
          :value="index"
          :selected="modelValue === index"
          v-for="(option, index) in options"
          :key="index"
        >
          {{ option }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    options: Array,
    description: String,
    modelValue: Number,
  },

  emits: ["update:modelValue"],
  data() {
    return {}
  },
  methods: {},
}
</script>
