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

// interface TableConstructor<Data extends TableData> {
//     new ( container: TableContainer, header: Dict<string>, data: Data, options: TableOptions<Data> ): Table |
//     new (params:TableParams<Data>):Animal)
// };

class Point {
  // constructor();
  constructor(obj: { x: number, y: number });
  constructor(x: number, y: number);
  constructor(...args: [] | [{ x: number, y: number }], |[number, number]) {
    // ...
    switch (args.length) {
      case 0:
        // do the default behavior
        break;
      case 1:
        const [obj] = args;
        // do the object behavior
        break;
      default:
        const [x, y] = args;
        // do the x,y component behavior
        break;
    }
  }
}

export interface TableParams<Data extends TableData> {
  container: TableContainer,
  header: Dict<string>,
  data: Data,
  options?: TableOptions<Data> | {}
}

type asdf = { container: TableContainer, header: Dict<string>, data: Data, options: TableOptions<Data> } | TableParams<Data>
// INFO: constructor with one object, could also be flattened so options r on same lvl: 
// constructor(params: TableParams<Data>){





let table = new Table({})

