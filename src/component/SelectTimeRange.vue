<template>
    <div class="flex gap-2">
        <SelectMonthVue v-model="start" @change="eventStartChanged" class="flex-1" title="开始时间" />
        <SelectMonthVue v-model="end" @change="eventEndChanged" class="flex-1" title="结束时间" />
    </div>
</template>

<script>
import SelectMonthVue from './SelectMonth.vue';
export default {
    components: {
        SelectMonthVue
    },
    props: {
        range: Object,
        years: Array
    },
    data() {
        let yearsArr = []
        if (!this.years) {
            yearsArr = [2020, 2021, 2022, 2023]
        }
        else {
            yearsArr = this.years
        }
        return {
            start: {
                year: this.range.start.year, 
                month: this.range.start.month,
                years: yearsArr
            },
            end: { 
                year: this.range.end.year, 
                month: this.range.end.month, 
                years: yearsArr 
            },
            yearsArr
        }
    },
    methods: {
        fillWithZero(n) {
            return (n < 10 ? '0' : '') + n
        },
        checkIfValid() {
            let s_m = parseInt('' + this.start.year + this.fillWithZero(this.start.month))
            let e_m = parseInt('' + this.end.year + this.fillWithZero(this.end.month))            
            return s_m <= e_m
        },
        
        eventChanged() {
            this.$emit('onRangeChanged', {
                range: {
                    start: this.start,
                    end: this.end
                }

            })
        },
        eventStartChanged(){
            if(!this.checkIfValid()){
                this.end = this.start
            }
            this.eventChanged()
            console.log('start change')
        },
        eventEndChanged(){
            if(!this.checkIfValid()){

                this.start = this.end
            }
            this.eventChanged()
            console.log('end change')
        }
    }
}
</script>