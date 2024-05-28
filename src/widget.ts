import { Table } from "./table";
import { TableContainer, TableData, TableOptions, TableParams, TableParamsTuple } from "./types";
// import { SimpleWidget, Widget, WidgetConfig, WidgetInfo, WidgetParams } from "@lib/../../code/temp/cdbfix/cdb/src/ts/widget";
import { SimpleWidget, Widget, WidgetConfig, WidgetInfo, WidgetParams } from "../../../widget";
// import { WidgetParams } from "../../../widget";
// import { IWidgetRequirements, IWidgetRequirementsNew, S0impleWidget, Widget, WidgetConfig, WidgetInfo, WidgetInfoFrom, WidgetRequirements } from "../../../widget";

import * as info from "./info.json";
import { testData } from "../data/test-data";
import { Cdb } from "../../../cdb/cdb";
import { tableOptionSchema } from "./defaultConfig";


// todo: use utils from lib instead. also i just need that for a workaround rn to figure out trades i made
export function unixToDateString2(unixDate: number) {
    var a = new Date(unixDate * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    console.log(time)
    return time;
}
// type Info = WidgetInfoFrom<typeof info>

// use mixins or some type of factory... 
// goal is to have a table cls that can be used wherever (independent of cdb)
// and another midlleware cls that makes the table cls cdb widget conform
// or it could just implement widget inherit from table and instantiate a new widget (without extending it requires reimplementation of the constructor with wrapper assignment etc..)



// export class TableWidget<T extends TableData> extends Table<T> implements IWidgetRequirements {
//     static info: Info = info // todo; its not required here
//     info: WidgetInfo = info

//     constructor(args: Omit<TableParams<T>, 'container'>) {
//         // constructor(specificTableShit: string, ...args: ConstructorParameters<typeof Table<T>>) {
//         let container = widget.wrapper.div // todo: double, already assign it as arg ? matter of syntax: override when creating a widget or define fixed order arg as container?? do widgets need contaiers always?? todotodo
//         let defaultArgs: TableParams<typeof testData.simple.data> = { data: testData.simple.data, header: testData.simple.header, container: testData.simple.container }
//         // super(...args)
//         // super(testData.simple.container, testData.simple.data)
//         console.log("widget");
//         if (!args) {
//             throw new Error("no args");

//         }
//         // args[0] = container
//         console.log(args);
//         console.log("widgetttt");
//         // let argsTest = { container: container, data: testData.simple.data as unknown as T }
//         // super(...args)
//         super({ ...args, container: container })
//         this.actions
//         this.draw()
//     }
//     act = {
//         "add-row": this.actions["add-row"],
//         sort: this.actions.sort
//     }
// }
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
    constructor(params: WidgetParams['inst'], parent?: Cdb | undefined) {

        console.log("init table widget with params: ");
        console.log(params);


        let tableParams: TableParams<T> = {
            data: params.options.data,
            container: params.container,
            options: params.options as TableOptions<T> ?? {}
        }
        console.log(tableParams);

        let tradingPairRenderer: Required<TableOptions1<d>>['render']['row'] = (table, rowIdx) => {
            let row = document.createElement("tr");
            let tableHtml = table.container as HTMLTableElement
            let tbody = tableHtml.tBodies[0]
            let div = document.createElement("div")
            let value = table.data[rowIdx];
            // div.innerHTML = value

            row.appendChild(div)
            let t = new Table({
                container: div,
                data: value,
                options: {
                    render: {
                        colContent: (table, pos, cell) => {
                            if (pos[1] == "time") {
                                cell.innerHTML = unixToDateString2(table.data[pos[0]][pos[1]])
                                return
                            }
                            table.render.renderCellDefault(table, pos, cell)
                        }
                    }
                }
            })
            tbody.appendChild(row)
            return "asdf"
        }

        // tableParams.options.render = {
        // row: tradingPairRenderer
        // }
        super(tableParams)
        this.container = params.container



        let defaultArgs: TableParams<typeof testData.simple.data> = { data: testData.simple.data, header: testData.simple.header, container: testData.simple.container }
        this.actions

    }
    act = {
        "add-row": this.actions["add-row"],
        sort: this.actions.sort
    }
}

Widget.list.push(TableWidget) // todo: figure out how to add widgets to the list

/**
 * idk what i fugured out there exactly a mil y ago.
 * but ill try to just inherit from widget, instantiate table and pass things thru.
 */
export class TableWidgetOld<T extends TableData> extends Table<T> implements IWidgetRequirements {
    static info: Info = info // todo; its not required here
    info: WidgetInfo = info

    constructor(widget: Widget<IWidgetRequirementsNew>, args: Omit<TableParams<T>, 'container'>) {
        // constructor(specificTableShit: string, ...args: ConstructorParameters<typeof Table<T>>) {
        let container = widget.wrapper.div // todo: double, already assign it as arg ? matter of syntax: override when creating a widget or define fixed order arg as container?? do widgets need contaiers always?? todotodo
        let defaultArgs: TableParams<typeof testData.simple.data> = { data: testData.simple.data, header: testData.simple.header, container: testData.simple.container }
        // super(...args)
        // super(testData.simple.container, testData.simple.data)
        console.log("widget");
        if (!args) {
            throw new Error("no args");

        }
        // args[0] = container
        console.log(args);
        console.log("widgetttt");
        // let argsTest = { container: container, data: testData.simple.data as unknown as T }
        // super(...args)
        super({ ...args, container: container })
        this.draw()
    }
}