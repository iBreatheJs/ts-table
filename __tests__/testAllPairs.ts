import { Table, TableContainer, TableData, TableOptions } from '../table';


// test configs

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

let tableTradesOptions: TableOptions<IData> = {
    alternateColour: false,
}




let containerInput = document.createElement("input")



/**
 * TABLE CREATION
 * 
 * @description
 * pass different cointainers and test:
 *    - return values (should be table if it works) 
 *    - IDs 
 *    - parent Element of table if arg=div
 * 
 * @cases
 * TABLE
 *    with id
 *    no id
 * DIV
 *    with id
 *    no id (auto assign)
 * STRING
 *    id of table
 *    id of div
 *    id of sth else --> throw error
 *    new name for table
 */


/* 
1, 2, 3
11, 21, 31
11, 22, 31



*/

