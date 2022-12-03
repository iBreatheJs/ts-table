import { Table } from '../../../src/table'
import { TableData, TableParams } from '../../../src/types'
import cryptoData from '../data/tradesTest'
console.log("tstable test server started")
console.log(cryptoData)

let header = {}
let container = document.createElement('table')
let tParams: TableParams<typeof cryptoData> = {
  data: cryptoData,
  header: header,
  container: container
}
// let table = new Table({container: container,data:cryptoData,header:header})

let emptyD = {}
// let table = new Table({ data: cryptoData, container: container })
let table = new Table(container, cryptoData)
// table.data = cryptoData
// table.data = cryptoData
// table.draw()
