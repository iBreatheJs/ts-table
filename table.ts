
// console.log("document.styleSheets")
// console.log(document.styleSheets)
// var style = document.createElement('style');
// style.type = 'text/css';
// style.innerHTML = '.hidden { display: none; }';
// document.getElementsByTagName('head')[0].appendChild(style);

import { getTaxesMin } from "../tax";

// document.getElementById('someElementId').className = 'cssClass';



/**
 * basic table style
 * can be modified and passed to table
 * 
 * INFO: not implemented!! 
 * its just easier to use a css file with different classes
 */
export var tableStyle = {
    custom: {
        evenRows: '#f2f2f2'
    },
    table: {
        fontFamily: 'Arial, Helvetica, sans-serif',
        borderCollapse: 'collapse',
        width: '100%'
    },
    th: {
        border: '1px solid #ddd',
        padding: '8px',
        whiteSpace: 'nowrap',
        // backgroundColor: 'green'
    }
}


// Typeguards:
function isArray(test: any): test is Array<any> {
    return Array.isArray(test);
}

function isTableRow(test: any): test is HTMLTableRowElement {
    return test.rowIndex;
}


interface Dictionary<TValue> {
    [id: string]: TValue;
}

interface DictRO<T> {
    readonly [id: string]: T;
}
// interface DictRO<TValue> {
//     readonly [id: string]: TValue;
// }

// export interface DictROEx {
//     readonly time: number,
//     readonly vol: number,
//     readonly price: number,
//     readonly cost: number,
//     readonly id: number // uniqe among trades of same asset pair
// }


// export type DictRO2<Data> = Data extends DictRO;

// type TableData<T> = Dictionary<T> | T[];
// type TableData = Dictionary<Dictionary<number | string>> | Dictionary<number | string>[]
// TODO: implement checkbox etc. for bool
// export type RowData = Dictionary< number | string | boolean>
// export type RowData = Dictionary<Readonly<string>>[]
// export type RowData = Dictionary< Readonly<number> | Readonly<string>>
// export type RowDataRO = DictRO<number | string | boolean>
type RowDataRO = DictRO<number | string | boolean>
//  | TableDataExt<Data>;
// type TableData = Dictionary<Dictionary<number | string>> | Dictionary<number | string>[] | TableDataExt<Data>;
// type TableDataTest<Data extends DataDict> = Dictionary<Data> | Data[];

export type TableData2<T> = T extends Array<any> ? RowData[] : Dictionary<RowData>;

// export type TableData = Dictionary<RowData> | RowData[];
// export type TableData = RowData[] | Dictionary<RowData>;
// export type TableData = RowDataRO[] | Dictionary<RowDataRO>;
export type TableData = RowDataRO[];
// export type TableData = DictRO[] | Dictionary<DictRO>;
// export type TableData<T> = T extends Array<RowData> ? RowData[] : Dictionary<RowData>;


// export type TableData = TableDataDict | TableDataArr;

// type TableDataDict = {
//     data: Dictionary<RowData>
//     index: string
// }
// type TableDataArr = {
//     data: RowData[]
//     index: number
// }



export type KeyOrIndex<data> = data extends Array<any> ? number : string;



// export type Trade = Dictionary<string | number> & { potentialBuys?: Trades, specPeriod?: Trades } & TradeMin


/**
 * optional Params for style / table feature
 */
export interface TableOptions<Data extends TableData> {
    tableStyle?: Dictionary<Dictionary<string>>,
    alternateColour?: boolean //default true
    transformData?: RowFunc<Data>,
    rowFunc?: RowFunc<Data>,
    collapsible?: CollapsibleRowFunc<Data>,
    sortable?: { // TODO: add 3rd value to header that is used for sorting, eg. for time: display simple date format but calc with unix time stamp
        all: boolean,
        cols?: [string]
    },
    editable?: OnEditFunc | boolean
}

type ROData<Data> = Data extends Array<infer RowData> ? Readonly<RowData> : never;

type ReadOnly<T> = { readonly [P in keyof T]: T[P] };

export interface RowFunc<Data extends TableData> {
    (
        rowHtml: HTMLTableRowElement,
        keyOrIndex: KeyOrIndex<Data>,
        // keyOrIndex: number | string,
        // keyOrIndex: KeyOrIndex<Data>,
        // keyOrIndex: Data extends Dictionary<any> ? string : number,
        tableData: ROData<Data>,
        // tableData: RowDataRO[],
        table: Table<Data>, //TODO: figure out data type here
    ): void
}


/**
 * function that can be passed to Table as option 'collapsible'
 * to manipulate innerHtml of row that expends onClick 
 */
export interface CollapsibleRowFunc<Data extends TableData> {
    (
        cellHtml: HTMLTableCellElement,
        // keyOrIndex: string | number,
        keyOrIndex: KeyOrIndex<Data>,
        tableData: Data,
    ): void
}

export interface OnEditFunc {
    (
        row: HTMLTableRowElement,
        cell: HTMLTableCellElement,
        tableData: TableData, //todo
    ): void
}



// ASK: can i configure private interfaces for the class
// that reference tableData without the need to always n everywherer pass the generic type
// var asdf : typeof Table= Table()
// export class Table<Data extends TableData>{
export class Table<Data extends RowData[]>{
    private tableHtml: HTMLTableElement;
    private header: Dictionary<string>;
    readonly tableData: Data;
    // private _tableData: Data;
    public options: TableOptions<Data>;
    // public options: {
    //     tableStyle?: Dictionary<Dictionary<string>>,
    //     alternateColour?: boolean //default true
    //     rowFunc?: RowFunc<Data>,
    //     collapsible?: CollapsibleRowFunc<Data>,
    //     sortable?: { // TODO: add 3rd value to header that is used for sorting, eg. for time: display simple date format but calc with unix time stamp
    //         all: boolean,
    //         cols?: [string]
    //     },
    //     editable?: OnEditFunc
    // }
    private tableStyle: Dictionary<Dictionary<string>>

    //  get tableData() {
    //     return this._tableData
    // }

    // public set tableData(tableData) {
    //     console.log("setter table data")
    //     this._tableData = tableData;
    //     // this.updateTableValues()
    // }



    /**
     * 
     * @param tableHtml 
     * @param header Key = name of associated data field, value = display name
     * @param tableData 
     * @param options 
     */
    constructor(tableHtml: HTMLTableElement, header: Dictionary<string>, tableData: Data, options: TableOptions<Data> = {}) {
        this.tableHtml = tableHtml
        this.header = header
        // this._tableData = tableData
        this.tableData = tableData
        this.options = options
        // TODOOO
        // if (this.options?.alternateColour != false) this.options?.alternateColour = true;
        this.tableStyle = options?.tableStyle || tableStyle
        // this.drawTable()
        // check if possinle to structer rowfunc etc that no update is necessary right after init
        // this.updateTableValues()
    }

    // TODO: getter, settter for tableData to update values in dom

    getDataByIndex(row: number, col: number) {

        // TODO implement for dict
        // todo change data type with infer and refactor these array checks
        if (Array.isArray(this.tableData)) {
            return this.tableData[row - 1][Object.keys(this.header)[col]]
        }
    }
    setDataByIndex(row: number, colKeyOrIndex: number | string, data: number | string) {
        // TODO implement for dict
        if (Array.isArray(this.tableData)) {

            // let colIndex = (typeof col === "string") ? col : Object.keys(this.header)[col]

            let colIndexNr: number
            let colIndexStr: string

            let headerKeys = Object.keys(this.header)
            if (typeof colKeyOrIndex === "string") {
                colIndexNr = headerKeys.indexOf(colKeyOrIndex) //false
                colIndexStr = colKeyOrIndex
            } else {
                colIndexNr = colKeyOrIndex
                colIndexStr = headerKeys[colKeyOrIndex]

            }

            // let colIndex = col
            this.tableData[row - 1][colIndexStr] = data
            this.updateTableValues(row, colIndexNr, colIndexStr)

            // TODO: idk yet how to solve. atm dont update after set but do it manually bc of tax calculation that happens afterwards
            // this.updateTableValues()



        }
    }

    test(cell: number) {
        // TODO implement for dict
        if (Array.isArray(this.tableData)) {
            return this.tableData[cell]
        }
    }

    /**
     * only called from setDataByIndex
     *      data can be set onEdit or manually by user at any time
     * setDataByIndex - sets the data then calls -> updateTableValues - updates the html table cell
     * 
     * @param row 
     * @param colNr 
     * @param colStr 
     * @returns 
     */
    private updateTableValues(row?: number, colNr?: number, colStr?: string) {
        // check data structure

        // console.log(this.tableData)

        if (Array.isArray(this.tableData)) {
            let rows = this.tableHtml.rows
            // let headerKeys = Object.keys(this.header)

            // if row, col param updat only what is necessary
            if (row && colNr && colStr) {
                console.log("update table value")

                console.log(rows[row].cells)
                let cell = rows[row].cells[colNr]
                console.log("cell to update")
                console.log(cell)

                // let key = headerKeys[col]

                cell.innerHTML = String(this.tableData[row - 1][colStr])
                return
            }
            console.log("update ALLL table values")

            // update all cells
            // data starting with index 0, table starting with index 1 because 0 is the header
            let rowIndex = 1
            // starting with index 1; 0 is the header
            for (rowIndex; rowIndex < rows.length; rowIndex++) {
                const row = rows[rowIndex];

                this.transformData(row, rowIndex - 1)

                // for (let rowIndex in rows) {
                // let row = rows[rowIndex]
                let cells = row.cells
                // console.log("rowwww data")
                // console.log(this.tableData)
                // console.log(rowIndex)
                // console.log(rows)
                for (let colIndex = 0; colIndex < cells.length; colIndex++) {
                    const cell = cells[colIndex];

                    // todo need that?
                    let headerKeys = Object.keys(this.header)
                    let key = headerKeys[colIndex]

                    // console.log(this.tableData[dataRowIndex][key])
                    // console.log('innerhtml')
                    // console.log(this.tableData[rowIndex][key])

                    // data starting with index 0, table starting with index 1 because 0 is the header
                    cell.innerHTML = String(this.tableData[rowIndex - 1][key])
                }
            }
        }
    }

    // update cell value
    // TODO: maybe more params could be needed outside in the callback, eg. pass table
    onEdit(event: Event, keyOrIndex: string | number) {
        let cell = event.currentTarget as HTMLTableCellElement
        let row = cell.parentElement as HTMLTableRowElement

        let cellIndex = cell.cellIndex
        let rowIndex = row.rowIndex

        var valNew = cell.innerHTML

        this.setDataByIndex(rowIndex, cellIndex, valNew)

        // ASK: pass row, cell as index html or string??
        if (this.options.editable && typeof this.options.editable === "function")
            this.options.editable(row, cell, this.tableData);

        // if (this.options.transformData) {
        //     this.options.transformData(row, keyOrIndex as KeyOrIndex<Data>, this.tableData, this)
        // }

    }

    transformData(row: HTMLTableRowElement, keyOrIndex: string | number) {
        if (this.options.transformData) {
            this.options.transformData(row, keyOrIndex as KeyOrIndex<Data>, this.tableData, this)
        }

    }

    drawTable() {
        console.debug('draw Table ' + this.tableHtml.id);

        // HEADER
        let thead = this.tableHtml.createTHead();
        let rowHeader = thead.insertRow();
        var colNr = 0;
        for (let key in this.header) {
            let nr = colNr
            let th = document.createElement("th");
            // Object.assign(th.style, tableStyle.th);
            // th.style.cssText = " border: 1px solid #ddd;"


            // if sortable
            if (this.options.sortable?.all) {
                th.addEventListener('click', () => { this.sortTable(nr), this.changeColourEvenRows() }, false);

                // TODO: implement for specific cols only / possibility to disable some
            }
            let text = document.createTextNode(this.header[key]);
            th.appendChild(text);
            rowHeader.appendChild(th);
            colNr++
        }


        // TABLE

        // check data structure
        var dataIsArray = Array.isArray(this.tableData)




        var keyOrIndex: number | string
        // var keyOrIndex: KeyOrIndex<Data>

        // if(Array.isArray(this.tableData)) keyOrIndex = 7


        // for in returns key (and also Array index) as string
        for (keyOrIndex in this.tableData) {

            // convert string to number for tsc - only necessary when checking for types when indexing data (arr/dict)
            // tried a million years and approches but there is not satisfying way to make ts understand it, it seems
            // TODO document in md
            // if (isArray(this.tableData)) keyOrIndex = +keyOrIndexTmp;

            let row = this.tableHtml.insertRow();

            // transform row data, called for each row TODO: that good here or call once and set all
            if (this.options.transformData) {
                this.transformData(row, keyOrIndex as KeyOrIndex<Data>)
                // this.options.transformData(row, keyOrIndex as KeyOrIndex<Data>, this.tableData, this)
            }

            for (const col in this.header) {



                let value

                // @ts-ignore
                // for-in and Object.Keys return elements as string, if Array its certenly a number
                // nice and easy js solution:
                // 
                // keyTableData is a special col that is associated with the key of the object that contains the rest of the cols as values
                value = col == 'keyTableData' ? keyOrIndex : this.tableData[keyOrIndex][col];

                let cell = row.insertCell();
                // set id to col name, identification for table update
                // TODO: use id for each single celll or do it by class??
                // cell.id = col
                cell.classList.add(col)

                // make editable
                // TODO: move events outside in config
                if (this.options.editable) {
                    cell.setAttribute("contenteditable", "true")
                    // cell.addEventListener('click', (el: any) => this.onEdit(el))
                    cell.addEventListener('blur', (event: Event) => {
                        this.onEdit(event, keyOrIndex)
                    })
                    // cell.addEventListener('keyup', (el: any) => this.onEdit(el))
                    // cell.addEventListener('paste', (el: any) => this.onEdit(el))
                    // cell.addEventListener('input', (el: any) => this.onEdit(el))
                }

                let text = document.createTextNode(String(value));
                cell.appendChild(text);
            }
            // function to manipulate row from outside
            if (this.options.rowFunc) {
                // this.options.rowFunc(this, this.tableData, keyOrIndex, row)

                this.options.rowFunc(row, keyOrIndex as KeyOrIndex<Data>, this.tableData, this)
                // this.options.rowFunc(row, keyOrIndex as KeyOrIndex<Data>, this.tableData, this)

            }
            // collapsible Row:
            if (this.options.collapsible) {

                let rowHidden = this.tableHtml.insertRow();
                let cell = rowHidden.insertCell();
                cell.colSpan = Object.keys(this.header).length;
                cell.style.display = "none";

                // call callback function to fill the hidden cell
                this.options.collapsible(cell, keyOrIndex as KeyOrIndex<Data>, this.tableData)

                if (row) {
                    row.onclick = () => {
                        // toggle visibility
                        if (cell.style.display === "none") {
                            cell.style.removeProperty('display');
                        } else {
                            cell.style.display = "none";
                        }

                    }
                }
            }
        }
        this.changeColourEvenRows()
    }

    sortTable(n: number) {
        console.log('sorting the table')
        // Inserting more than one row is not rlly necessary.
        const rowOffset = this.options.collapsible ? 2 : 1

        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = this.tableHtml;
        switching = true;
        //Set the sorting direction to ascending:
        dir = "asc";
        /*Make a loop that will continue until
        no switching has been done:*/
        while (switching) {
            //start by saying: no switching is done:
            switching = false;
            rows = table.rows;
            /*Loop through all table rows (except the
                first, which contains table headers):*/

            for (i = 1; i < (rows.length - rowOffset); i = i + rowOffset) {
                //start by saying there should be no switching:
                shouldSwitch = false;
                /*Get the two elements you want to compare,
                one from current row and one from the next:*/
                x = rows[i].getElementsByTagName("td")[n];
                // +2 because of the collapsible rows
                y = rows[i + rowOffset].getElementsByTagName("td")[n];

                var cmpX = isNaN(parseFloat(x.innerHTML)) ? x.innerHTML.toLowerCase() : parseFloat(x.innerHTML);
                var cmpY = isNaN(parseFloat(y.innerHTML)) ? y.innerHTML.toLowerCase() : parseFloat(y.innerHTML);

                // NOTE: idk when this occours? with parseFloat or lowercase??
                cmpX = (cmpX == '-') ? 0 : cmpX;
                cmpY = (cmpY == '-') ? 0 : cmpY;
                /*check if the two rows should switch place,
                based on the direction, asc or desc:*/
                if (dir == "asc") {
                    if (cmpX > cmpY) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (cmpX < cmpY) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                /*If a switch has been marked, make the switch
                and mark that a switch has been done:*/
                rows[i].parentNode?.insertBefore(rows[i + rowOffset], rows[i]);
                if (rowOffset == 2) {
                    // also move the hidden row
                    rows[i].parentNode?.insertBefore(rows[i + rowOffset + 1], rows[i + 1]);
                }
                switching = true;
                //Each time a switch is done, increase this count by 1:
                switchcount++;
            } else {
                /*If no switching has been done AND the direction is "asc",
                set the direction to "desc" and run the while loop again.*/
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }

    changeColourEvenRows() {
        if (this.options.alternateColour == false) return
        var rows = this.tableHtml.rows
        var cnt = 0
        for (let i = 0; i < rows.length; i++) {
            // only count visible rows
            if (!(rows[i].cells[0].style.display == "none")) {
                rows[i].style.removeProperty('background-color');

                // set custom colour for every other row 
                if (cnt % 2 == 0) rows[i].style.backgroundColor = this.tableStyle.custom.evenRows;
                cnt++
            }
        }
    }
}
