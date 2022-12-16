import { addEvents } from "./events";
import { Table } from "./table";

// basic dictionary type:
export interface Dict<TValue> {
    [id: string]: TValue;
}

// TODO: implement checkbox etc. for bool
// undefined so u dont have to define cols which are empty in some rows
export type ColData = number | string | boolean | undefined

// performance, what i expect: best is array with fixed length, then known header, last is unknown length of each row 
// could have different implementation for drawing, but if u dont do it all in one go which is unnecessary complicated only have to iterate once before to get unique keys 
// ... and for drawing use the key lookup impl, or eventually array impl
export type RowData = Dict<ColData>
// obj format is nice because no order and empty fields
// export type RowData2 = Data2[]
// let data22 = [1,"dsdf", true]


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

// init this table so i can access the method types:
let container = "" as unknown as HTMLTableElement
let table = new Table(container, data)

type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P extends Table<infer X> ? X : P : never;
type extractGeneric<Type> = Type extends Table<infer X> ? X : never

// type extracted = extractGeneric<typeof table>



export type SortSig = Parameters<typeof table.sort>
export type AddEventSig<Data extends TableData> = Parameters<typeof addEvents>

export type SetArgsT = (event: Event, ...args: AddEventSig) => SortSig

// improve: type could depend on key
export type EventConfig = Dict<Dict<EventConfigEntry>>


// export type Actions = Dict<Dict<Action>>
// export type Actions = Dict<Action>
type EventT = "click" | "scroll"

export type ActionConfig = Dict<ActionConfigEntry>
// export type ActionConfig = {[id in ] Dict<ActionConfigEntry>}
interface ActionConfigEntry {
    args?: SetArgsT
    fn: Function
}
// export interface Action {
//     args?: SetArgsT
//     fn: Function
// }

// probably better to force type 
type Actions = keyof typeof table.actions; // list of literals used to address the action

interface EventConfigEntry {
    args?: SetArgsT,
    action: Actions
}



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
    eventConfig?: EventConfig
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
export type TableHeader = Dict<string>

let header = { col1: "col1", col2: "col2" }
let headerMulti = {
    col1: {
        col1sub: "col1sub1", col1sub2: "col1sub2"
    },
    col2: "col2"
}
let headerMultiArr = [
    {
        "col1": {
            col1sub: "col1sub1", col1sub2: "col1sub2"
        }
    },
    ["col2", "col2"],
    "col3"
]
let header2 = ["col1", "col2"]
let header3 = [["col1", "col1"], { col2: "col1" }]


// rust type result type
interface Error<T> {
    code: T;
    message: string;
}
type Success<T> {
    val: T
}

type Result<T, E> = Success<T> | Error<E>

//  ---------
// all this should be abstracted from table into cdb. table only needs to care about src and display name
let headerConcept = {
    srcName: {
        localNames: {
            de: "pimmel",
            en: "dick",
            es: "verga"
        },
        alias: "dick",
        visible: false
    },
    srcName2: {
        localNames: {
            de: "pimmel",
            en: "dick",
            es: "verga"
        },
        alias: "dick"
    },

}

let aliasGroups = {
    de: {
        dick: ["schwanz", "beidl", ""]
    }
}

let aliasGroups2 = [
    ["schwanz", "beidl", "?cock"],
    ["Preis", "price", "?price"],
    ["Lohn", "Gehalt", "Bezahlung"], //requires context time
    ["Jahresgehalt", "Bezahlung pro Jahr", "Geld pro Jahr", "Geld / Jahr"], // geld / jahr is actually a formula, should that/there be a formula alias
]

// to help specify, and infer certain things for better suggestions
// idk if its overkill, some advanced type system...
let aliasAttachments: {
    "Jahresgehalt": {
        time: "y"
    }
}

// better
// u specify context once eg for gehalt as month, then everytime u try to use gehalt it suggests time context so u can select. somehow option to enforce it!!! how to impl?!?
let context = {
    time: ["Lohn"],
    currency: []
}


// normalize to some interval eg. y or s then lookup in table, multiply with key (src) and divide by key (target)
let timeMultiplier = {
    y: 1,
    m: 12,
    d: 365
}
// theres also anaother angle: duration vs point in time (current, at_date_in_past) for eg. btc transaction to know how much $ that was when it happend. 


// indexed by main alias??
let formulas = {
    "Jahresgehalt netto": "(Lohn * 12) * some_percentage + Lohn *2 * other_percentage",
}