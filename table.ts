
// TODO: load css file thats shipped with lib, or make that nicer to set up
// console.log("document.styleSheets")
// console.log(document.styleSheets)
// var style = document.createElement('style');
// style.type = 'text/css';
// style.innerHTML = '.hidden { display: none; }';
// document.getElementsByTagName('head')[0].appendChild(style);

// document.getElementById('someElementId').className = 'cssClass';



/**
 * basic table style
 * can be modified and passed to table
 * 
 * INFO: not implemented!! 
 * its just easier to use a css file with different classes
 * TODO: might be nice in some cases to setup without css, and easy to modify specific style params programmatically without setting classes
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

function isHTMLTableElement(test: any): test is HTMLTableElement {
    return test?.tagName;
}

// Types:
interface Dictionary<TValue> {
    [id: string]: TValue;
}

interface DictRO<T> {
    readonly [id: string]: T;
}


// TODO: implement checkbox etc. for bool
export type RowData = Dictionary<number | string | boolean>

export type TableData = RowData[] | Dictionary<RowData>;

// used for callback functions to hint the correct index type
export type KeyOrIndex<data> = data extends Array<RowData> ? number : string;


/**
 * optional table Params
 * TODO: document params
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

// TODO, ASK: should the Data be passed as an immutable type in the beginning and then only in the table set data methode be casted?? 
// propably, now its still mutable thru the variable thats passed into the table
// Pass data back to callbacks, but its readonly and has to be set thru an update functions that also updates the dom accordingly.
type ROData<Data> = Data extends Array<infer RowData> ?
    Readonly<RowData>[] :
    Data extends Dictionary<infer RowData> ?
    Dictionary<Readonly<RowData>> : never;


// TODO: ?make RowFunc more generic and use for all callbacks, htmlElement, data, table ref
// TODO make tableData private bzw. test what happens when accessed thru table param / ?table param improvement or unncessary
export interface RowFunc<Data extends TableData> {
    (
        rowHtml: HTMLTableRowElement,
        keyOrIndex: KeyOrIndex<Data>,
        tableData: ROData<Data>,
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
        keyOrIndex: KeyOrIndex<Data>,
        tableData: ROData<Data>,
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
export class Table<Data extends TableData>{
    public tableHtml: HTMLTableElement;
    private header: Dictionary<string>;
    readonly tableData: Data;
    // private _tableData: Data;
    public options: TableOptions<Data>;
    private tableStyle: Dictionary<Dictionary<string>>;
    public initialized: boolean;

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
    constructor(tableHtmlOrString: HTMLTableElement | string | undefined, header: Dictionary<string>, tableData: Data, options: TableOptions<Data> = {}) {

        this.tableHtml = this.getOrCreateTableHtml(tableHtmlOrString)
        this.header = header
        // this._tableData = tableData
        this.tableData = tableData
        this.options = options
        this.tableStyle = options?.tableStyle || tableStyle
        this.initialized = false
        // this.drawTable()
    }

    // TODO: getter, settter for tableData to update values in dom

    getOrCreateTableHtml(tableHtmlOrString: HTMLTableElement | string | undefined) {
        var tableHtml: HTMLTableElement

        if (isHTMLTableElement(tableHtmlOrString)) {
            tableHtml = tableHtmlOrString;
        } else if (typeof tableHtmlOrString === "undefined") {
            // table is created but needs to be manually added to dom
            // id also has to be set on implementation side if needed
            tableHtml = document.createElement("table");
        } else if (typeof tableHtmlOrString === "string") {
            let tableIdString = tableHtmlOrString
            var htmlById = document.getElementById(tableHtmlOrString)
            var tagName = htmlById?.tagName
            if (tagName === "TABLE") {
                tableHtml = htmlById as HTMLTableElement
            } else {
                tableHtml = document.createElement("table");
                tableHtml.setAttribute("id", tableIdString)
                if (tagName === "DIV") {
                    htmlById?.appendChild(tableHtml)
                }
            }
        }
        else {
            throw new ReferenceError("Table cant be initialized with provided html Element.")
        }
        return tableHtml
    }

    getDataByIndex(row: number, col: number) {

        // TODO implement for dict
        // todo change data type with infer and refactor these array checks
        if (Array.isArray(this.tableData)) {
            return this.tableData[row - 1][Object.keys(this.header)[col]]
        }
    }
    // TODO: args any just keys of data, return type also whatever is possible on specific data
    // setDataByIndex(rowIndexData: number, colKeyOrIndex: number | string, data: number | string | ((...args: any) => number | string)) {
    setDataByIndex(rowIndexData: number, colKeyOrIndex: number | string, data: number | string) {
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
    // TODO: private?
    public updateTableValues(rowIndexData?: number, colIndex?: number, colStr?: string) {

        // TODO: atm if table already rendered, render the row
        if (this.initialized) {
            colIndex = undefined;
            colStr = undefined;
        }
        // check data structure
        if (Array.isArray(this.tableData)) { //TODO!!! check dependency fields
            let rows = this.tableHtml.rows

            // if row, col param updat only what is necessary
            if (rowIndexData != undefined && colIndex != undefined && colStr != undefined) {
                console.log("update table value")
                // index in table is shifted by 1 bc of header
                let rowIndexTable = rowIndexData + 1;

                let cell = rows[rowIndexTable].cells[colIndex]
                cell.innerHTML = String(this.tableData[rowIndexData][colStr])
                return
            }

            // data starting with index 0, table starting with index 1 because 0 is the header
            let rowIndex = rowIndexData != undefined ? rowIndexData + 1 : 1
            let rowIndexEnd = rowIndexData != undefined ? rowIndexData + 2 : rows.length

            // update all cells / one specific row
            console.log(rowIndexData === undefined ? "update ALLL table values" : "update table Row " + rowIndex)

            // starting with index 1; 0 is the header
            for (rowIndex; rowIndex < rowIndexEnd; rowIndex++) {
                const row = rows[rowIndex];

                let cells = row.cells

                for (let colIndex = 0; colIndex < cells.length; colIndex++) {
                    const cell = cells[colIndex];
                    // cell.classList.add("bluee")

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

    // TODO: implement this feature to update dependent cells on edit etc, visualize affected fields
    // colExp: (...args: any) => number = (args) => {
    //     var d = tableData[keyOrIndex]

    //     console.log(args)
    //     let cost = d[args.vol] * d[args.price]

    //     // when table is already rendered update the cells
    //     if(tableTrades.initialized){
    //       tableTrades.
    //     }
    //     return cost
    //   }

    // update cell value
    // TODO: maybe more params could be needed outside in the callback, eg. pass table
    onEdit(event: Event, keyOrIndex: string | number) {
        let cell = event.currentTarget as HTMLTableCellElement
        let row = cell.parentElement as HTMLTableRowElement

        let cellIndex = cell.cellIndex

        // when getting index from table, -1 because of header
        let rowIndexData = row.rowIndex - 1

        var valNew = cell.innerHTML

        //TODO: atm onclick set the data for the clicked, then transform data, from there set all fields of the row
        this.tableHtml.tHead = null
        this.drawTable()
        return
        this.setDataByIndex(rowIndexData, cellIndex, valNew)
        this.transformData(row, rowIndexData)

        // ASK: pass row, cell as index html or string??
        if (this.options.editable && typeof this.options.editable === "function")
            this.options.editable(row, cell, this.tableData);

        // if (this.options.transformData) {
        //     this.options.transformData(row, keyOrIndex as KeyOrIndex<Data>, this.tableData, this)
        // }

    }

    addRowOnTop(data: RowData) {

    }

    transformData(row: HTMLTableRowElement, keyOrIndex: string | number) {
        if (this.options.transformData) {
            this.options.transformData(row, keyOrIndex as KeyOrIndex<Data>, this.tableData as unknown as ROData<Data>, this)
        }

    }

    drawTable() {
        // console.debug("draw Table " + this.tableHtml.id != '' ? this.tableHtml.id : "no id - consider setting an ID before table.drawTable()");
        console.debug("draw Table " + (this.tableHtml.id != '' ? this.tableHtml.id : "with no id - consider setting an ID before table.drawTable()"));
        // console.debug('draw Table ' + this.tableHtml.id);
        if (this.initialized) console.warn("TODO: Possible error? drawTable should not be usded to update the table! " +
            "Instead use the update methode/s which aim to keep the data object, tablecells and its dependent fields in sync")

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
            if (isArray(this.tableData)) keyOrIndex = +keyOrIndex; //!!!!

            this.addRow(keyOrIndex)
        }
        // TODO: when is this used? while buildigng sdlfjs;fdl
        this.initialized = true
        this.changeColourEvenRows()
    }

    addRow(keyOrIndex: string | number) {
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

            // set same class for each cell in a col, TODO: remove bc possible collisions except I find a valid usecase 
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
        // function to manipulate row from outside, after it is rendered!
        if (this.options.rowFunc) {
            this.options.rowFunc(row, keyOrIndex as KeyOrIndex<Data>, this.tableData as unknown as ROData<Data>, this)
        }
        // collapsible Row:
        if (this.options.collapsible) {

            let rowHidden = this.tableHtml.insertRow();
            let cell = rowHidden.insertCell();
            cell.colSpan = Object.keys(this.header).length;
            cell.style.display = "none";

            // call callback function to fill the hidden cell
            this.options.collapsible(cell, keyOrIndex as KeyOrIndex<Data>, this.tableData as unknown as ROData<Data>)

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
