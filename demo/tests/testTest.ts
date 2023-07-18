import { Dict, RowData, Table, TableContainer, TableData, TableParams, testData } from "../..";
// import { executeTests } from "./testContainer"
// import { Testtt } from '../../pathTest' //todotodo: add local folder alias
import { Test } from 'ts-test' //todotodo: add local folder alias
var data = [
    {
        key1: "val1_1",
        key2: "val1_2",
        key3: "val1_3",
        key4: "val1_4"
    },
    {
        key1: "val2_1",
        key2: "val2_2",
        key3: "val2_3",
        key4: "val2_4"
    },
    {
        key1: "val3_1",
        key2: "val3_2",
        key3: "val3_3",
        key4: "val3_4"
    }
]
type IData = typeof data

var header = {
    'key1': 'key1',
    'key2': 'key2',
    'key3': 'key3',
    'key4': 'key4 test',
}

export function testTest() {
    var arg1 = [1, 2, 3]
    var arg2 = [1, 2, 3]
    // test(arg1, arg2)
    // get values:




    var asdf: TableContainer
    /* 
    container:
        ?undefined
        table
        div
        string
            exists:
                table
                div
            doesnt exist
    
    ID
        exists
        no id
    */




    // table



    var containerTableFn = variableHtmlElement("table")
    var containerTable = document.createElement("table")
    document.body.appendChild(containerTable)
    // div
    var containerDiv = document.createElement("div")

    // string exists as:
    //      table
    // ????
    var containerDivString = document.createElement("div")
    var containerStringExist = "stringExistsAsTable"
    //      div
    var containerStringExist = "stringExistsAsDiv"
    var containerStringNew = "stringDoesNotExistAsTable"


    // variables
    var id1 = "someID"
    var id2 = undefined

    var containers = [containerTable, containerDiv, containerStringExist, containerStringNew]
    var ids = [id1, id2]

    var variables = [containers, ids]
    var variablesNames = ["container", "id"]

    testAllPairs(execute, expect, variables, variablesNames)
}
const variableHtmlElement = (tag: keyof HTMLElementTagNameMap) => {
    return () => {
        let el = document.createElement(tag)
        if (!el) throw new Error("invalid tag name")
        return el
    }
}
// execute for all combination
function execute(combination) {
    let container, id
    [container, id] = [...combination]

    // set id if attribute available, because of error on string
    try {
        container.id = id
    } catch (error) { }

    return new Table(container, data, header)
    // .draw()
}

// expected output all combination
function expect(table: Table<TableData>) {
    console.log("ttttable");
    console.log(table);

    let res = {
        testId: table.tableHtml.id
    }
    return res
}

const cartesian = <T>(items: T[][]) => [...cartesianIterator(items)];

function* cartesianIterator<T>(items: T[][]): Generator<T[]> {
    const remainder = items.length > 1 ? cartesianIterator(items.slice(1)) : [[]];
    for (let r of remainder) for (let h of items.at(0)!) yield [h, ...r];
}

const cartesianAlternative = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));



export function testAllPairs(execute, expect, args: any, variablesNames) {
    console.log("test all pairs");

    // get all posibillities
    var cart = cartesian([...args]);
    console.log("cart")
    console.log(cart)

    var res: TableData = []

    for (const combination of cart) {
        // let row = {...combination}
        let input: {} = combination.reduce((acc, curr, i) => (acc[variablesNames[i]] = curr ? curr.toString() : curr, acc), {});
        let output = expect(execute(combination))

        res.push({ ...input, ...output })
        break;
    }

    // let resTableHead = variablesNames
    let resTableHeader = { 'container': "container", 'id': "id", "testId": "testId" }

    var resTableHtml = document.createElement("table")
    document.body.appendChild(resTableHtml)
    let resTable = new Table(resTableHtml, res, resTableHeader)
    console.log("res")
    // console.log(resTable.header)
    // console.log(resTable.tableData)
    console.log(res)
    resTable.draw()
}

type Tests = typeof testsTable

// params in one obj
type ArgDefObj<T> = {
    [key in keyof Required<T>]: Dict<any>;
};

// function executeTest(setup: any , test: any) {
interface TestRes {
    msg: string,
    err: boolean
}
function executeTest(t: any, name: string) {
    let res: TestRes = {
        //   key: keyof Tests
        msg: "success",
        err: false
    }
    let testFrame = setup()
    let testRes = t.test(testFrame)
    // tearDown(testFrame)
    if (testRes === t.expect) {
        res.msg = "success: test '" + name + "' succeeded. res: '" + res + "' expected: '" + t.expect
        // res.err = false
    }
    else {
        res.msg = "fail: test '" + name + "' failed. res: '" + res + "' expected: '" + t.expect
        res.err = true
    }
    return res
}

// export function executeTests(tests: Tests) {
//     console.log("execute tests");

//     // executeTest()
//     let key: keyof Tests
//     let msg = "success"
//     let err = false
//     for (key in tests) {
//         let t = tests[key]
//         let testFrame = setup()
//         let res = t.test(testFrame)
//         // tearDown(testFrame)
//         if (res === t.expect) {
//             msg = "success: test '" + key + "' succeeded. res: '" + res + "' expected: '" + t.expect
//             err = false
//         }
//         else {
//             msg = "fail: test '" + key + "' failed. res: '" + res + "' expected: '" + t.expect
//             err = true
//         }
//         console.log("testttttttt");
//         console.log(t);
//         console.log(msg);
//     }
// }
export function executeTests(tests: Tests) {
    console.log("execute tests");
    let res: Dict<TestRes> = {}
    // executeTest()
    let key: keyof Tests
    for (key in tests) {
        res[key] = executeTest(tests[key], key)
    }
    return res
}

/**
 * get all combinations of provided args
 */
function combination() {

}

let c: TableParams<typeof data>['container'] = ''
var containerArgDef = [
    {
        arg: undefined,
        desc: "undefined"
    },
    {
        arg: null,
        desc: "null"
    },
    {
        arg: variableHtmlElement("div"),
        desc: "div"
    },
    // {
    //     arg: (variableHtmlElement: Function) => {
    //         variableHtmlElement("div")
    //     },
    //     desc: ` div, 
    //             with id,
    //             not in dom 
    //     `
    // }
]

// type testExtract = {keyof TableParams<any>}
type testExtract = TableParams<any>['container']
let tttt = {
    container: [
        "asdf",
        undefined,
        null,
        () => { return document.createElement("table") }

    ]
}

// type ArgDef = Dict<undefined | null | string | number | Function>
// type ArgDef = Dict<Dict<any>>

// type asdff = ConstructorParameters<typeof Table<TableData>>

// type ArgDef = {
//     [Key in asdff]: number;
// }


export var containerArgDefObj = {
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


// let argDef = [Object.keys(containerArgDefObj), dataArgDef]

// type ArgDefCompleate<F> = 


const setup = () => {
    console.log("setup");

    let testFrame = document.createElement("iframe")
    testFrame.id = "testFrame"
    document.body.appendChild(testFrame)
    let testFrameDoc = testFrame.contentDocument
    if (!testFrameDoc) throw new Error("iframe document doesn't exist")
    let div = testFrameDoc.createElement("div")
    div.id = "testDiv"
    testFrameDoc.body.appendChild(div)
    return testFrame
}

const tearDown = (testFrame: HTMLIFrameElement) => {
    let iframe = document.getElementById("testFrame")
    iframe?.replaceChildren() //https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    iframe?.remove()
}


var testsTable = {
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
        test: () => { },
        expect: 10
    }
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

// ask: todo in argDefObj can i avoid needing to define undefined case for optional??
// not exhaustive type to require all combinations but checks the ones provided
type TableDataCases<T> = {
    [key in keyof Required<T>]: Dict<any>;
};

type testtt = typeof containerArgDefObj
type testtt2 = typeof argDefObj

var asdf: testtt2 = {
    container: {}
}

// todo: types: first impl for argDefObj but consider adjusting for just adding tuples of args (has no naming so this one is nicer but more work)
function getCombinationTable<T>(...args: ArgDefObj<T>[]) {
    //todo more argDefs
    if (args.length < 1) throw new Error("No args provided for generating combinations")

    let tableData: {}[] = []

    if (args.length === 1) { //todo: check somehow to exclude tuple option here
        // object / tuple - one big object used to construct / or just provided one arg
        // todo could just require this type of annotation (kinda makes sense) and use it to generate obj and tuple test
        let row = {}
        for (let param in args[0]) {
            console.log("param");
            console.log(param);
            console.log(args[0]);
            if (!(Object.keys(args[0][param]).length > 0)) {
                console.warn("cases for param: " + param + " are not defined - skip")
                continue;
            }
            if (tableData.length == 0) {
                for (let pCase in args[0][param]) {
                    tableData.push({ [param]: pCase })
                }
            } else {
                let tableDataNew = []
                let tableDataNew2 = []

                for (let pCase in args[0][param]) {
                    console.log("pCase");
                    console.log(pCase);

                    // let tableDataNew = [...tableData]
                    let tableDataCloned = tableData.map(obj => ({ ...obj }));

                    // tableDataNew.forEach(rowObj => { console.log(rowObj); return { ...rowObj } })
                    console.log("tableData");
                    console.log(tableData);
                    console.log("tableDataNew firs");
                    console.log(tableDataNew);
                    console.log("pCase");
                    console.log(pCase);

                    tableDataCloned.forEach(row => {
                        row[param] = pCase
                    })
                    tableDataNew.push(...tableDataCloned)
                }
                tableData = tableDataNew
                console.log("tableDataNew new new ");
                console.log(tableData);
                console.log(tableDataNew);

                // tableData.forEach(row => {

                // })
            }
        }
        console.log("tableData");
        console.log(tableData);

    }
    else if (args.length > 1) {
        // tuple - multiple args provided seperately 
        // todo NotImplemented
        for (let arg in args) {
            for (let key in args[0]) {
                tableData.push({ arg })
            }
        }
    }
    return tableData
}


export function test22() {
    console.log("test22");
    console.log(containerArgDefObj);
    let d = document.createElement("div")
    d.id = "divForRes"
    document.body.appendChild(d)
    // let cart = cartesian([...argDef])
    // console.log("cart");
    // console.log(cart);

    let testRes = [
        { key1: 1, key2: 2, key3: 3 }
    ]

    // let comb = getCombinationTable(containerArgDefObj, dataArgDef) // multiple params
    // let comb = getCombinationTable(argDefObj, testsTable) also needs to be combined with each test, actually could just be cols
    let comb = getCombinationTable(argDefObj) // one obj

    comb.forEach((row, i, arr) => {
        let res = executeTests(testsTable)
        arr[i] = { ...arr[i], ...res }
    })

    console.log("comb");
    console.log(comb);
    let t = new Table({
        container: d,
        data: comb,
        header: { sth: "sth" },
        options: {
            header: {
                infer: true
                // hide: true
            }
        }
    })
    // Test()

}
