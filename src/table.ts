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
    TableDataExtended,
    CellData
} from './types'

import { mergeObjects } from "@lib/helpers";
// import { TsOptions } from "@lib/ts-options"; // todo: should be in cdb wrapper. for standalone table have to figure sth out bc it cant be an option or it could be removed without possibility of getting it back
import { renderRowHtmlTable, drawTable, renderCellHtmlTable } from './draw'

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

export interface CellPos {
    row: number
    col: number
}
/**
 * If T is true: type is TypeTrue  
 * If T is not true: type is TypeFalse  
 * 
 * might need to add null
 */
type IfTrue<T extends boolean | undefined, TypeTrue, TypeFalse> = T extends true ? TypeTrue : TypeFalse
export class Table<Data extends TableData> {
    static tablesInstCnt: number = 0 // Number of Tables instantiated
    static tablesActiveCnt: number = 0 // Number of currently existing Table Instances

    public container: TableContainer

    private _data: Data


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
    public options: TableOptionsReq<Data>

    public rowCntHtml: HTMLDivElement | null = null
    public eventConfig: EventConfig
    public actions;

    /**
     * how many rows till data rows start  
     * {@link getCellPos} uses parent elements index which counts header etc.  
     * 
     * my fear is that this way of getting the idx of edited cell might not work with nested tables  
     */
    rowOffset: number = 0


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
    constructor(params: TableParams<Data>) {
        let cl = console.log
        console.log("table constructor");
        console.log(arguments);

        if (params.options?.silent) console.log = () => { }
        this.container = params.container
        this._data = params.data

        this.header = params.header || {}
        this.options = this.setupOptions(params.options, params.header)


        this.eventConfig = this.options?.eventConfig ?? {}

        this.tableHtml = this.draw()

        console.log("this.options in table constr");
        console.log(this.options);

        this.setEvents()

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

    setEvents() {

        /**
         * editable  
         * 
         * there are some approaches:
         *  1. add eventlistener to each cell
         *      i assume thats not efficient
         *      used to have blur on cell and worked alright actually (so mb reconsider)
         *  2. (THIS rn) add eventlistener to table and make each cell contenteditable then the target is the cell
         *      this is probably best
         *  3. other tracking / events idk.
         * 
         * 
         */
        if (this.options.editable) {
            console.log("make editable");

            this.tableHtml.addEventListener('input', (event) => {
                // this error handling / typing is not ideal but should work for now
                if (!event.target) throw new Error("No target for input event (edit cell)");
                const target: HTMLTableCellElement = event.target as HTMLTableCellElement;
                const pos = this.getCellPos(target)

                let headerKeys = Object.keys(this.header)
                let valOld = this._data[pos.row][headerKeys[pos.col]]
                let valNew = target.innerHTML

                // value can be manipulated in onEdit, then is saved to Table._data
                let valToSave = this.onEdit(pos, valOld, valNew) // || valNew
                if (!valToSave) throw new Error("No value returned from onEdit method. Pls return the value to be used in editet cell, Note: I put this error to avoid confusion caused by implicit value assertion eg. in case of failed input manipulation in overriding method.");


                if (valToSave != valNew) target.innerHTML = String(valToSave) // change in table cell, this puts the at the beginning which it shouldnt, todo
                this.setDataByIndex(pos, valToSave)

            });
            // more events but blur might be all thats needed
            // cell.addEventListener('click', (el: any) => this.onEdit(el))
            // cell.addEventListener('keyup', (el: any) => this.onEdit(el))
            // cell.addEventListener('paste', (el: any) => this.onEdit(el))
            // cell.addEventListener('input', (el: any) => this.onEdit(el))
        }
    }

    /**
     * meant to be overridden to handle table edit  
     * value can be manipulated then returned to be saved  
     * @param pos 
     */
    onEdit(pos: CellPos, valOld: CellData, valNew: CellData): void | CellData {
        console.warn("table edited, override onEdit method to handle it")
        return valNew
    }

    /**
     * @param cell cell in table to get index of  
     * @returns cell position in table  
     */
    getCellPos(cell: HTMLTableCellElement) {

        if (!(cell.tagName.toLowerCase() === 'td')) throw new Error("Cant getCellPos of sth other than td");

        let row: HTMLTableRowElement = cell.parentElement as HTMLTableRowElement

        let rowIndex = row.rowIndex;
        const cellIndex = cell.cellIndex;

        //mb keep as class property
        let theadRowCnt = this.tableHtml.tHead?.rows.length ?? 0

        rowIndex = row.rowIndex - theadRowCnt

        console.log(`Cell at row ${rowIndex} and column ${cellIndex} was edited. New content: ${cell.textContent}`);

        return { row: rowIndex, col: cellIndex }
    }


    setDataByIndex(pos: CellPos, data: CellData) {
        let headerKeys = Object.keys(this.header)
        this._data[pos.row][headerKeys[pos.col]] = data
    }

    // want that:
    // https://github.com/microsoft/TypeScript/issues/26916
    // argIsObject2<Data extends TableData>(): this is {containerOrParams: TableParams<Data>} & {data: Data} {
    // argIsObject2<Data extends TableData>(asdf: any): asdf is object & { containerOrParam: string, data: number } {
    // argIsObject<Data extends TableData>(containerOrParams: any): containerOrParams is TableParams<Data> {
    argIsObject<Data extends TableData>(containerOrParams: any): containerOrParams is TableParams<Data> {
        // return containerOrParams && containerOrParams.data ? true : false;
        return !(containerOrParams instanceof HTMLElement);
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
        // renderCellDefault: customRowRenderer
    }
    renderRowHtmlTable = (table: Table<Data>, row: number) => renderRowHtmlTable(table, row)
    sort = (event: Event, n: number) => {
        console.error("not implemented")
        console.log(event);
        console.log(n);
    }
}
