import {
    Dict,
    TableData,
    TableParams,
    TableContainer,
    TableOptions,
    TableHeader,
    RowData,
    EventConfig,
    Actions,
    ActionConfig
} from './types'

import { addRow, drawTable } from './draw'

import { Logger } from './ts-logger/logger'
import { getOrCreateContainer } from './container'
import { table } from 'console';
import { events_custom } from './events';

interface TableConstructor<Data extends TableData> {
    new(container: TableContainer, header: Dict<string>, data: Data, options: TableOptions<Data>): Table<Data>
}

function isParams<Data extends TableData>(obj: any): obj is TableParams<Data> {
    return (obj && obj.container);
}


export class TableCreator<Data extends TableData>{
    static tablesInstCnt: number = 0 // Number of Tables instantiated
    static tablesActiveCnt: number = 0 // Number of currently existing Table Instances

    public container: TableContainer
    // public container: HTMLTableElement;
    private _data: Data = {} as Data;

    public set data(val: Data) {
        // there is already data:
        if (this._data && this._data.length > 0) {
            console.log("data alredy set. todo: probably just create a new table / overwrite everything in table w new data");
        } else // data not set, initialize it
        {
            console.log("init data");

            if (Array.isArray(val)) {
                this._data = val;
            } else {
                // transform data structure -> array of obj
                // todo: test for efficiency and then descide what other structures to add
                this._data = Object.values(val) as Data;
            }
        }
    }

    public get data(): Data {
        return this._data;
    }



    // private header: Dict<string>; // what shoudl be private?? todo
    public header: TableHeader | false;
    // private _data: Data;
    public options: TableOptions<Data> | null;
    // private tableStyle: Dict<Dict<string>>;
    // private filterConfig: FilterConfig | null
    // public initialized: boolean;

    // private searchHtml: HTMLInputElement | null;
    // private rowCntHtml: HTMLDivElement | null;
    public eventConfig: EventConfig
    public actions;


    /**
     * obj
     * @callback objArg
     * @param params 
     * 
     * 
     * multiple args
     * @callback multiArg
     * @param container 
     * @param header Key = name of associated data field, value = display name
     * @param data required, for empty table explicitly declare as {} or []
     * @param options 
     */


    constructor(params: TableParams<Data>);
    constructor(container: TableContainer, data: Data, header?: TableHeader, options?: TableOptions<Data>);
    constructor(containerOrParams: TableContainer | TableParams<Data>, data: Data | boolean = false, header?: TableHeader, options?: TableOptions<Data>) {
        // init with obj of params - first arg is params
        let asdf = { a: containerOrParams, b: data }

        // Only checks for obj type with manditory data property. 
        // Not boolean is asserted in else... constructor overloads enforce it but ts cant infer that unfortunatelly.
        if (this.argIsObject(containerOrParams)) {
            let params = containerOrParams

            this.container = params.container
            this.data = params.data
            // this.header = params.header ?? {}
            this.header = params.header ?? null
            this.options = params.options || null
        } else { // init with multiple params -  first arg is container
            // assert because based on constructors and argIsObject type guard there is no ambiguity
            containerOrParams = containerOrParams as TableContainer
            data = data as Data
            // todo: might do some runtime data validation tho
            // no data and no header cant work todo

            this.container = containerOrParams
            this.data = data;
            // this.header = header ?? {}
            this.header = header ?? null
            this.options = options || null
        }
        this.eventConfig = this.options?.eventConfig || events_custom

    }

    draw() {
        let container = document.createElement('table')

        let dataSimple = [
            { col1: "data1", col2: "r1c2" },
            { col1: "data2", col2: "r2c2", kk: "kaka" },
            { col1: "data33333", col2: "r3c2" }
        ]
        return new Table(container, dataSimple)
    }

}

// interface TableConstructor<Data extends TableData> {
//     new ( container: TableContainer, header: Dict<string>, data: Data, options: TableOptions<Data> ): Table<Data> | (new (asdf:string):any) 
// }
export class Table<Data extends TableData>{
    static tablesInstCnt: number = 0 // Number of Tables instantiated
    static tablesActiveCnt: number = 0 // Number of currently existing Table Instances

    public container: TableContainer
    // public container: HTMLTableElement;
    private _data: Data = {} as Data;

    public set data(val: Data) {
        // there is already data:
        if (this._data && this._data.length > 0) {
            console.log("data alredy set. todo: probably just create a new table / overwrite everything in table w new data");
        } else // data not set, initialize it
        {
            console.log("init data");

            if (Array.isArray(val)) {
                this._data = val;
            } else {
                // transform data structure -> array of obj
                // todo: test for efficiency and then descide what other structures to add
                this._data = Object.values(val) as Data;
            }
        }
    }

    public get data(): Data {
        return this._data;
    }



    // private header: Dict<string>; // what shoudl be private?? todo
    public header: TableHeader | false;
    // private _data: Data;
    public options: TableOptions<Data> | null;
    // private tableStyle: Dict<Dict<string>>;
    // private filterConfig: FilterConfig | null
    // public initialized: boolean;

    // private searchHtml: HTMLInputElement | null;
    // private rowCntHtml: HTMLDivElement | null;
    public eventConfig: EventConfig
    public actions;


    /**
     * obj
     * @callback objArg
     * @param params 
     * 
     * 
     * multiple args
     * @callback multiArg
     * @param container 
     * @param header Key = name of associated data field, value = display name
     * @param data required, for empty table explicitly declare as {} or []
     * @param options 
     */


    constructor(params: TableParams<Data>);
    constructor(container: TableContainer, data: Data, header?: TableHeader, options?: TableOptions<Data>);
    constructor(containerOrParams: TableContainer | TableParams<Data>, data: Data | boolean = false, header?: TableHeader, options?: TableOptions<Data>) {
        // init with obj of params - first arg is params
        let asdf = { a: containerOrParams, b: data }

        // Only checks for obj type with manditory data property. 
        // Not boolean is asserted in else... constructor overloads enforce it but ts cant infer that unfortunatelly.
        if (this.argIsObject(containerOrParams)) {
            let params = containerOrParams

            this.container = params.container
            this.data = params.data
            // this.header = params.header ?? {}
            this.header = params.header ?? null
            this.options = params.options || null
        } else { // init with multiple params -  first arg is container
            // assert because based on constructors and argIsObject type guard there is no ambiguity
            containerOrParams = containerOrParams as TableContainer
            data = data as Data
            // todo: might do some runtime data validation tho
            // no data and no header cant work todo

            this.container = containerOrParams
            this.data = data;
            // this.header = header ?? {}
            this.header = header ?? null
            this.options = options || null
        }
        this.eventConfig = this.options?.eventConfig || events_custom



        // const uniqueKeys = [...new Set(asdf.map((item) => Object.keys(item)))]; // [ 'A', 'B']
        // console.log(uniqueKeys);
        this.actions = {
            "add-row": {
                //maybe no need for args her...
                // args: this.eventConfig.setArgs,
                fn: this.addRow
            },
            "sort": {
                // args: this.eventConfig.setArgs,
                // arg: this.getArg("sort"),
                fn: this.sort
            }
        }







        // {container: TableContainer, header: Dict<string>, data: Data, options: TableOptions<Data> = {}}
        Table.tablesInstCnt++; // Number of Tables instantiated
        Table.tablesActiveCnt++; // Number of currently existing Table Instances

        // console.log(this.container)
        // return
        // registry.register(this, this.container);
        // this.header = header
        // // this._data = data
        // this.data = data
        // this.options = options

        // this.tableStyle = options?.tableStyle || tableStyle

        // this.initialized = false

        // // this.rowCntHtml = this.options.rowCount != false ? (() => {
        // //     let rowCntHtml = document.createElement("div");
        // //     rowCntHtml.id = this.container.id + "_row-counter";
        // //     rowCntHtml.innerHTML = String(this.data.length)
        // //     return rowCntHtml
        // // })(): null

        // this.filterConfig = null

        // this.rowCntHtml = null;
        // this.searchHtml = null;
        // // this.drawTable()


    }



    // want that:
    // https://github.com/microsoft/TypeScript/issues/26916
    // argIsObject2<Data extends TableData>(): this is {containerOrParams: TableParams<Data>} & {data: Data} {
    // argIsObject2<Data extends TableData>(asdf: any): asdf is object & { containerOrParam: string, data: number } {
    argIsObject<Data extends TableData>(containerOrParams: any): containerOrParams is TableParams<Data> {
        return containerOrParams && containerOrParams.data ? true : false;
    }


    // todo: asert Data to _data or use some shitty fn like this that returns the new value
    transformData(val: Data): Data | false {
        // there is already data:
        if (this.data && this._data.length > 0) {
            console.log("data alredy set. todo: probably just create a new table / overwrite everything in table w new data");
        } else // data not set, initialize it
        {
            console.log("init data");

            if (Array.isArray(val)) {
                this._data = val;
            } else {
                // transform data structure -> array of obj
                // todo: test for efficiency and then descide what other structures to add
                this._data = Object.values(val) as Data;
            }
        }
        return false
    }

    draw = (): void => drawTable(this)
    addRow = (table: Table<Data>, row: RowData) => addRow(table, row)
    sort = (event: Event, n: number) => {
        console.error("not implemented")
        console.log(event);
        console.log(n);

    }

}

let container = document.createElement("div")

// let data: TableData = [
//     {
//         val1: "val1"
//     }
// ]
// let params: TableParams<typeof data> = {
//     container: container,
//     data: data,
// }
// let test = new Table(container, data)
// let test2 = new Table({ container, data })
