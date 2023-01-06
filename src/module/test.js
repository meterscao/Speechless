
let map = {
    2016:[6,7,8],
    2018: [9]
}

let range = {
    start:{
        year:2014,
        month: 9
    },
    end:{
        year:2018,
        month:10
    }
}

const getMonthParameters = function(years){

}

const convertDateToNumber = function(y,m){
    let n = '' + y + (m<10 ? '0' + m : '' + m) 
    console.log(n) 
    return parseInt(`${y}`+ m<10?`0${m}`:`${m}`)
}

const getValidMonths = function(map,range){
    let historyMonths = []
    for(let y = range.start.year ; y <= range.end.year ; y++){
        for(let m = 1 ;  m <= 12  ; m++){            
            let num = convertDateToNumber(y,m)
            if(num >= convertDateToNumber(range.start.year,range.start.month) 
            && num <= convertDateToNumber(range.end.year,range.end.month)){
                historyMonths.push(`${y}|${m}`)
            }
            
        }
    }
    console.log(historyMonths)
    let rangeMonths = []
}



getValidMonths(map,range)