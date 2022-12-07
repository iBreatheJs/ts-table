import { Table } from '../../../src/table'
import { TableData, TableOptions, TableParams } from '../../../src/types'
import cryptoData from '../data/tradesTest'
import { events_custom, events_default } from '../../../src/events'
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

let dataSimple = [
  { col1: "data1", col2: "r1c2" },
  { col1: "data2", col2: "r2c2" },
  { col1: "data33333", col2: "r3c2" }
]
let emptyD = {}
let h = { col1: "col1", col2: "coll2" }
let opt: TableOptions<typeof dataSimple> = { eventConfig: events_custom }
// let table = new Table({ data: cryptoData, container: container })
let table = new Table(container, dataSimple, h, opt)
// table.data = cryptoData
// table.data = cryptoData
table.draw()
