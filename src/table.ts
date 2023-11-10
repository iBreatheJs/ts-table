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
    TableHeaderParam,
    TableDataExtended
} from './types'

import { mergeObjects } from "@lib/helpers";
// import { TsOptions } from "@lib/ts-options"; // todo: should be in cdb wrapper. for standalone table have to figure sth out bc it cant be an option or it could be removed without possibility of getting it back
import { renderRowHtmlTable, drawTable, renderCellHtmlTable } from './draw'

// import { getOrCreateContainer } from './container'
// import { table } from 'console';
// import { events_custom } from './events';

interface TableConstructor<Data extends TableData> {
    new(container: TableContainer, header: Dict<string>, data: Data, options: TableOptions<Data>): Table<Data>
}

type TableOptionsReq<Data extends TableData> = TableOptions<Data> &
// interface TableOptionsReq<Data extends TableData> 
{
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

/**
 * If T is true: type is TypeTrue  
 * If T is not true: type is TypeFalse  
 * 
 * might need to add null
 */
type IfTrue<T extends boolean | undefined, TypeTrue, TypeFalse> = T extends true ? TypeTrue : TypeFalse
export class Table<Data extends TableData>{
    static tablesInstCnt: number = 0 // Number of Tables instantiated
    static tablesActiveCnt: number = 0 // Number of currently existing Table Instances

    public container: TableContainer
    // public container: HTMLTableElement;
    // private _data: Data = {} as Data;

    // private _data: Data | TableDataExtended

    // todo: narrow data from `Data | TableDataExtended`, guess i ll have to add a generic or maybe some kind of discriminated unions but dont think that works for class props 
    // public _data: T extends string ? string : number;

    public _data: IfTrue<typeof this.options.extendedData, Data, TableDataExtended>
    // type asdf = typeof this.options.extendedData extends true ? TableDataExtended : Data


    public set data(val: IfTrue<typeof this.options.extendedData, Data, TableDataExtended>) {
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

    public get data(): IfTrue<typeof this.options.extendedData, Data, TableDataExtended> {
        return this._data;
    }

    public tableHtml: HTMLTableElement
    public header: TableHeader;
    // private _data: Data;
    public options: TableOptionsReq<Data>

    // private tableStyle: Dict<Dict<string>>;
    // private filterConfig: FilterConfig | null
    // public initialized: boolean;

    // private searchHtml: HTMLInputElement | null;
    public rowCntHtml: HTMLDivElement | null = null
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
    // constructor(container: TableContainer, data: Data, header?: TableHeaderParam, options?: TableOptions<Data>);
    constructor(container: TableParams<Data>["container"], data: TableParams<Data>["data"], header?: TableParams<Data>["header"], options?: TableParams<Data>["options"]);
    constructor(containerOrParams: TableParams<Data>["container"] | TableParams<Data>, data: Data | boolean = false, header?: TableParams<Data>["header"], options?: TableParams<Data>["options"]) {
        let cl = console.log
        // init with obj of params - first arg is params
        // Only checks for obj type with manditory data property. 
        // Not boolean is asserted in else... constructor overloads enforce it but ts cant infer that unfortunatelly.
        if (this.argIsObject<Data>(containerOrParams)) {
            let params = containerOrParams
            if (params.options?.silent) console.log = () => { }

            this.container = params.container
            this._data = params.data

            this.header = params.header || {}
            this.options = this.setupOptions(params.options, params.header)
        } else { // init with multiple params -  first arg is container
            if (options?.silent) console.log = () => { }
            // assert because based on constructors and argIsObject type guard there is no ambiguity
            containerOrParams = containerOrParams as TableContainer
            this._data = data as Data
            // todo: might do some runtime data validation tho
            // no data and no header cant work todo

            this.container = containerOrParams

            this.header = header || {}
            this.options = this.setupOptions(options, header)
        }
        this.eventConfig = this.options?.eventConfig ?? {}

        this.tableHtml = this.draw()

        console.log("table constructedddd");
        console.log(this.options);


        // const uniqueKeys = [...new Set(asdf.map((item) => Object.keys(item)))]; // [ 'A', 'B']
        // console.log(uniqueKeys);
        this.actions = {
            "add-row": {
                //maybe no need for args her...
                // args: this.eventConfig.setArgs,
                fn: this.renderRowHtmlTable
            },
            "sort": {
                // args: this.eventConfig.setArgs,
                // arg: this.getArg("sort"),
                fn: this.sort
            }
        }

        if (this.options.silent) console.log = cl
    }

    /**
     * provide default options.
     *      some options default values are dependent on mandatory or other opt params.
     *      otherwise they would fuck the cls if not adjusted 
     */
    setupOptions(options?: TableOptions<Data>, header?: TableHeaderParam) {
        /**
         * default options
         * idk if needed
         */
        console.log("setup headerr");
        console.log(header);


        const TableOptions: TableOptionsReq<Data> = {
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

        return opt as TableOptionsReq<Data>
        // if (options) this.options = { ...TableOptions}
    }

    // want that:
    // https://github.com/microsoft/TypeScript/issues/26916
    // argIsObject2<Data extends TableData>(): this is {containerOrParams: TableParams<Data>} & {data: Data} {
    // argIsObject2<Data extends TableData>(asdf: any): asdf is object & { containerOrParam: string, data: number } {
    // argIsObject<Data extends TableData>(containerOrParams: any): containerOrParams is TableParams<Data> {
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
    render = {
        renderCellDefault: renderCellHtmlTable
    }
    renderRowHtmlTable = (table: Table<Data>, row: number) => renderRowHtmlTable(table, row)
    sort = (event: Event, n: number) => {
        console.error("not implemented")
        console.log(event);
        console.log(n);
    }
}