import { CellPos, Table } from "./table";
import { CellData, TableContainer, TableData, TableOptions, TableParams, TableParamsTuple } from "./types";
// import { SimpleWidget, Widget, WidgetConfig, WidgetInfo, WidgetParams } from "@lib/../../code/temp/cdbfix/cdb/src/ts/widget";
import { SimpleWidget, Widget, WidgetConfig, WidgetInfo, WidgetParams } from "../../../widget";
import * as info from "./info.json";
import { testData } from "../data/test-data";
import { Cdb } from "../../../cdb/cdb";
import { tableOptionSchema } from "./defaultConfig";
import { DbTableLoaded } from "../../../data/dataSet";

// type Info = WidgetInfoFrom<typeof info>

// use mixins or some type of factory... 
// goal is to have a table cls that can be used wherever (independent of cdb)
// and another midlleware cls that makes the table cls cdb widget conform
// or it could just implement widget inherit from table and instantiate a new widget (without extending it requires reimplementation of the constructor with wrapper assignment etc..)


export class TableWidget<T extends TableData> extends Table<T> {

    // static info: Info = info // todo; its not required here
    // info: WidgetInfo = info
    static info = {
        id: "tableWidget",
        name: "tableWidget",
        version: 2
    }
    public container: HTMLDivElement; // narrow type and pass div to parent
    static optionSchema = tableOptionSchema
    dataObj: DbTableLoaded
    constructor(params: WidgetParams['inst'], parent?: Cdb | undefined) {

        console.log("init table widget with params: ");
        console.log(params);

        let dataObj = params.options.data //this should use the data from the data obj also so it is reused btwm widgets todotodo

        let tableParams: TableParams<T> = {
            data: dataObj.rows, // changed this to rows here fore a more ....sdfsdf
            container: params.container,
            options: params.options as TableOptions<T> ?? {}
        }
        console.log(tableParams);

        super(tableParams)
        this.container = params.container

        this.dataObj = dataObj // assign here after super

        let defaultArgs: TableParams<typeof testData.simple.data> = { data: testData.simple.data, header: testData.simple.header, container: testData.simple.container }
        this.actions

    }
    act = {
        "add-row": this.actions["add-row"],
        sort: this.actions.sort
    }

    /**
     * table was edited bu user in dom and  
     * store changes in db then return new value  ??
     * 
     * @param pos 
     * @param valOld 
     * @param valNew 
     * @returns 
     */
    onEdit(pos: CellPos, valOld: CellData, valNew: CellData): void | CellData {
        console.log("on edit in widget was clled");

        this.dataObj.update(pos, valNew) // update the dataSet
        return valNew
    }
}

Widget.list.push(TableWidget) // todo: figure out how to add widgets to the list