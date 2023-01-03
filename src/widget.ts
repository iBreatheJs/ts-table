import { Table, TableConstructor } from "./table";
import { TableData, TableParams } from "./types";
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
    // static info: Info // todo; its not required here
    info: Info = info

    // with custom constructor the constructor overloads are lost but can have additional params
    // constructor(specificTableShit: string, ...args: ConstructorParameters<typeof Table<T>>) {
    //     super(...args)
    // }


}

testData
let asdf = new TableWidget(testData.simple.container, testData.simple.data)
// the object constructor option is lost but thats as much as imma fk around w this ts rn
let asdf2 = new TableWidget({ container: testData.simple.container, data: testData.simple.data })
asdf2.info
let asdftable = new Table(testData.simple.container, testData.simple.data)
let asdftable2 = new Table({ container: testData.simple.container, data: testData.simple.data })
