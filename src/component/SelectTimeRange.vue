<template>
    
    <div class="flex gap-2">
        <SelectMonthVue @onRangeChanged="evnetStartChanged" :years="yearsArr" class="flex-1" title="开始时间" />
        <SelectMonthVue @onRangeChanged="evnetEndChanged" :years="yearsArr" class="flex-1" title="结束时间" />
    </div>
</template>

<script>
import SelectMonthVue from './SelectMonth.vue';
export default {
    components:{
        SelectMonthVue
    },
    props:{
        years:Array
    },
    data(){
        let yearsArr = []
        if(!this.years) {
            yearsArr = [2010,2011,2012]
        }
        else{
            yearsArr = this.years
        }
        return {     
            yearsArr,       
            start:{
                year: yearsArr[0],
                month: 1
            },
            end:{
                year: yearsArr[0],
                month: 1
            }
        }
    },
    methods:{
        fillWithZero(n){
            return (n < 10 ? '0': '' ) + n
        },
        checkIfValid(){
            let s_m = parseInt( '' + this.start.year + this.fillWithZero(this.start.month))
            let e_m = parseInt( '' + this.end.year + this.fillWithZero(this.end.month))
            return s_m <= e_m
        },
        evnetStartChanged(e){
            this.start = e
            this.eventChanged()
        },
        evnetEndChanged(e){
            this.end = e
            this.eventChanged()
        },
        eventChanged(){
            this.$emit('onRangeChanged',{
                is_valid: this.checkIfValid(),
                range:{start:this.start,
                end:this.end}
                
            })
        }
    }
}
</script>