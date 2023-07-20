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


export type TableData = RowData[]
// | Dict<RowData>; makes no sense think i meant to have rowdata be an arr



let data: TableData = [
    { col1: "val1" },
    { col2: "val2" }
]
// let data2: TableData = {
//     asfd: { col1: "val1" },
//     asdf2: { col2: "val2" }
// }

let data3 = [
    ["r1col1", "r1col2"],
    ["r2col1", "r2col2"]
]

// init this table so i can access the method types:
let container = "" as unknown as HTMLTableElement

//pretty fkd concept here n probably will fk me when debuging, just know this logs some stuff when types r imported
// let cl = console.log
// console.log = () => { }
let table = new Table(container, data)
// console.log = cl

type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P extends Table<infer X> ? X : P : never;
type extractGeneric<Type> = Type extends Table<infer X> ? X : never

// type extracted = extractGeneric<typeof table>

export type SortSig = Parameters<typeof table.sort>
// export type AddEventSig<Data extends TableData> = Parameters<typeof addEvents>
// export type AddEventSig<Data extends TableData> = 
export type EventCb<Data extends TableData> = (table: Table<Data>, el: HTMLElement, localEvent: EventT) => SortSig
export type EventCb2<Data extends TableData> = (event: Event, table: Table<Data>, el: HTMLElement, localEvent: EventT) => SortSig

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



export type TableParamsTuple<T extends TableData> = [
    container: TableContainer,
    data: T,
    header?: TableHeader | boolean,
    options?: TableOptions<T> | {}

]


// type TableHeaderParam = TableHeader | boolean | null | [TableHeader, boolean]
// header options override these defaults
export type TableHeaderParam =
    // undefined // infer=true //todo: idk if i should define it here or just have optional params
    | null // infer=true
    | TableHeader // infer,hide = false
    | false // infer,hide=true


export type TableParams<T extends TableData> = {
    /**
     * optional, falls back to:
     *      create div, append to body
     * if provided can be:
     *      div
     *      table
     *      string (id of element)
     *          exists: 
     *              use element w id
     *          doesn't exist: 
     *              create element w id, append to body
     */
    container: TableContainer,
    /**
     * for any type use option: "extendedData"
     *      might require custom renderer or 
     *      not implemented: todo: nested renderer
     */
    data: T,
    // dataa: Required<TableParams<T>['options']>[''],
    header?: TableHeaderParam,
    options?: TableOptions<T> // todo better consitant naming for the param and internal version. would make sense to call them all sthParam and have another type in the cls with default values and less optional... but these names r likely the one exported for anotation outside when using the lib.. so better call them tableOptions and the instance one sth else
} & { // change data type if extendedData is used
    data: T
    options?: {
        extendedData?: boolean,
    }
} |
    {
        container: TableContainer,
        header?: TableHeaderParam,
        options?: TableOptions<T> // todo better consitant naming for the param and internal version. would make sense to call them all sthParam and have another type in the cls with default values and less optional... but these names r likely the one exported for anotation outside when using the lib.. so better call them tableOptions and the instance one sth else
    } &
    {
        data: any
        options: {
            extendedData: true,
        }
    }

// used for callback functions to hint the correct index type
export type KeyOrIndex<data> = data extends Array<RowData> ? number : string;

type FilterConfig = Dict<any> // todo

// todo: rethink if thats needed bc it requires stupid complicated assertions when merging with default options
export type EditOptions = {

    editable?: OnEditFunc | true
    extendableRows?: boolean
}
    |
{
    // editable?: false
    extendableRows?: false
}

// manual config (infer, hide)
// usefull for eg. infer + header: can add additional cols which are not in the data but might be needed to be filled out manually
export interface TableHeaderParamOptions {
    hide?: boolean // default false
    infer?: boolean // default false, except no table header
}

export type RenderRow<Data extends TableData> = (table: Table<Data>, idx: number) => void
export type RenderColContent<Data extends TableData> = (table: Table<Data>, pos: [number, string], cell: HTMLTableCellElement) => void

/**
 * optional table Params
 * TODO: document params
 */
export interface TableOptions1<Data extends TableData> {
    header?: TableHeaderParamOptions
    /**
     * allow for complex data structures, objects / arrays as ColData
     */
    extendedData?: boolean
    // edit?: edit
    tableStyle?: Dict<Dict<string>>,
    alternateColour?: boolean //default true
    // todo: these fk up the call method used for passing this context
    // transformData?: RowFunc<Data>,
    render?: {
        row?: RenderRow<Data> // row html frame that calls rowContnent
        // rowContent?: RenderRow<Data> //todo this is sth,,, data inside eg. table cell
        // col?: Function
        colContent?: RenderColContent<Data>
    }
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

// export type TableOptions<Data extends TableData> = TableOptions1<Data> & EditOptions
export type TableOptions<Data extends TableData> = TableOptions1<Data>



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
 * todo thats in tableparams... TableHeader is the 2nd option where its a Dict
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
// | boolean

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
type Success<T> = {
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


type PickMatching<T, V> =
    { [K in keyof T as T[K] extends V ? K : never]: T[K] }

type ExtractMethods<T> = PickMatching<T, Function>;

class Foo {
    bar() { }
    baz() { }
    notAMethod = 123;
    funcProp = () => 10;
}

type FooMethod = ExtractMethods<Table<TableData>>
/* type FooMethod = {
    bar: () => void;
    baz: () => void;
    funcProp: () => number;
} */

// let fff: FooMethod = {

// }
type ttest = Table<TableData>[keyof Table<TableData>]
let ttt = {}