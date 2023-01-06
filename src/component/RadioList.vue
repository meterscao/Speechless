<template>
    <div>
        <label class="text-base font-medium text-gray-900">{{ title }}</label>
        <p class="text-sm leading-5 text-gray-500">{{ description }}</p>
        <fieldset class="mt-2">
            <legend class="sr-only">{{ title }}</legend>
            <div class="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                <div v-for="(option, index) in options" :key="index" class="flex items-center">
                    <input :id="index" name="notification-method" type="radio" :checked="(checked == index)"
                        class="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300" />
                    <label :for="index" class="ml-1 block text-sm font-medium text-gray-700">
                        {{ option }}
                    </label>
                </div>
            </div>
        </fieldset>
    </div>
</template>
<script>
export default {
    props: {
        title: String,
        description: String,
        options: Array,
        checked: {
            type: Object,
            default: 0
        }
    }
    
}
</script>