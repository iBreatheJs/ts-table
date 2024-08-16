// TODO: args any just keys of data, return type also whatever is possible on specific data
// setDataByIndex(rowIndexData: number, colKeyOrIndex: number | string, data: number | string | ((...args: any) => number | string)) {
function setDataByIndex(table, rowIndexData: number, colKeyOrIndex: number | string, data: number | string) {
    // TODO implement for dict
    if (Array.isArray(this.tableData)) {

        // let colIndex = (typeof col === "string") ? col : Object.keys(this.header)[col]

        let colIndexNr: number
        let colIndexStr: string

        let headerKeys = Object.keys(this.header)
        if (typeof colKeyOrIndex === "string") {
            // col as string (in header or maybe new value for calculation)
            colIndexNr = headerKeys.indexOf(colKeyOrIndex) // index in header or -1 if not in header / dom
            colIndexStr = colKeyOrIndex
        } else {
            // col as number (in header)
            colIndexNr = colKeyOrIndex
            colIndexStr = headerKeys[colKeyOrIndex]
        }

        this.tableData[rowIndexData][colIndexStr] = data
        if (colIndexNr != -1) {
            if (this.initialized) this.updateTableValues(rowIndexData, colIndexNr, colIndexStr)
        }

        // TODO: idk yet how to solve. atm dont update after set but do it manually bc of tax calculation that happens afterwards
        // this.updateTableValues()
    }
}