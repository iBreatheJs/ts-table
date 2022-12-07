import { addEvents } from "./events";
import { Table } from "./table";
import { ColData, RowData, TableContainer, TableData } from "./types";

export function drawTable<Data extends TableData>(table: Table<Data>) {
    console.time("drawTable")
    console.log("draw table");
    console.log(table.data);



    // checks
    // todo/assertion
    let container = drawTableChecks(table.container, table.data, table) as HTMLTableElement


    // HEADER
    if (table.header) drawTableHeader(table)

    // draw
    todo: // narrow container to htmltableelement
    drawTableBody(table, container)

}
function drawTableChecks<Data extends TableData>(container: TableContainer, data: Data, table: Table<Data>) {
    // checks if necessary properties are configured
    // necessary is:
    //  data: for the table
    //  container: where to put it
    // consider:
    //  data - table could be empty
    //  container - could default to sth like append to body



    // let missing
    // let errTmpl = `missing property ${missing} required for drawing table`
    // if (!container) { missing = "container"; throw new Error(errTmpl); }
    // if (!data) missing = "data"
    // // todo: test empty and editable, test empty with dynamic data (when implementing cbd grid)
    // if (!data) console.warn("table is drawn empty, no data was provided")
    if (!container) {
        console.warn("table is appended to body, no container was provided")
        let div = document.createElement("div")
        table.container = document.body.appendChild(div)
    }

    return container



    // checks - container
    // console.debug("draw Table " + this.container.id != '' ? this.container.id : "no id - consider setting an ID before table.drawTable()");
    // console.debug("draw Table " + (container.id != '' ? container.id : "with no id - consider setting an ID before table.drawTable()") + " with " + data.length + " rows");

    // call these things here so i can set them after new Table and before drawing
    // TODO: check if this makes sense
    // this.secondConstructor()

    // // check if table exists in DOM
    // setTimeout(() => {
    //     if (!document.getElementById(this.container.id)) console.warn("Table " + this.container.id + " was drawn 5s ago, but does not exist on DOM, verify container param or add manually");
    // }, 5000);
    // // if (!document.getElementById(this.container.id)) console.error("Table " + this.container.id + " should bo added to DOM before it can be drawn, verify container param or add manually");

    // // set to true once table is drawn
    // if (this.initialized) console.warn("TODO: Possible error? drawTable should not be usded to update the table! " +
    //     "Instead use the update methode/s which aim to keep the data object, tablecells and its dependent fields in sync")


    // // always enclose table in div necessary for positioning overlay for auto compleate suggestions
    // // possibly todo check with grid module: if parent is body the div gets added at the bottom which moves everything defined below in html file above
    // this.container.style.position = "absolute"
    // if (!this.container.closest("div")) {
    //     let parent = this.container.parentNode
    //     if (parent) {
    //         let div = document.createElement("div");
    //         div.setAttribute("id", this.container.id + "-div")
    //         div.style.position = "relative"
    //         parent.appendChild(div)
    //         div.appendChild(this.container)
    //     } else {
    //         throw ("cant create parent div for table " + this.container.id + " no parentNode found")
    //     }
    // }
}



// let drawTableDraw = <Data extends TableData>() => {
function drawTableBody<Data extends TableData>(table: Table<Data>, container: HTMLTableElement) {
    console.log("drawtabledrawdwwww");


    // TABLE

    // check data structure
    if (!Array.isArray(table.data)) {
        throw new Error("todo: for now only use array and transform array, reevaluate if it makes sense to deal w other data structures")
    }
    var dataIsArray = Array.isArray(table.data)
    // array verson:
    // let tbody = container.createTBody();

    // // TODO: check this here y did i not put it in the function??
    // // for in returns key (and also Array index) as string
    // for (let row in this.data) {
    //     this.addRow(tbody, row)
    // }

    // // add row
    // if (this.options?.extendableRows) {
    //     let tbody = container.createTBody();
    //     this.addRow(tbody, "header")
    // }
    // // filter box for this table
    // if (filterRow) {
    //     this.addFilterBox(filterRow)
    // }
    // // TODO: when is this used? while buildigng sdlfjs;fdl
    // this.initialized = true
    // this.changeColourEvenRows()



    var keyOrIndex: number | string

    let tbody = container.createTBody();
    table.container = table.container as HTMLTableElement
    table.container.appendChild(tbody)


    for (let row of table.data) {
        table.addRow(table, row)
    }

    // // TODO: check this here y did i not put it in the function??
    // // for in returns key (and also Array index) as string
    // for (let row in this.data) {

    //     // convert string to number for tsc - only necessary when checking for types when indexing data (arr/dict)
    //     // tried a million years and approches but there is not satisfying way to make ts understand it, it seems
    //     // TODO document in md
    //     // if (isArray(this.data)) keyOrIndex = +keyOrIndex; //!!!!

    //     this.addRow(this, row)
    // }

    // // add row
    // if (this.options.extendableRows) {
    //     let tbody = container.createTBody();
    //     this.addRow(tbody, "header")
    // }
    // // filter box for this table
    // if (filterRow) {
    //     this.addFilterBox(filterRow)
    // }
    // // TODO: when is this used? while buildigng sdlfjs;fdl
    // this.initialized = true
    // this.changeColourEvenRows()

    console.timeEnd("drawTable")

}

function drawTableHeader<Data extends TableData>(table: Table<Data>) {
    // HEADER
    // console.log(this.container)

    // todo make sure container is a htmltableelement
    let container = table.container as HTMLTableElement
    container.classList.add("tableBasic")
    let thead = container.createTHead();

    // // insert searchbar in header if option is checked
    let searchRow = thead.insertRow();
    let searchCell = document.createElement("td");
    searchCell.setAttribute("colspan", String(Object.keys(table.header).length))
    searchRow.append(searchCell)


    // if (this.options.search) {

    //     let searchInput = document.createElement("input");
    //     searchInput.type = "text";
    //     searchInput.placeholder = "Searcg for anything in Row or filter";
    //     searchInput.id = this.container.id + "_search"
    //     searchInput.style.float = "left"; // todo better style wo float
    //     this.searchHtml = searchInput

    //     let searchVal = "";
    //     searchInput.onkeyup = (ev) => {
    //         if (searchInput.value === searchVal) return;

    //         let filter = {
    //             val: searchInput.value,
    //             include: searchInput.value < searchVal ? true : false // true -> deleted char -> include hidden rows(depending on other filters), false - added char --> narrow / remove visible rows
    //         }
    //         searchVal = searchInput.value;

    //         this.filter_oneAtATime(filter)

    //     }
    //     searchCell.append(searchInput)
    // }

    // // i'll leave this check here instead of constructor so the table can be redrawn with diffrent params - idk if theres a case for that tho
    // if (this.options.rowCount != false) {
    //     this.rowCntHtml = document.createElement("div");
    //     this.rowCntHtml.style.float = "left"; // todo better style wo float
    //     this.rowCntHtml.id = this.container.id + "_row-counter";
    //     this.rowCntHtml.innerHTML = String(this.tableData.length)
    //     searchCell.append(this.rowCntHtml)
    // }




    // // insert filter box in header if option is checked
    // var filterRow = null
    // if (this.options.filter) {
    //     filterRow = thead.insertRow();
    //     let btn = document.createElement("button");
    //     btn.style.float = "left"; // todo better style wo float
    //     btn.textContent = "fltr"
    //     searchCell.append(btn)
    // }

    // if (this.options.showRules) {
    //     let rulesRow = thead.insertRow();
    //     let btn = document.createElement("button");
    //     btn.textContent = "rulez"
    //     btn.style.float = "left"; // todo better style wo float
    //     searchCell.append(btn)
    //     rulesRow.innerHTML = "rulez"
    // }

    // todo: auto header based on data

    let rowHeader = thead.insertRow();
    var colNr = 0;
    for (let key in table.header) {
        let nr = colNr
        let th = document.createElement("th");
        // Object.assign(th.style, tableStyle.th);
        // th.style.cssText = " border: 1px solid #ddd;"

        let test = table.eventConfig
        console.log("test");
        console.log(test);

        addEvents(table, th, table.eventConfig?.header)

        // if sortable
        // if (this.options.sortable?.all) {
        //     th.addEventListener('click', () => { this.sortTable(nr), this.changeColourEvenRows() }, false);

        //     // TODO: implement for specific cols only / possibility to disable some
        // }
        let text = document.createTextNode(table.header[key]);
        th.appendChild(text);
        rowHeader.appendChild(th);
        colNr++
    }


}

// export function addRow<Data extends TableData>(table: Table<Data>, keyOrIndex: string | number | "header") {
export function addRow<Data extends TableData>(table: Table<Data>, rowData: RowData) {
    console.log("add row");

    let row = document.createElement("tr");
    let tableHtml = table.container as HTMLTableElement
    let tbody = tableHtml.tBodies[0]

    // transform row data, called for each row TODO: that good here or call once and set all
    //todo
    // if (table.options?.transformData) {
    //     table.transformData(row, keyOrIndex as KeyOrIndex<Data>)
    //     // this.options.transformData(row, keyOrIndex as KeyOrIndex<Data>, this.tableData, this)
    // }

    // generate columns

    if (!table.header) {
        const uniqueKeys = [...new Set(table.data.map((item: RowData) => Object.keys(item)))]; // [ 'A', 'B']
    }

    for (const col in table.header) {

        let value: ColData;
        let cell = document.createElement("td");

        // if (keyOrIndex == "header") {
        //     value = col



        // } else {
        //     // @ts-ignore
        //     // for-in and Object.Keys return elements as string, 
        //     // if Array its certenly a number; if Dict its definitely a string
        //     // nice and easy js solution:
        //     // 
        //     // keyTableData is a special col that is associated with the key of the object that contains the rest of the cols as values
        //     // value = col == 'keyTableData' ? keyOrIndex : this.tableData[keyOrIndex][col];
        // }
        value = rowData[col];


        // TODO: Test performance difference with concated string 
        // also create rows first then render in one go, createElement for cols instead of insertCell already makes a difference

        // set same class for each cell in a col, TODO: remove bc possible collisions except I find a valid usecase 
        cell.classList.add(col)

        // // make editable
        // // TODO: move events outside in config
        // if (this.options.editable) {
        //     cell.setAttribute("contenteditable", "true")
        //     cell.addEventListener('blur', (event: Event) => {
        //         this.onEdit(event, keyOrIndex)
        //     })
        //     // more events but blur might be all thats needed
        //     // cell.addEventListener('click', (el: any) => this.onEdit(el))
        //     // cell.addEventListener('keyup', (el: any) => this.onEdit(el))
        //     // cell.addEventListener('paste', (el: any) => this.onEdit(el))
        //     // cell.addEventListener('input', (el: any) => this.onEdit(el))
        // }

        let text = document.createTextNode(String(value));
        cell.appendChild(text);
        row.appendChild(cell)
    }
    // add row to table body
    tbody.appendChild(row)
    // this.tableHtml.tBodies[0].appendChild(row)

    // function to manipulate row from outside, after it is rendered!
    // if (this.options.rowFunc) {
    //     this.options.rowFunc(row, keyOrIndex as KeyOrIndex<Data>, this.tableData as unknown as ROData<Data>, this)
    // }
    // // collapsible Row:
    // if (this.options.collapsible) {

    //     let rowHidden = this.tableHtml.insertRow();
    //     let cell = rowHidden.insertCell();
    //     cell.colSpan = Object.keys(this.header).length;
    //     cell.style.display = "none";

    //     // call callback function to fill the hidden cell
    //     this.options.collapsible(cell, keyOrIndex as KeyOrIndex<Data>, this.tableData as unknown as ROData<Data>)

    //     if (row) {
    //         row.onclick = () => {
    //             // toggle visibility
    //             if (cell.style.display === "none") {
    //                 cell.style.removeProperty('display');
    //             } else {
    //                 cell.style.display = "none";
    //             }

    //         }
    //     }
    // }
}