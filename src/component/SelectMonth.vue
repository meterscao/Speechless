<template>
    <div>
        <div class="mb-1 text-xs">{{ title }}</div>
        <div class="flex gap-1">
            <select v-model="selectedYear" @change="updateValue"
                class="block basis-7/12 w-full pl-2 pr-6 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md cursor-pointer">
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>
            <select v-model="selectedMonth" @change="updateValue"
                class="block basis-5/12 w-full pl-2 pr-6 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md cursor-pointer">
                <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
            </select>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        title:String,        
        modelValue: {
            type: Object,
            default: () => ({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 }),
        },
    },
    data() {
        return {
            years: this.modelValue.years,
            months: Array.from({ length: 12 }, (_, i) => i + 1),
            selectedYear: this.modelValue.year,
            selectedMonth: this.modelValue.month,
        };
    },
    methods: {
        updateValue() {
            this.$emit('update:modelValue', { year: this.selectedYear, month: this.selectedMonth });
            this.$emit('change', { year: this.selectedYear, month: this.selectedMonth })
        },
    },
    watch: {
        modelValue(newVal) {
            console.log('watch!')
            this.selectedYear = newVal.year;
            this.selectedMonth = newVal.month;
        },
    },
    mounted() {
        this.selectedYear = this.modelValue.year;
        this.selectedMonth = this.modelValue.month;
    },
}
</script>