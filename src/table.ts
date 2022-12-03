import {
    Dict,
    TableData,
    TableParams,
    TableContainer,
    TableOptions,
    TableHeader
} from './types'

import { addRow, drawTable } from './draw'

import { Logger } from './ts-logger/logger'
import { getOrCreateContainer } from './container'
import { table } from 'console';

interface TableConstructor<Data extends TableData> {
    new(container: TableContainer, header: Dict<string>, data: Data, options: TableOptions<Data>): Table<Data>
}

function isParams<Data extends TableData>(obj: any): obj is TableParams<Data> {
    return (obj && obj.container);
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
    public header: TableHeader;
    // private _data: Data;
    public options: TableOptions<Data> | null;
    // private tableStyle: Dict<Dict<string>>;
    // private filterConfig: FilterConfig | null
    // public initialized: boolean;

    // private searchHtml: HTMLInputElement | null;
    // private rowCntHtml: HTMLDivElement | null;


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
     * @param data 
     * @param options 
     */

    /**
     * @type {objArg & multiArg}
     */
    constructor(params: TableParams<Data>);
    constructor(container: TableContainer, data: Data, header?: TableHeader, options?: TableOptions<Data>);
    constructor(containerOrParams: TableContainer | TableParams<Data>, data: Data | boolean = false, header?: TableHeader, options?: TableOptions<Data>) {
        // init with obj of params - first arg is params
        if (isParams(containerOrParams)) {
            let params = containerOrParams

            this.container = params.container
            this.data = params.data || []
            this.header = params.header ?? {}
            this.options = params.options || null
        } else { // init with multiple params -  first arg is container
            this.container = containerOrParams
            this.header = header ?? {}
            this.options = options || null
            if (typeof data != 'boolean') {
                this.data = data || []
            } else {
                // that actually NEVER happens, only way data is boolean is if the constructor with params is called (case is handled above) or boolean is passed against the will of ts
                // no data, init as empty data

                this.data = [{}] as Data
            }
        }



        // const uniqueKeys = [...new Set(asdf.map((item) => Object.keys(item)))]; // [ 'A', 'B']
        // console.log(uniqueKeys);





        // this.container = params.container
        // this.container = getOrCreateContainer(params.container ?? null)
        // this.header = params.header || header
        // this.data = params.data
        // this.options = params?.options || {}

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


        let test
        test = this.transformData([{}] as Data) || test
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

    // draw = () => drawTable.call(this)
    // addRow = ()=> addRow()

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


