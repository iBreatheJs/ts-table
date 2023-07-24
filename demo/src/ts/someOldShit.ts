// @ts-nocheck
// todo: clean up
// import { Table } from '../../../src/table'
// import { Dict, EventConfig, SetArgsT, SortSig, TableData, TableOptions, TableParams } from '../../../src/types'
// import cryptoData from '../../../data/tradesTest'
// import { testData } from "../../../data/test-data";
// import { addEvents, events_default } from '../../../src/events'

// import { test22, testTest } from '../../tests/testTest'
import { Test } from "@lib/ts-test";
// import { Test } from "@libbb";

/* function idk() {

  console.log("tstable test server started")
  console.log(cryptoData)

  let header = {}
  let container = document.createElement('table')
  document.body.appendChild(container)
  let tParams: TableParams<typeof cryptoData> = {
    data: cryptoData,
    header: header,
    container: container
  }
  // let table = new Table({container: container,data:cryptoData,header:header})


  let emptyD = {}
  let h = { col1: "col1", col2: "coll2" }


  // function setArgs(...args: AddEventSig): SortSig {
  let setArgs: SetArgsT = function setArgs(...args) {
    let e: Event = args[0]
    let n: number = 33
    return [e, n]
  };

  // let doSth: SetArgsT = (event, table, el, cfg) => {
  //   alert("hs")
  //   return [event, 44]
  // };

  let doSth: SetArgsT = (event, table, el, cfg) => {
    alert("hs")
    return [event, 44]
  };

  const eventsTest: EventConfig = {
    "header": {
      click: {
        args: doSth,
        action: "sort"
      },
      // click: {
      //   args: setArgs,
      //   action: "sort"
      // },
      scroll: {
        args: setArgs,
        action: "add-row"
      }
    }
  } as const


  let opt: TableOptions<typeof testData.simple.data> = { eventConfig: eventsTest }


  // let table = new Table({ data: cryptoData, container: container })
  let table = new Table(container, cryptoData, null, opt)
  table.data = cryptoData
  // table.data = cryptoData
  // table.draw()


} */

function inputTests() {
  // testTest()
  test22()
}

// function basic() {
//   console.log("basic table scenario - tstable demo");
//   let container = document.createElement("table")
//   let params: TableParams<typeof testData.simple.data> = {
//     data: testData.simple.data,
//     container: container
//   }
//   document.body.appendChild(container)
//   let t = new Table(params)
// }

inputTests()
// idk()
// basic()












