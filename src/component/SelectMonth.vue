<template>
    <div>
        <div class="mb-1 text-xs">{{ title }}</div>
        <div class="flex gap-1">
            <select @change="eventYearChanged()" v-model="year"
                class="block basis-7/12 w-full pl-2 pr-6 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md">
                <option :value="year" v-for="(year, index) in realYears" :key="index">{{ year }}</option>
            </select>
            <select @change="eventMonthChanged()" v-model="month"
                class="block basis-5/12 w-full pl-2 pr-6 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md">
                <option :value="month" v-for="(month, index) in realMonths" :key="index">{{ month }}</option>
            </select>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        title: String,
        years:Array,
    },
    data() {
        let realYears = this.years || [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021 , 2022]
        
        return {
            year:realYears[0] || 2000,
            month:1,
            realYears: realYears,
            realMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        }
    },
    methods:{
        eventYearChanged(){
            this.eventChanged()
        },
        eventMonthChanged(){
            this.eventChanged()
        },
        eventChanged(){
            this.$emit('onRangeChanged',{
                year: this.year,
                month: this.month

            })
            // console.log(this.year,this.month)
        }
    }
}
</script>