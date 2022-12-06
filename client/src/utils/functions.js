export function sortByDate(date1, date2) {
    const date1Obj = new Date(date1.createdAt)
    const date2Obj = new Date(date2.createdAt)
    return (date1Obj.getTime() - date2Obj.getTime())
}