import { Dict, TableData, TableParams, testData } from "@lib/ts-table";
import { ArgDefObj, Test, TestDefinitions } from "@lib/ts-test";

const variableHtmlElement = (tag: keyof HTMLElementTagNameMap) => {
    return () => {
        let el = document.createElement(tag)
        if (!el) throw new Error("invalid tag name")
        return el
    }
}
export function testParamCombinations() {
    var testsTable: TestDefinitions = {
        tagName: {
            test: (testFrame: HTMLIFrameElement) => {
                // testFrame.getel
                return "t.tableHtml.tagName"
            },
            expect: "TABLE"
        },
        parentTagName: {
            test: (testFrame: HTMLIFrameElement) => { return "testFrame.tableHtml.parentElement?.tagName" },
            expect: "div"
        },
        rows: {
            test: () => { return 10 },
            expect: 10
        }
    }

    var containerArgDefObj = {
        "undefined": undefined,
        "sd": "sdf",
        "null": null,
        combination: () => {
            console.log("combi");
        },
        "div": variableHtmlElement("div"),
        // {
        //     arg: (variableHtmlElement: Function) => {
        //         variableHtmlElement("div")
        //     },
        //     desc: ` div, 
        //             with id,
        //             not in dom 
        //     `
        // }
    }
    let dataArgDef =
    {
        // "test": { "asdf": "asdff" },
        "simple data": testData.simple,
        "crypto data": testData.crypto,
    }
    // {
    //     arg: testData.simple,
    //     desc: "simple data"
    // },
    // {
    //     arg: testData.crypto,
    //     desc: "crypto data"
    // }

    let headerArgDef = {
        "basic header": {},
        "undefined": undefined,
        "null": null
    }


    // todo make types nice. do for obj constructor and param constr
    // type argDefCases = argDefObj['container']
    // let ttt: keyof TableParams<TableData> = "container"
    // var argDefObj: ArgDef = {
    // todo: possible to infer these types? not use dict<any>
    var argDefObj: ArgDefObj<TableParams<TableData>> = {
        "container": containerArgDefObj,
        "data": dataArgDef,
        header: headerArgDef,
        options: {} //todo darf nicht leer sein, ausser opt??
    }


    let t = new Test({ argDef: argDefObj })

}