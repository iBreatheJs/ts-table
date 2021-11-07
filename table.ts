
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

// type TableData<T> = Dictionary<T> | T[];
// type TableData = Dictionary<Dictionary<number | string>> | Dictionary<number | string>[]
// TODO: implement checkbox etc. for bool
export type RowData = Dictionary<number | string | boolean>
//  | TableDataExt<Data>;
// type TableData = Dictionary<Dictionary<number | string>> | Dictionary<number | string>[] | TableDataExt<Data>;
// type TableDataTest<Data extends DataDict> = Dictionary<Data> | Data[];

export type TableData2<T> = T extends Array<any> ? RowData[] : Dictionary<RowData>;

// export type TableData = Dictionary<RowData> | RowData[];
export type TableData = TableDataDict | TableDataArr;

type TableDataDict = {
    data: Dictionary<RowData>
    index: string
}
type TableDataArr = {
    data: RowData[]
    index: number
}





export type KeyOrIndex<data> = data extends Array<any> ? number : string;

var test1 = {
    asdf: {
        par1: 1,
        par2: 2
    }
}


var asdf: TableData2<typeof test1>
var asdf2: TableData2<typeof test2>

var test2 =
    [
        {
            par1: 1,
            par2: 2
        }
    ]


export type ArrOrDict<T> = T extends Array<any> ? any[] : never;



// function test(arrOrDictParam:any[] | Dictionary<any>) {
// type asdf = ArrOrDict<typeof arrOrDictParam>       
// var asdfff: asdf = arrOrDictParam[9] 
// }

export interface TradeMin {
    time: number,
    vol: number,
    price: number,
    cost: number,
    id: number // uniqe among trades of same asset pair
}


// export type Trade = Dictionary<string | number> & { potentialBuys?: Trades, specPeriod?: Trades } & TradeMin


/**
 * optional Params for style / table feature
 */
export interface TableOptions<Data extends TableData> {
    tableStyle?: Dictionary<Dictionary<string>>,
    alternateColour?: boolean //default true
    rowFunc?: RowFunc<Data>,
    collapsible?: CollapsibleRowFunc<Data>,
    sortable?: { // TODO: add 3rd value to header that is used for sorting, eg. for time: display simple date format but calc with unix time stamp
        all: boolean,
        cols?: [string]
    },
    editable?: OnEditFunc
}

export interface RowFunc<Data extends TableData> {
    (
        rowHtml: HTMLTableRowElement,
        keyOrIndex: TableData['index'],
        // keyOrIndex: number | string,
        // keyOrIndex: KeyOrIndex<Data>,
        // keyOrIndex: Data extends Dictionary<any> ? string : number,
        tableData: Data['data'],
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
        keyOrIndex: Data['index'],
        tableData: Data['data'],
    ): void
}

export interface OnEditFunc {
    (
        event: Event,
        tableData: TableData['data'], //todo
    ): void
}



// ASK: can i configure private interfaces for the class
// that reference tableData without the need to always n everywherer pass the generic type
// var asdf : typeof Table= Table()
export class Table<Data extends TableData>{
    private tableHtml: HTMLTableElement;
    private header: Dictionary<string>;
    private _tableData: Data["data"];
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

    public get tableData() {
        return this._tableData
    }

    public set tableData(tableData) {
        console.log("setter table data")
        this._tableData = tableData;
        this.updateTableValues()
    }



    /**
     * 
     * @param tableHtml 
     * @param header Key = name of associated data field, value = display name
     * @param tableData 
     * @param options 
     */
    constructor(tableHtml: HTMLTableElement, header: Dictionary<string>, tableData: Data["data"], options: TableOptions<Data> = {}) {
        this.tableHtml = tableHtml
        this.header = header
        this._tableData = tableData
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
    setDataByIndex(row: number, col: number, data: number | string) {
        // TODO implement for dict
        if (Array.isArray(this.tableData)) {
            this.tableData[row - 1][Object.keys(this.header)[col]] = data

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

    updateTableValues() {
        // check data structure


        console.log("update table values")
        // console.log(this.tableData)

        if (Array.isArray(this.tableData)) {
            let rows = this.tableHtml.rows
            let headerKeys = Object.keys(this.header)

            // data starting with index 0, table starting with index 1 because 0 is the header
            let rowIndex = 1
            // starting with index 1; 0 is the header
            for (rowIndex; rowIndex < rows.length; rowIndex++) {
                const row = rows[rowIndex];
                // for (let rowIndex in rows) {
                // let row = rows[rowIndex]
                let cells = row.cells
                // console.log("rowwww data")
                // console.log(this.tableData)
                // console.log(rowIndex)
                // console.log(rows)
                for (let colIndex = 0; colIndex < cells.length; colIndex++) {
                    const cell = cells[colIndex];

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
        var asdf = this.tableData

        var keyOrIndex: TableData['index']

        type TableDataDict = {
            data: Dictionary<RowData>
            index: string
        }
        type TableDataArr = {
            data: RowData[]
            index: number
        }

        var test: {
            data: RowData[]
            index: number
        } |
        {
            data: Dictionary<RowData>
            index: string
        } = {
            data: this.tableData,
            index: "1"
        }



        interface Dictionary<TValue> {
            [id: string]: TValue;
        }

        
        type ArrWithCorrectIndex = {
            type: Array<any>
            index: number
        }
        
        type DictWithCorrectIndex = {
            type: Dictionary<any>
            index: string
        }
        type ArrOrDict = ArrWithCorrectIndex | DictWithCorrectIndex
        
        function arr(param: ArrWithCorrectIndex) {
            param.type[param.index]
        }
        function dict(param: DictWithCorrectIndex) {
            param.type[param.index]
        }
        function arrOrDict(param: ArrOrDict) {
            // Element implicitly has an 'any' type because expression of type 'string | number' can't be used to index type 'any[] | Dictionary<any>'.
            // No index signature with a parameter of type 'string' was found on type 'any[] | Dictionary<any>'.ts(7053)
            param.type[param.index]
        }

        

        type Index<T> = T extends Array<any> ? number : string
        
        function testt(param: Array<any> | Dictionary<any>) {
            var index :Index<typeof param> = Array.isArray(param) ? 0 : "0"
            param[param.index]
        }



        var keyOrIndex: number | string
        // var keyOrIndex: KeyOrIndex<Data>


        // for in returns key (and also Array index) as string
        for (keyOrIndex in this.tableData) {

            // convert string to number for tsc
            // if (isArray(this.tableData)) keyOrIndex = +keyOrIndexTmp;
            // keyOrIndex = (typeof keyOrIndex === "string") ? keyOrIndexTmp : Number(keyOrIndexTmp)
            if (isArray(this.tableData)) this.tableData.index = Number(keyOrIndex);
            // if (dataIsArray) (keyOrIndex as unknown as number) = +keyOrIndex
            // if (dataIsArray) keyOrIndex = +keyOrIndex;
            this.tableData["data"][this.tableData.index]
            // TODO y tf did i convert to number? sorting does not need it it seems

            let row = this.tableHtml.insertRow();

            for (const col in this.header) {
                let value

                // @ts-ignore
                // for-in and Object.Keys return elements as string, if Array its certenly a number
                // nice and easy js solution:
                // 
                // keyTableData is a special col that is associated with the key of the object that contains the rest of the cols as values
                value = col == 'keyTableData' ? keyOrIndex : this.tableData[keyOrIndex][col];

                // var wtf = this.tableData

                // var asdf: TableData2<typeof wtf> = this.tableData[0];
                // console.log(asdf)

                /* // --------------- TS struggles ---------------- TODO:
                                
                                // Array & not String   ok
                                // Array & String       nok
                                // Dict & String        ok
                                // Dict & not String    ok
                
                                // It is clear that it is a number by the time u know its an Array, so its a bunch of useless checks in a loop.
                                // Would be nice to have a feature to narrow / assign a type without being limited to the scope of an if-statement.
                                if (isArray(this.tableData)) {
                                    if (typeof keyOrIndex === "number")
                                        value = this.tableData[keyOrIndex][col];
                                } else {
                                    // keyTableData is a special col that is associated with the key of the object that contains the rest of the cols as values
                                    value = col == 'keyTableData' ?
                                        keyOrIndex :
                                        this.tableData[keyOrIndex][col];
                
                                    // same shit
                                    // value = this.tableData[keyOrIndex][col];
                                }
                
                                // THIS IS STUPID!! This would do it all without ts
                                // value = this.tableData[keyOrIndex][col];
                
                                // Interesting:
                                // https://stackoverflow.com/questions/46312206/narrowing-a-return-type-from-a-generic-discriminated-union-in-typescript
                
                                // --------------- TS struggles ----------------
                 */

                let cell = row.insertCell();
                // set id to col name, identification for table update
                // TODO: use id for each single celll or do it by class??
                // cell.id = col
                cell.classList.add(col)

                // make editable
                // TODO: move events outside in config
                const edi = this.options.editable
                if (this.options.editable) {
                    cell.setAttribute("contenteditable", "true")
                    // cell.addEventListener('click', (el: any) => this.onEdit(el))
                    cell.addEventListener('blur', (event: Event) => {
                        if (this.options.editable)
                            this.options.editable(event, this.tableData);
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

                this.options.rowFunc(row, keyOrIndex, this.tableData, this)
                // this.options.rowFunc(row, keyOrIndex as KeyOrIndex<Data>, this.tableData, this)

            }
            // collapsible Row:
            if (this.options.collapsible) {

                let rowHidden = this.tableHtml.insertRow();
                let cell = rowHidden.insertCell();
                cell.colSpan = Object.keys(this.header).length;
                cell.style.display = "none";

                // call callback function to fill the hidden cell
                this.options.collapsible(cell, keyOrIndex, this.tableData)

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
