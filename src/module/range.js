// 根据选择的月份区间 和 用户的微博月份区间 得到一个有效的月份区间
export const getRangeMonths = function (yearMap, range) {
    if (!yearMap) return []
    if (!range) return []

    let historyMonths = []
    for (let y = range.start.year; y <= range.end.year; y++) {
        for (let m = 1; m <= 12; m++) {
            if (y == range.start.year && m < range.start.month) continue
            if (y == range.end.year && m > range.end.month) break
            historyMonths.push(`${y}|${m}`)
        }
    }

    let mapMonths = []
    for (const year in yearMap) {
        const monthsInYear = yearMap[year];
        mapMonths = mapMonths.concat([], monthsInYear.map(month => {
            return `${year}|${month}`
        }))
    }

    let rangeMonths = mapMonths.filter(function (m) { return historyMonths.indexOf(m) > -1 })
    console.log('rangeMonths :', rangeMonths)
    if (rangeMonths.length > 0) {
        rangeMonths = rangeMonths.reverse()
    }
    return rangeMonths

}

