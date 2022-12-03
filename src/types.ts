import { Table } from "./table";

// basic dictionary type:
export interface Dict<TValue> {
    [id: string]: TValue;
}

// TODO: implement checkbox etc. for bool
export type RowData = Dict<number | string | boolean>

export type TableData = RowData[] | Dict<RowData>;



let data: TableData = [
    { col1: "val1" },
    { col2: "val2" }
]
let data2: TableData = {
    asfd: { col1: "val1" },
    asdf2: { col2: "val2" }
}

let data3 = [
    ["r1col1", "r1col2"],
    ["r2col1", "r2col2"]
]





export interface TableParams<Data extends TableData> {
    container: TableContainer,
    header?: Dict<string>,
    data: Data,
    options?: TableOptions<Data> | {}
}

// used for callback functions to hint the correct index type
export type KeyOrIndex<data> = data extends Array<RowData> ? number : string;

type FilterConfig = Dict<any> // todo

export type EditOptions = {

    editable?: OnEditFunc | true
    extendableRows?: boolean
} | {
    editable?: false
    extendableRows?: false
}


/**
 * optional table Params
 * TODO: document params
 */
export interface TableOptions1<Data extends TableData> {
    // edit?: edit
    tableStyle?: Dict<Dict<string>>,
    alternateColour?: boolean //default true
    // todo: these fk up the call method used for passing this context
    // transformData?: RowFunc<Data>,
    // rowFunc?: RowFunc<Data>,
    // collapsible?: CollapsibleRowFunc<Data>,
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
    showRules?: boolean
    // editable?: OnEditFunc | true | false
    // extendableRows?: asdf
}

export type TableOptions<Data extends TableData> = TableOptions1<Data> & EditOptions


// TODO, ASK: should the Data be passed as an immutable type in the beginning and then only in the table set data methode be casted?? 
// propably, now its still mutable thru the variable thats passed into the table
// Pass data back to callbacks, but its readonly and has to be set thru an update functions that also updates the dom accordingly.
type ROData<Data> = Data extends Array<infer RowData> ?
    Readonly<RowData>[] :
    Data extends Dict<infer RowData> ?
    Dict<Readonly<RowData>> : never;



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

export type TableContainer = HTMLTableElement | HTMLDivElement | string | undefined | null

/**
 * 1. default or empty {}
 * 
 *      auto detect based on data provided
 * 
 * 2. Object where:
 * 
 *      keys - relate to the data field
 * 
 *      values - display name
 * 
 * 3. false: no header
 */
export type TableHeader = Dict<string> | false

let header = { col1: "col1", col2: "col2" }
let header2 = ["col1", "col2"]