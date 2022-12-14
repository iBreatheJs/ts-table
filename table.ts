
// TODO: load css file thats shipped with lib, or make that nicer to set up
// console.log("document.styleSheets")
// console.log(document.styleSheets)
// var style = document.createElement('style');
// style.type = 'text/css';
// style.innerHTML = '.hidden { display: none; }';
// document.getElementsByTagName('head')[0].appendChild(style);

import { InputNice } from "../input-nice/inputNice";


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
    return test.tagName == "TABLE";
}
function isHTMLDivElement(test: any): test is HTMLDivElement {
    return test.tagName == "TABLE";
}

function isHtmlElement(test: any): test is HTMLElement {
    return test.tagName;
}

// Types:
interface Dictionary<TValue> {
    [id: string]: TValue;
}

interface DictRO<T> {
    readonly [id: string]: T;
}

type ColType<Data, T> = Data;


// TODO: implement checkbox etc. for bool
export type RowData = Dictionary<number | string | boolean>

export type TableData = RowData[] | Dictionary<RowData>;

// used for callback functions to hint the correct index type
export type KeyOrIndex<data> = data extends Array<RowData> ? number : string;

type FilterConfig = Dictionary<any> // todo


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
    filter?: boolean | {
        filterConfig?: FilterConfig
        /* {
            |
            custom: {
                // todo low: add cb functions for custom filters if necessary for sth at all  
                // cb to define literal, string, num or whatever 
            }
        } */
    },
    search?: boolean
    rowCount?: boolean
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
    private filterConfig: FilterConfig | null
    public initialized: boolean;

    private searchHtml: HTMLInputElement | null;
    private rowCntHtml: HTMLDivElement | null;



    /**
     * 
     * @param tableHtml 
     * @param header Key = name of associated data field, value = display name
     * @param tableData 
     * @param options 
     */
    constructor(container: HTMLTableElement | string | undefined | null, header: Dictionary<string>, tableData: Data, options: TableOptions<Data> = {}) {

        this.tableHtml = this.getOrCreateTableHtml(container ?? null)
        this.header = header
        // this._tableData = tableData
        this.tableData = tableData
        this.options = options

        this.tableStyle = options?.tableStyle || tableStyle

        this.initialized = false

        // this.rowCntHtml = this.options.rowCount != false ? (() => {
        //     let rowCntHtml = document.createElement("div");
        //     rowCntHtml.id = this.tableHtml.id + "_row-counter";
        //     rowCntHtml.innerHTML = String(this.tableData.length)
        //     return rowCntHtml
        // })(): null

        this.rowCntHtml = null;
        this.searchHtml = null;
        // this.drawTable()
    }

    // call this when draw is called. so the properties can be set after initializing the table which makes type checkiing nicer
    secondConstructor() {
        // check once here or every time where now if(!this.filterConfig)
        // would only make sense if the filter can be removed and the table does not re-draw
        this.filterConfig = (typeof (this.options.filter) == "object" && this.options.filter.filterConfig) ? this.options.filter.filterConfig : null
    }


    /**
     * 
     * @param container  
     *      @type {HtmlTableElement} - use provided table
     *      @type {string} - create table if no table, create table in div if div
     *      @type {undefined} - create table, dev has to add to dom //todo
     * @returns 
     */
    getOrCreateTableHtml(container: HTMLTableElement | string | null) {
        var tableHtml: HTMLTableElement

        // if NO container - create ONLY in memory and auto assign name as "table_<num>" 
        if (!container) {
            let num = 1
            // get consecutive ID which is not in use alread
            while (document.getElementById("table_" + num)) {
                num++
            }
            container = "table_" + num
            console.warn('created Table WITHOUT CONTAINER as "' + container + '", needs to be added to DOM manually or instantiate with valid id')
        }

        console.log("penene")
        // param is table
        if (isHTMLTableElement(container)) {
            return container;
        }
        //  else if (isHTMLDivElement(container)) {
        //     // tableHtml = container;
        //     // todo handle div
        //     throw "todo handle div as tableHtml param"
        // }
        else if (container === "null") {
            // todo already handled above
            // param is undefined
            // table is created but needs to be manually added to dom
            // id also has to be set on implementation side if needed
            tableHtml = document.createElement("table");

        } else if (typeof container === "string" || isHtmlElement(container)) {
            // param is string or HtmlElement
            // check if exists, if not create

            let html = document.getElementById(container)
            // let tableIdString = container
            // var htmlById = document.getElementById(container)
            var tagName = html?.tagName
            if (tagName === "TABLE") {
                return html
            } else {
                // cases:
                //  string
                //      existing
                //          table
                //          div
                //      new
                //  div
                let tableHtml = document.createElement("table");
                tableHtml.setAttribute("id", container)
                if (tagName === "DIV") {
                    htmlById?.appendChild(tableHtml)
                }
            }
        }
        else {
            new ReferenceError("Table cant be initialized with provided html Element.")
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

        let inputConf = {}
        let input = new InputNice(cell, inputConf)

        // when getting row index from table, substract header rows
        // todo: do that everywhere or keep as class property
        let theadRowCnt = this.tableHtml.tHead?.rows.length
        let rowIndexData = row.rowIndex - (theadRowCnt ?? 0)

        var valNew = cell.innerHTML

        TODO: //left of here.. updates 2 rows above some index error..

        //TODO: atm onclick set the data for the clicked, then transform data, from there set all fields of the row
        // this.tableHtml.tHead = null
        // this.drawTable()
        // return
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
        console.debug("draw Table " + (this.tableHtml.id != '' ? this.tableHtml.id : "with no id - consider setting an ID before table.drawTable()") + " with " + this.tableData.length + " rows");

        // call these things here so i can set them after new Table and before drawing
        // TODO: check if this makes sense
        this.secondConstructor()

        // check if table exists in DOM
        setTimeout(() => {
            if (!document.getElementById(this.tableHtml.id)) console.warn("Table " + this.tableHtml.id + " was drawn 5s ago, but does not exist on DOM, verify tableHtml param or add manually");
        }, 5000);
        // if (!document.getElementById(this.tableHtml.id)) console.error("Table " + this.tableHtml.id + " should bo added to DOM before it can be drawn, verify tableHtml param or add manually");

        // set to true once table is drawn
        if (this.initialized) console.warn("TODO: Possible error? drawTable should not be usded to update the table! " +
            "Instead use the update methode/s which aim to keep the data object, tablecells and its dependent fields in sync")


        // always enclose table in div necessary for positioning overlay for auto compleate suggestions
        // possibly todo check with grid module: if parent is body the div gets added at the bottom which moves everything defined below in html file above
        this.tableHtml.style.position = "absolute"
        if (!this.tableHtml.closest("div")) {
            let parent = this.tableHtml.parentNode
            if (parent) {
                let div = document.createElement("div");
                div.setAttribute("id", this.tableHtml.id + "-div")
                div.style.position = "relative"
                parent.appendChild(div)
                div.appendChild(this.tableHtml)
            } else {
                throw ("cant create parent div for table " + this.tableHtml.id + " no parentNode found")
            }
        }

        // HEADER
        console.log(this.tableHtml)
        let thead = this.tableHtml.createTHead();

        // insert searchbar in header if option is checked
        let searchRow = thead.insertRow();
        let searchCell = document.createElement("td");
        searchCell.setAttribute("colspan", String(Object.keys(this.header).length))
        searchRow.append(searchCell)


        if (this.options.search) {

            let searchInput = document.createElement("input");
            searchInput.type = "text";
            searchInput.placeholder = "Searcg for anything in Row or filter";
            searchInput.id = this.tableHtml.id + "_search"
            searchInput.style.float = "left"; // todo better style wo float

            let searchVal = "";
            searchInput.onkeyup = (ev) => {
                if (searchInput.value === searchVal) return;

                let filter = {
                    val: searchInput.value,
                    include: searchInput.value < searchVal ? true : false // true -> deleted char -> include hidden rows(depending on other filters), false - added char --> narrow / remove visible rows
                }
                searchVal = searchInput.value;

                this.filter_oneAtATime(filter)

            }
            searchCell.append(searchInput)
        }

        // i'll leave this check here instead of constructor so the table can be redrawn with diffrent params - idk if theres a case for that tho
        if (this.options.rowCount != false) {
            this.rowCntHtml = document.createElement("div");
            this.rowCntHtml.id = this.tableHtml.id + "_row-counter";
            this.rowCntHtml.innerHTML = String(this.tableData.length)
            searchCell.append(this.rowCntHtml)
        }




        // insert filter box in header if option is checked
        var filterRow = null
        if (this.options.filter) {
            filterRow = thead.insertRow();
        }

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


        let tbody = this.tableHtml.createTBody();

        // TODO: check this here y did i not put it in the function??
        // for in returns key (and also Array index) as string
        for (keyOrIndex in this.tableData) {

            // convert string to number for tsc - only necessary when checking for types when indexing data (arr/dict)
            // tried a million years and approches but there is not satisfying way to make ts understand it, it seems
            // TODO document in md
            if (isArray(this.tableData)) keyOrIndex = +keyOrIndex; //!!!!

            this.addRow(tbody, keyOrIndex)
        }

        // filter box for this table
        if (filterRow) {
            this.addFilterBox(filterRow)
        }
        // TODO: when is this used? while buildigng sdlfjs;fdl
        this.initialized = true
        this.changeColourEvenRows()
    }

    addRow(tbody: HTMLTableSectionElement, keyOrIndex: string | number) {
        let row = document.createElement("tr");

        // transform row data, called for each row TODO: that good here or call once and set all
        if (this.options.transformData) {
            this.transformData(row, keyOrIndex as KeyOrIndex<Data>)
            // this.options.transformData(row, keyOrIndex as KeyOrIndex<Data>, this.tableData, this)
        }

        // generate columns
        for (const col in this.header) {

            let value: string;

            // @ts-ignore
            // for-in and Object.Keys return elements as string, 
            // if Array its certenly a number; if Dict its definitely a string
            // nice and easy js solution:
            // 
            // keyTableData is a special col that is associated with the key of the object that contains the rest of the cols as values
            value = col == 'keyTableData' ? keyOrIndex : this.tableData[keyOrIndex][col];

            var cell = document.createElement("td");

            // TODO: Test performance difference with concated string 
            // also create rows first then render in one go, createElement for cols instead of insertCell already makes a difference

            // set same class for each cell in a col, TODO: remove bc possible collisions except I find a valid usecase 
            cell.classList.add(col)

            // make editable
            // TODO: move events outside in config
            if (this.options.editable) {
                cell.setAttribute("contenteditable", "true")
                cell.addEventListener('blur', (event: Event) => {
                    this.onEdit(event, keyOrIndex)
                })
                // more events but blur might be all thats needed
                // cell.addEventListener('click', (el: any) => this.onEdit(el))
                // cell.addEventListener('keyup', (el: any) => this.onEdit(el))
                // cell.addEventListener('paste', (el: any) => this.onEdit(el))
                // cell.addEventListener('input', (el: any) => this.onEdit(el))
            }

            let text = document.createTextNode(String(value));
            cell.appendChild(text);
            row.appendChild(cell)
        }
        // add row to table body
        tbody.appendChild(row)
        // this.tableHtml.tBodies[0].appendChild(row)

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



    addFilterBox(filterRow: HTMLTableRowElement) {
        console.log("add filter box for table " + this.tableHtml.id)

        let config;
        if (this.filterConfig) {
            config = this.filterConfig
        }
        else if (this.options.filter == true) {
            // TODO detect reoccuring values and provide filter
        }
        else {
            console.error("this should not happen, filters should not be activiated for this table right?")
        }

        console.log("filter config")
        console.log(config)

        // insert filters in cols
        for (let key in this.header) {
            let filterCol = document.createElement("td");

            let type = config[key]
            if (typeof type == "object") {
                // string literal filter
                // TODO low: add custom filter cb 
                // if (this.options.filter.custom) {}

                // invert selection
                let divInvert = document.createElement("div");
                divInvert.innerHTML = "invert"
                filterCol.append(divInvert)

                for (const val of Object.keys(type)) {
                    let div = document.createElement("div");
                    div.innerHTML = val
                    div.classList.add("table-filter-literal")
                    div.addEventListener("click", () => this.onSwitchfilter(div, val, key))
                    filterCol.append(div)
                }
            } else if (type === "number") {
                // range filter
                let inputBottom = document.createElement("input");
                let inputTop = document.createElement("input");
                inputBottom.placeholder = "min val"
                inputTop.placeholder = "max val"
                inputBottom.classList.add("table-filter-range")
                inputTop.classList.add("table-filter-range")

                filterCol.append(inputBottom, " < x < ", inputTop)


            } else if (type === "string") {
                // search filter
                let searchInput = document.createElement("input");
                searchInput.placeholder = "filter " + key
                searchInput.classList.add("table-filter-search-col")
                filterCol.append(searchInput)

            } else {
                // todo: handle undefined
                // throw "filter config has invalid values in col " + key
            }
            // let text = document.createTextNode(type);
            // filterCol.appendChild(text);
            filterRow.appendChild(filterCol);
        }


    }

    onSwitchfilter(divHtml: HTMLDivElement, filterVal: string, colKey?: string) {
        // todo, idea maybe build data graph with filter values use it to import the possibilities instead of array and to store the state for custom tables

        let include = !divHtml.classList.toggle("table-filter-val-exclude")

        if (this.filterConfig && colKey) {
            // set filter state in filterconfig (filter enabled / disabled) 
            this.filterConfig[colKey][filterVal] = include;
        }

        console.log("swithced filter")
        console.log(this.filterConfig)

        let filter = {
            val: filterVal,
            include: include
        }

        this.filter_oneAtATime(filter, colKey)
    }

    // onSearch(input: HTMLInputElement) {

    //     let filter = input.value.toLowerCase();
    //     let rowsT = this.tableHtml.tBodies[0].rows
    //     var cells, txtValue;
    //     console.time('test');
    //     for (let i = 0; i < rowsT.length; i++) {
    //         // console.log(rowsT[i])
    //         var rowVisible = false

    //         cells = rowsT[i].getElementsByTagName("td");
    //         for (let j = 0; j < cells.length; j++) {
    //             let cell = cells[j]

    //             if (cell) {
    //                 txtValue = cell.textContent || cell.innerText;
    //                 let cellVal = txtValue.toLowerCase().replace(",", "")
    //                 if (cellVal.indexOf(filter) > -1) {
    //                     rowVisible = true
    //                     break;
    //                 }
    //             }
    //         }

    //         if (rowVisible == false) {
    //             rowsT[i].style.display = "none";
    //         }

    //     }
    //     console.timeEnd('test');
    // }

    // combined filter, applies every filter and search input 
    // filter_searchAndFilters(input: HTMLInputElement) {
    filter_byConfig(filter?: { val: string, include: boolean }, colKey?: string) {
    }

    /**
     * @description takes one change in filter config 
     * loop over all entries and hide / show
     * @param filter 
     * @param filter.val value for comparison
     * @param filter.include true = filter removed, false = filter applied //wether row with matching val should be included or removed
     * @param colKey if not set -> all cols - equivalent to search
     */
    filter_oneAtATime(filter: { val: string, include: boolean }, colKey?: string) {
        // function is triggered when a filter changes and the change gets applied
        // executed for EVERY change in filter config - one change at a time
        // 
        // filter is ether:
        //      - col specific
        //      - all cols - search
        // 
        // narrow or widening is considered here.
        // only bother with rows not included if filter gets removed / widening
        // 
        // DOM manipulation:
        // All possible rows, stored in tableData, are created and depending on filtering
        // with CSS display property hidden.
        // 
        // Thoughts:
        // TODO: ASK: integrate some type of interrupt, webworkers, timeout, etc for when filters r set fast and tables r big
        // different cases and, exiting loops etc is pretty well considered i think, but sadly its compleately negligible in comparison to painting the dom.
        // this is the real bottleneck 
        // had a lot of thoughts on paging n caching etc. but might just be enough to keep everything in mem to sort n filter but limit rendered results to eg 50 row page which renders fast af. 

        console.log(filter)

        // triggered by search:
        // no colKey - check EVERY col till val found --> then include the row
        // include true - widen - check hidden rows for filter.val
        // include false - narrow - check visible rows for filter.val


        // if search input:
        //      add search string as filter to visible rows
        let search = this.searchHtml

        let rowsT = this.tableHtml.tBodies[0].rows
        let rowsD = this.tableData
        console.time('test');

        // check each row:
        // todo change to data instead of dom and benchmark
        for (let i = 0; i < rowsT.length; i++) {
            if (Array.isArray(rowsD)) {

                let rowD = rowsD[i]
                // skip row if current filter does not match
                if (colKey) {
                    let val = rowD[colKey]
                    if (val != filter?.val) continue;
                }

                let rowT = rowsT[i]

                // rows affected by filter modification:
                // case 1: row is hidden and filter gets removed
                //      check wether it should be made visible
                // case 2: row is visible and filter gets applied
                //      check if filter.incude is false -> hide


                // case 1: row is hidden but filter says show it:
                if ((rowT.style.display === "none" && filter.include === true)) {
                    // console.log("removed filter")
                    if (!this.filterConfig) throw new Error("cant filter, No Filter Config")

                    // depending on other filters, re-enable row
                    var rowVisible = true
                    // set true when search val is found in row or no search val
                    var rowVisibleSearch = search?.value ? false : true;

                    //todo
                    // check if any other filter is false --> hide
                    //      if yes - continue dont bother search val
                    //      if not - check all cols for search val


                    for (let col in this.header) {
                        // already checked before, but idk if this if helps at all todo
                        // if(col === colKey) continue;

                        // SEARCH
                        // check cols for searchstring until found --> then know its not hidden --> unhide
                        if (search?.value && rowVisibleSearch === false) {
                            console.log("filter search")
                            let searchVal = search.value.toLocaleLowerCase();
                            let cellVal = String(rowD[col])

                            cellVal = cellVal.toLowerCase().replace(",", "")
                            if (cellVal.indexOf(searchVal) > -1) {
                                rowVisibleSearch = true
                                // break;
                            }
                        }

                        // OTHER FILTERS
                        // check if any filter hides row --> then break and keep hidden
                        let filterConfCol = this.filterConfig[col]
                        if (!filterConfCol) continue;

                        let cellVal = rowD[col]

                        // check for filter till filter matches --> then hide
                        if (typeof filterConfCol == "object" && rowVisible) { // todo
                            for (const literal in filterConfCol) {
                                const include = filterConfCol[literal];
                                // if exclude - compare with actual value in cell - if match remove row 

                                if (include) continue;
                                if (literal === cellVal) { rowVisible = false; break; }
                            }
                            // if (!rowVisible) break;

                        } else if (filterConfCol === "number") {

                        } else if (filterConfCol === "string") {

                        } else {
                            console.log(rowVisible)

                            // todo: handle undefined
                            throw "filter config has invalid values in col " + col
                        }

                        // if(!rowVisible || rowVisibleSearch) break;
                        if (!rowVisible) break;
                    }

                    // re-enable row , todo move out of if
                    if (rowVisible && rowVisibleSearch) {
                        rowsT[i].style.display = "";
                    } else {
                        // todo shouldnt be here should be iin funct
                        // rowsT[i].style.display = "none";
                    }

                } else if (rowT.style.display == "" && filter.include === false) {
                    // this row should be excluded and colKey matches value (checked at start of fumc)
                    if (colKey) {
                        rowT.style.display = "none";
                        continue;
                    }
                    console.log("should be search only")

                    let rowVisibleSearch = false
                    // search text was appended
                    for (let col in this.header) {
                        // already checked before, but idk if this if helps at all todo
                        // if(col === colKey) continue;

                        // check cols for searchstring until found --> then know its not hidden --> unhide
                        if (rowVisibleSearch === false) {
                            console.log("filter search")
                            let searchVal = search.value.toLocaleLowerCase();
                            let cellVal = String(rowD[col])


                            cellVal = cellVal.toLowerCase().replace(",", "")
                            if (cellVal.indexOf(searchVal) > -1) {
                                console.log(cellVal + "cellval u searchval" + searchVal)
                                rowVisibleSearch = true
                                break;
                            }
                        }
                    }

                    if (!rowVisibleSearch) {
                        console.log("row true")
                        rowsT[i].style.display = "none";
                    }

                }
            }
        }

        // visible row number:
        // todo
        // could work that into the above loop, but for some reason when testing it is even slower without this extra loop than with it?? wtf!! and if not it still doesnt matter bc slow af rendering taking 100x of script
        // todo check with option to disable row cnt. i think it will not create the html n therefore not execute here 
        if (this.rowCntHtml) {
            let cntRowsVisible = 0
            for (let i = 0; i < rowsT.length; i++) {
                let rowT = rowsT[i]
                if (rowT.style.display == "") {
                    cntRowsVisible++
                }
            }
            this.rowCntHtml.innerHTML = String(cntRowsVisible) + " / " + String(rowsT.length)
        }
        console.timeEnd('test');
    }

    filter(filterVal?: string, colKey?: string) {
        console.log("colKey")
        console.log(filterVal)
        // implemented for array, todo: implement all that shit for dict or just map it
        if (Array.isArray(this.tableData)) {
            // by col and bool selection
            if (colKey && filterVal) {

                // go thru data and filter
                var rowNr = 0
                var hitNr = 0
                var rowsT = this.tableHtml.tBodies[0].rows // rowT - html, rowD - data
                console.log("rowsT.length")
                console.log(rowsT.length)
                for (const rowD of this.tableData) {
                    let val = rowD[colKey]
                    let rowT = rowsT[rowNr]
                    // console.log(row)
                    if (val === filterVal) {
                        console.log(rowT.style.display)
                        if (rowT.style.display == "none") {
                            rowT.style.display = ""
                        } else {
                            rowT.style.display = "none"
                        }

                        hitNr++
                    }
                    rowNr++
                }

            }
            // todo: by string or num range, by col or whole thing
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
            // only rows in body, leave header rows out of it
            rows = table.tBodies[0].rows;

            /*Loop through all table rows (except the
                first, which contains table headers):*/

            for (i = 0; i < (rows.length - rowOffset); i = i + rowOffset) {
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
