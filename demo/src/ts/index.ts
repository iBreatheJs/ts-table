import { Table, TableCreator } from '../../../src/table'
import { AddEventSig, Dict, EventConfig, SetArgsT, SortSig, TableData, TableOptions, TableParams } from '../../../src/types'
import cryptoData from '../data/tradesTest'
import { addEvents, events_custom, events_default } from '../../../src/events'
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
  { col1: "data2", col2: "r2c2", kk: "kaka" },
  { col1: "data33333", col2: "r3c2" }
]
let emptyD = {}
let h = { col1: "col1", col2: "coll2" }


// function setArgs(...args: AddEventSig): SortSig {
let setArgs: SetArgsT = function setArgs(...args) {
  let e: Event = args[0]
  let n: number = 33
  return [e, n]
};

let doSth: SetArgsT = (event, table, el, cfg) {
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


let opt: TableOptions<typeof dataSimple> = { eventConfig: eventsTest }

// let table = new Table({ data: cryptoData, container: container })
let table = new Table(container, cryptoData, undefined, opt)
// table.data = cryptoData
// table.data = cryptoData
table.draw()

type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P extends Table<infer X> ? X : P : never;
type extractGeneric<Type> = Type extends Table<infer X> ? X : never

type extracted = Parameters<typeof addEvents>


let tc = new TableCreator(container, dataSimple)
tc.draw()
tc

class ContainerCls {
  table: null | string
  constructor() {
    this.table = null
  }
}

const Employee: {

  firstname?: string,
  lastname: 'Doe',
  as: Function
} = {
  firstname: 'John',
  lastname: 'Doe',
  as: (e: any) => { e.firstname :as structuredClone = "sdf" }
};

console.log(Employee.firstname);
// expected output: "John"

delete Employee.firstname;

console.log(Employee.firstname);
// expected output: undefined

Employee.as(Employee)
Employee.firstname
interface A<Data extends TableData> {
  t: Table<Data> | TableCreator<Data>
  draw: Function
}

let a: A<typeof dataSimple> = {
  t: new TableCreator(container, dataSimple),
  draw: () => { return new Table(container, dataSimple) }
}

a.draw()
a.t


