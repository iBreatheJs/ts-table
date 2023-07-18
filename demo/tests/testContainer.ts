import { testData } from "../../data/test-data";
import { Table } from "../../src/table";
import { TableData, TableParams } from "../../src/types";
import { containerArgDefObj } from "./testTest";

let data = testData.simple.data
function tableSetup(params: any) {
    let t = new Table(params)
}
let params = { data: testData.simple.data, container: undefined } // todo this has to come from the cartesian fn
let t = new Table(params)




export interface Dict<TValue> {
    [id: string]: TValue;
}

// type testt = TableParams<typeof data>
type testt = TableParams<any>
let testt: testt = {
    // container: 3
}
let tt: testt['options'] = { editable: true }
type Rules<T> = { [id in keyof T]?: {} };
let rulesContainer: Rules<typeof containerArgDefObj> = {
    undefined: {
        chain: {
            editable: {
                val: true,
                expect: "err_noSideEffects"
            }
        },
        expect: "warning",
        err: "warning"
    }
}

function rulesMaybe() {

}

executeTests(testsTable)