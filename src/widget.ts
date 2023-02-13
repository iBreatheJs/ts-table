import { Table, TableConstructor } from "./table";
import { TableContainer, TableData, TableParams, TableParamsTuple } from "./types";
import { IWidgetRequirements, IWidgetRequirementsNew, SimpleWidget, Widget, WidgetConfig, WidgetInfo, WidgetInfoFrom, WidgetRequirements } from "../../../widget";
import { Wrapper } from "../../../wrapper";

import * as info from "./info.json";
import { testData } from "../data/test-data";
type Info = WidgetInfoFrom<typeof info>

// use mixins or some type of factory... 
// goal is to have a table cls that can be used wherever (independent of cdb)
// and another midlleware cls that makes the table cls cdb widget conform
// or it could just implement widget inherit from table and instantiate a new widget (without extending it requires reimplementation of the constructor with wrapper assignment etc..)



export class TableWidget<T extends TableData> extends Table<T> implements IWidgetRequirements {
    static info: Info = info // todo; its not required here
    info: WidgetInfo = info

    // with custom constructor the constructor overloads are lost but can have additional params
    // constructor(...args: ConstructorParameters<typeof Table<T>>) {
    // constructor(...args: ConstructorParameters<typeof Table<T>>) {
    // constructor(widget: Widget<IWidgetRequirementsNew>, ...args: ConstructorParameters<typeof Table>) {
    //that shit works but dont need container here
    // constructor(widget: Widget<IWidgetRequirementsNew>, ...args: TableParamsTuple<T>) {
    constructor(widget: Widget<IWidgetRequirementsNew>, args: Omit<TableParams<T>, 'container'>) {
        // constructor(specificTableShit: string, ...args: ConstructorParameters<typeof Table<T>>) {
        let container = widget.wrapper.div
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

// testData
// let asdf = new TableWidget(testData.simple.container, testData.simple.data)
// // the object constructor option is lost but thats as much as imma fk around w this ts rn
// let asdf2 = new TableWidget({ container: testData.simple.container, data: testData.simple.data })
// asdf2.info
// let asdftable = new Table(testData.simple.container, testData.simple.data)
// let asdftable2 = new Table({ container: testData.simple.container, data: testData.simple.data })
