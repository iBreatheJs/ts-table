import { testParamCombinations } from "./testParams";
import { Table as TOG } from "@lib/ts-table/src/tableOG";
import { testData } from "@lib/ts-table";

console.log("started ts-table demo server");


testParamCombinations()
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