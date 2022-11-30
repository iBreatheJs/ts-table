import {
    Dict,
    TableData,
    TableParams,
    TableContainer,
    TableOptions,
    TableHeader
} from './types'

import { getOrCreateContainer } from './container'

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
    // public tableHtml: HTMLTableElement;
    readonly data: Data;
    // private header: Dict<string>; // what shoudl be private?? todo
    // public header: Dict<string>;
    // private _data: Data;
    // public options: TableOptions<Data>;
    // private tableStyle: Dict<Dict<string>>;
    // private filterConfig: FilterConfig | null
    // public initialized: boolean;

    // private searchHtml: HTMLInputElement | null;
    // private rowCntHtml: HTMLDivElement | null;


    /**
     * 
     * @param tableHtml 
     * @param header Key = name of associated data field, value = display name
     * @param tableData 
     * @param options 
     */

    //  constructor(container: TableContainer, header: Dictionary<string>, tableData: Data, options: TableOptions<Data> = {}) {
    // constructor(container: TableContainer, data: Data, header: Dict<string>, options?: TableOptions<Data>);
    constructor(params: TableParams<Data>);
    constructor(container: TableContainer, data: Data);
    constructor(containerOrParams: TableContainer | TableParams<Data>, data: Data | boolean = false, header?: TableHeader, options?: TableOptions<Data>) {
        // constructor(containerOrParams: TableContainer | TableParams<Data>, data: Data, header: Dict<string>, options?: TableOptions<Data>) {
        // constructor(container: TableContainer, header: Dict<string>, tableData: Data, options: TableOptions<Data> = {}, params = null) {
        if (isParams(containerOrParams)) {
            this.container = params.container
            // this.data = params.data
        } else {
            if (typeof data != 'boolean') {
                this.data = data
            }
            this.container = container
        }

        // if (params) {
        //     console.log("first constr");
        // }
        // if (data) {
        //     console.log("second constr w data");
        // }
        // if (container) {

        // }


        // constructor(params: TableParams<Data>){
        // constructor(container: TableContainer, header: Dict<string>, data: Data, options: TableOptions<Data> = {}) {
        // this.tableHtml = params.container
        // this.tableHtml = getOrCreateContainer(params.container ?? null)
        // this.header = params.header || header
        // this.data = params.data
        // this.options = params?.options || {}

        // {container: TableContainer, header: Dict<string>, data: Data, options: TableOptions<Data> = {}}
        Table.tablesInstCnt++; // Number of Tables instantiated
        Table.tablesActiveCnt++; // Number of currently existing Table Instances

        // console.log(this.tableHtml)
        // return
        // registry.register(this, this.tableHtml);
        // this.header = header
        // // this._data = data
        // this.data = data
        // this.options = options

        // this.tableStyle = options?.tableStyle || tableStyle

        // this.initialized = false

        // // this.rowCntHtml = this.options.rowCount != false ? (() => {
        // //     let rowCntHtml = document.createElement("div");
        // //     rowCntHtml.id = this.tableHtml.id + "_row-counter";
        // //     rowCntHtml.innerHTML = String(this.data.length)
        // //     return rowCntHtml
        // // })(): null

        // this.filterConfig = null

        // this.rowCntHtml = null;
        // this.searchHtml = null;
        // // this.drawTable()
    }
}

let container = document.createElement("div")

let data: TableData = [
    {
        val1: "val1"
    }
]
let params: TableParams<typeof data> = {
    container: container,
    data: data,
}
let test = new Table(container, data)
let test2 = new Table({ container, data })

interface QueryMetadata {
    metadata: string;
}

interface QueryMetadata {
    metadata: string;
}

function isQueryMetadata(obj: any): obj is QueryMetadata {
    return (obj && obj.metadata);
}

class Example<T> {

    private metadata: QueryMetadata;
    private self: T;
    private expandAnyPaths: boolean;

    constructor(metadata: QueryMetadata);
    constructor(metadata: QueryMetadata, expandAnyPaths: boolean);
    constructor(self: T);
    constructor(self: T, metadata: QueryMetadata);
    constructor(selfOrMetadata: T | QueryMetadata, expandOrMetadata: boolean | QueryMetadata = false) {
        if (isQueryMetadata(selfOrMetadata)) {
            this.metadata = selfOrMetadata;
        } else {
            this.self = selfOrMetadata;
        }

        if (isQueryMetadata(expandOrMetadata)) {
            this.metadata = expandOrMetadata;
        } else {
            this.expandAnyPaths = expandOrMetadata;
        }
    }
}

let adsf: Example = new Example()