import { testData } from "../../../data/test-data";
import { Table } from "../../../src/table";
import { testParamCombinations } from "./testParams";
// import { Table as TOG } from "@lib/ts-table/src/tableOG";
// import { testData } from "@lib/ts-table"; // todo: no clean imports

console.log("init ts-table demo");

// testTable()

// testParamCombinations()
// og()

function og() {
    let c = document.createElement("div")
    document.body.appendChild(c)
    let d = testData.simple.data

    const filter_config = {
        col1: "string",
        col2: {
            "bittrex": true,
            "kraken": true,
            "eth": true,
            "avax": true
        },
        col3: "string"
    }
    let tog = new TOG(c, testData.simple.header, testData.simpleNoUndefined.data, {
        sortable: { all: true },
        filter: { filterConfig: filter_config }
    })
    tog.drawTable()
}

function testTable() {
    let c = document.createElement("div")
    document.body.appendChild(c)
    let t = new Table({
        container: c, data: testData.simple.data, options: {
            extendedData: false
        },
        asdf: {
            test1: false,
            test2: 6
        }
    })
    t.draw()
    t._data
    t.data
    t.asdf
}