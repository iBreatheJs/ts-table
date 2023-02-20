import { Table } from '../src/table';
import { TableOptions } from '../src/types';


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

describe('TABLE CREATION', () => {
  describe('container: TABLE', () => {
    /**
     * container: TABLE with ID
     * ID: tableID (leave as is)
     */
    {
      let container = document.createElement("table")
      container.id = "tableID"
      let table = new Table(container, header, data)
      test('create Table with container type ' + container.tagName + " (with ID - leave id as is) id: " + table.tableHtml.id, () => {
        expect(table.tableHtml.tagName, 'should return table').toBe("TABLE");
        expect(table.tableHtml.id, 'id should be ID of table passed').toBe(container.id);
      });
    }

    /**
     * container: TABLE with NO ID
     * ID: tableID (todo: asign one?)
     */
    {
      let container = document.createElement("table")
      let table = new Table(container, header, data)
      test('create Table with container type ' + container.tagName + " NO id, todo: auto asign? id:" + table.tableHtml.id, () => {
        expect(table.tableHtml.tagName, 'should return table').toBe("TABLE");
        expect(table.tableHtml.id).toBe(container.id);
      });
    }
  });

  describe('container: DIV', () => {
    /**
     * container: DIV with ID
     * ID: table-<divID>
     * 
     * create table in container
     */
    {
      let container = document.createElement("div")
      container.id = "div-id"
      let table = new Table(container, header, data)
      test('create Table with container type ' + container.tagName + " id: " + table.tableHtml.id, () => {
        expect(table.tableHtml.tagName, 'should return table').toBe("TABLE");
        expect(table.tableHtml.parentElement, 'table has to be inside the div passed as arg').toBe(container);
        expect(table.tableHtml.id, 'id should match pattern table-<divID>').toBe("table-" + container.id);
      });
    }

    /**
     * container: DIV no ID
     * ID: table-<num> //auto assign
     * 
     * leave div ID unchanged
     * auto asign table id
     * create Table in div
     */
    {
      let container = document.createElement("div")
      let table = new Table(container, header, data)
      test('create Table with container type ' + container.tagName + " id: " + table.tableHtml.id, () => {
        expect(table.tableHtml.tagName).toBe("TABLE");
        expect(table.tableHtml.parentElement, 'table has to be inside the div passed as arg').toBe(container);
        expect(table.tableHtml.id, 'id should match pattern table-<num>').toMatch(/table-[1-9][0-9]*/);
      });
    }
  })

  describe('container: STRING', () => {
    /**
     * container: STRING, ID of Table
     * ID: leave as is
     */
    {
      let tableHtml = document.createElement("table")
      tableHtml.id = "tableID"

      let container: any = tableHtml.id
      let type: TableData = container.tagName ?? typeof container

      let table = new Table(tableHtml.id, header, data)
      test('create Table with container type ' + type + " id: " + table.tableHtml.id, () => {
        expect(table.tableHtml.tagName, 'should return table').toBe("TABLE");
        expect(table.tableHtml.id, 'id should match string passed').toBe(container);
      });
    }

    /**
     * container: STRING, ID of DIV
     * ID: table-<num> //auto assign
     * 
     * leave div ID unchanged
     * auto asign table id table-<divID>
     * create Table in div
     */
    {
      let container = document.createElement("div")
      let table = new Table(container, header, data)
      test('create Table with container type ' + container.tagName + " id: " + table.tableHtml.id, () => {
        expect(table.tableHtml.tagName).toBe("TABLE");
        expect(table.tableHtml.parentElement, 'table has to be inside the div passed as arg').toBe(container);
        expect(table.tableHtml.id).toMatch(/table-[1-9][0-9]*/);
      });
    }
  })
})




// tableCreation(containerTable, "table")
// tableCreation(containerDiv, "div")
// tableCreation("containerTable", "string (id of table)")
// tableCreation("containerDiv", "string (id of div)")
// tableCreation("containerString", "string (not used before)")



// should throw error:
tableCreationWithError(containerInput, "input", "Cant initialize Table with provided container, invalid Tag name")

function tableCreationWithError(container: TableContainer, type: string, error: string) {
  test('create Table with invalid container type ' + type + " resulted in expected error: " + error, () => {
    expect(() => {
      new Table(container, header, data)
    }).toThrow(error);
  });
}