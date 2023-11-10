import { Dict, Table, TableData, TableParams, testData } from "@lib/ts-table";
import { ArgDefObj, Test, TestDefinitions } from "@lib/ts-test";

const variableHtmlElement = (tag: keyof HTMLElementTagNameMap) => {
    return () => {
        let el = document.createElement(tag)
        if (!el) throw new Error("invalid tag name")
        return el
    }
}
export function testParamCombinations() {
    console.log("testParamCombinations");

    var testsTable: TestDefinitions<typeof Table> = {
        tagName: {
            test: (testFrame: Document) => {
                // testFrame.getel
                return "t.tableHtml.tagName"
            },
            expect: "TABLE"
        },
        parentTagName: {
            test: (testFrame: Document) => { return "testFrame.tableHtml.parentElement?.tagName" },
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
        // "table": () => { document.body.appendChild(document.createElement("table")) },
        "table": () => {
            let t = document.createElement("table");
            document.body.appendChild(t)
            t.classList.add("fkntable")
        },
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
        "simple data": testData.simple.data,
        "crypto data": testData.crypto.data,
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


    let t = new Test({
        argDefObj: argDefObj,
        tests: testsTable,
        testSubject: Table,
        setup: (document) => {
            let div = document.createElement("div")
            div.id = "testDiv"
            document.body.appendChild(div)
        }
    })
    t.testParamsCartesian()
}