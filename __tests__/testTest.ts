import { Table } from "../src/table";
import {
    Dict,
    TableParams,
    TableOptions,
    TableHeader,
    RowData,
    EventConfig,
    // Actions,
    ActionConfig
} from '../src/types'

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
    var containerTable = document.createElement("table")
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

// execute for all combination
function execute(combination) {
    let container, id
    [container, id] = [...combination]

    // set id if attribute available, because of error on string
    try {
        container.id = id
    } catch (error) { }

    return new Table(container, header, data).tableHtml
}

// expected output all combination
function expect(table: HTMLTableElement) {
    let res = {
        testId: table.id
    }
    return res
}

const cartesian = <T>(items: T[][]) => [...cartesianIterator(items)];

function* cartesianIterator<T>(items: T[][]): Generator<T[]> {
    const remainder = items.length > 1 ? cartesianIterator(items.slice(1)) : [[]];
    for (let r of remainder) for (let h of items.at(0)!) yield [h, ...r];
}


export function testAllPairs(execute, expect, args: any, variablesNames) {
    // get all posibillities
    var cart = cartesian([...args]);
    console.log(cart)

    var res: TableData = []

    for (const combination of cart) {
        // let row = {...combination}
        let input: {} = combination.reduce((acc, curr, i) => (acc[variablesNames[i]] = curr ? curr.toString() : curr, acc), {});
        let output = expect(execute(combination))

        res.push({ ...input, ...output })
    }

    // let resTableHead = variablesNames
    let resTableHead = { 'container': "container", 'id': "id", "testId": "testId" }

    var resTableHtml = document.createElement("table")
    document.body.appendChild(resTableHtml)
    let resTable = new Table(resTableHtml, resTableHead, res)
    console.log("res")
    // console.log(resTable.header)
    // console.log(resTable.tableData)
    console.log(res)
    resTable.drawTable()
}


// actual tests, what should be checked / compared:



/**
 * check if table exists
 */
let testExists = () => {
}

/**
 * check header
 */
let testHeader = () => {
}

/**
 * check where in the DOM the table element is inserted.
 */
let testDomLocation = () => {
}


// rules

function rulesHeader() {
    let header: TableParams<typeof data>['header']
    switch (typeof header) {
        case "boolean":
            break;
        case "string":
            break;
        case true:
            break;

        default:
            break;
    }
    // if(header)
}