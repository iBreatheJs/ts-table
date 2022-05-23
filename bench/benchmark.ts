// @ts-nocheck
// TODO!!: fix ts

import { mapTransactionData } from "../../../mapData";
import { fetchEzy } from "../../../utils";
import { TableData } from "../table";
import { TableTest } from "./tableTest";

console.time("start")
function getData() {
    return fetchEzy<TableData>('/_get-all-transactions').then((res: any) => {
        console.log("all transactions res")
        console.log(res.data)
        if (res.error.length) {
            console.error("error with fetching data")
        } else {
            return res.data
        }
    })
}

let button = document.createElement("button");
button.onclick = buttonClicked
let settingsHtml = document.getElementById("settings") as HTMLElement
settingsHtml.appendChild(button)

var ROWS_HIDDEN = false
function buttonClicked() {
    console.time("btnActn")
    var tableTestHtml = document.getElementById("tableTransactions") as HTMLTableElement
    let rowCnt = 0
    
    let disp = ROWS_HIDDEN ? "": "none"
    for (let i = 0; i < tableTestHtml.rows.length; i++) {
        let row = tableTestHtml.rows[i]
        
        row.style.display = disp
        rowCnt++
    }
    ROWS_HIDDEN = !ROWS_HIDDEN
    console.log( rowCnt + " rows hidden")
    console.timeEnd("btnActn")
}



getData().then(data => mapTransactionData(data)).then(data => {
    console.log("get data \n")
    console.time("generateTable")
    var tableTest = new TableTest(data);
    tableTest.constructTable()
    console.timeEnd("generateTable")



    // setTimeout(() => {
    //     for (let i = 0; i < tableTestHtml.rows.length; i++) {
    //         let row = tableTestHtml.rows[i]
    //         row.style.display = ""
    //         rowCnt++
    //     }

    // }, 1000);

    console.timeEnd("loopRows")


    console.log("rowCnt")
    console.log(rowCnt)

})

// test hide show 

console.log("started benchmark test of table")
console.timeEnd("start")

