import {
    Dict,
    TableData,
    TableParams,
    TableContainer,
    TableOptions,
    TableHeader,
    RowData,
    EventConfig,
    // Actions,
    ActionConfig,
    TableHeaderParam
} from './types'

import { mergeObjects } from "@lib/helpers";
import { addRow, drawTable } from './draw'

import { getOrCreateContainer } from './container'
import { table } from 'console';
import { events_custom } from './events';

interface TableConstructor<Data extends TableData> {
    new(container: TableContainer, header: Dict<string>, data: Data, options: TableOptions<Data>): Table<Data>
}

interface TableOptionsReq<Data extends TableData> {
    header: {
        infer: boolean,
        hide: boolean
    }
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
            console.warn("data alredy set. todo: probably just create a new table / overwrite everything in table w new data if already been drawn");
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

    public tableHtml: HTMLTableElement
    public header: TableHeader;
    // private _data: Data;
    public options: TableOptions<Data> & TableOptionsReq<Data>

    // private tableStyle: Dict<Dict<string>>;
    // private filterConfig: FilterConfig | null
    // public initialized: boolean;

    // private searchHtml: HTMLInputElement | null;
    // private rowCntHtml: HTMLDivElement | null;
    public eventConfig: EventConfig
    public actions;

    // 


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
    constructor(container: TableContainer, data: Data, header?: TableHeaderParam, options?: TableOptions<Data>);
    constructor(containerOrParams: TableContainer | TableParams<Data>, data: Data | boolean = false, header?: TableHeaderParam, options?: TableOptions<Data>) {
        // init with obj of params - first arg is params
        // Only checks for obj type with manditory data property. 
        // Not boolean is asserted in else... constructor overloads enforce it but ts cant infer that unfortunatelly.
        if (this.argIsObject(containerOrParams)) {
            let params = containerOrParams

            this.container = params.container
            this.data = params.data

            this.header = params.header || {}
            this.options = this.setupOptions(params.options, params.header)
        } else { // init with multiple params -  first arg is container
            // assert because based on constructors and argIsObject type guard there is no ambiguity
            containerOrParams = containerOrParams as TableContainer
            data = data as Data
            // todo: might do some runtime data validation tho
            // no data and no header cant work todo

            this.container = containerOrParams
            this.data = data;

            this.header = header || {}
            this.options = this.setupOptions(options, header)
        }
        this.eventConfig = this.options?.eventConfig ?? {}


        this.tableHtml = this.draw()

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
    }

    setupOptions(options?: TableOptions<Data>, header?: TableHeaderParam) {
        /**
         * default options
         * idk if needed
         */
        console.log("setup headerr");
        console.log(header);

        const TableOptions: TableOptions<Data> & TableOptionsReq<Data> = {
            header: {
                infer: typeof header === "object" ? false : true, // set depending on header
                hide: header === false ? true : false
            },
            // editable: 
        }

        // this.header = params.header === true ? {} : params.header ?? {} // default to auto generate

        // // todo: might be needed for editable, depending on type
        // this.options = {
        //     ...TableOptions,
        //     ...params.options,
        //     // editable: params.options?.editable || TableOptions.editable,
        //     // editable: TableOptions.editable !== undefined ? TableOptions.editable : params.options?.editable,
        //     // extendableRows: TableOptions.extendableRows !== undefined ? TableOptions.extendableRows : params.options?.extendableRows,
        // };

        // header options depending on header arg
        // TableOptions.header = {
        //     infer: false,
        //     hide: false
        // }
        console.log("setup options");
        console.log(options);
        console.log(TableOptions);

        // overwrite / merge default options with assertions inferred from params, then options provided as param on top 
        // let opt = {}
        // Object.assign(opt, TableOptions, options)
        let opt = TableOptions // default options
        if (options) opt = mergeObjects(TableOptions, options) // config on top, merge recursively

        // this is stupid
        // if (asdf.header?.hide !== undefined &&
        //     asdf.header?.infer !== undefined &&
        //     typeof asdf.header.hide === 'boolean'
        //     && typeof asdf.header.infer === 'boolean') {

        //     this.options = {
        //         ...asdf,
        //         header: {
        //             hide: asdf.header.hide,
        //             infer: asdf.header.infer,
        //         },
        //     };
        // }

        return opt as TableOptions<Data> & TableOptionsReq<Data>
        // if (options) this.options = { ...TableOptions}
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

    draw = (): HTMLTableElement => drawTable(this)
    addRow = (table: Table<Data>, row: RowData) => addRow(table, row)
    sort = (event: Event, n: number) => {
        console.error("not implemented")
        console.log(event);
        console.log(n);
    }
}