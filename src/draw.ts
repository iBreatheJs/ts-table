import { addOptionsBox, tableDefaultConf } from "./defaultConfig";
import { getOrCreateContainer } from "./container";
import { addEvents } from "./events";
import { Table } from "./table";
import { CellData, Dict, EventConfig, RowData, TableContainer, TableData, TableHeader } from "./types";

export function drawTable<Data extends TableData>(table: Table<Data>) {
    console.log("draw table");

    // table.options.render.default = renderCellHtmlTable

    // checks
    // header is infered in drawTableChecks based on data (for indexing cols), remember state here to skip drawing of header
    // let skipHeader = table.header === false ? true : false;
    let container = getOrCreateContainer(table.container)
    table.container = container
    drawTableChecks(table.container, table.data, table)

    //todo make shure container n header are the right type, (returned from checks!??)
    // table.header = table.header as TableHeader

    // HEADER

    console.log("headerrr bf");
    console.log(table.options);
    if (table.options.header.infer) table.header = { ...inferHeader(table.data), ...table.header } // setup header on draw could be in constructor after setup options
    console.log("header infered:");
    console.log(table.header);
    if (!table.options.header.hide) { drawTableHeader(table.header, container, table) }


    // draw
    todo: // narrow container to htmltableelement
    drawTableBody(table, container)

    // maybe put it in drawHeader theres also the other tr in thead with colspan
    if (table.options.showOptions) {
        console.warn("todo: this is moved to ArgVisualizer");

        if (!container.tHead) throw new Error("tried to add optionsBox to tableHeader before creation")
        // let optionsRow = container.tHead.insertRow(0); // 0 inserts at top
        // let optionsCell = document.createElement("td");
        // optionsCell.setAttribute("colspan", String(Object.keys(table.header).length))
        // optionsRow.append(optionsCell)
        // optionsCell.innerHTML = "options:\n"
        // addOptionsBox(optionsCell, Table)
    }

    console.timeEnd("drawTable")
    return container

}

/**
 * todo
 * make that actual checks that throw errors and warnings if certain conditions, required for drawing the table, r not met 
 * do the options setup before but idk when draw table makes sense to be recalled and if and if it should be here...??>?>?
 */
function drawTableChecks<Data extends TableData>(container: TableContainer, data: Data, table: Table<Data>) {
    console.log("draw table checks");

    // checks if necessary properties are configured
    // necessary is:
    //  data: for the table
    //  container: where to put it
    // consider:
    //  data - table could be empty
    //  container - could default to sth like append to body

    if ((!table.data || !Object.keys(table.data)) && !table.header) {
        throw new Error("Ether `data` or `header` has to be set to draw the table.")
    }

    // moved the header logic into setupOptions called in constructor
    return

    // // explicit request for no header, but data is provided and not empty
    // // header is created in memory for indexing cols but not drawn to DOM
    // if (table.header === false) {
    //     console.log("Drawing table with no header (table.header == false).");
    //     table.header = {}
    // } else if (table.header === true) {
    //     table.header = {}
    // } else {
    //     // only for ordered data like array. might implement that in the future but probably not worth it because 
    //     // headers are found relatively fast, helpfull for indexing and can be hidden in dom
    // }


    // // ----- these r more conversons than checks

    // // infer table header based on unique keys in data
    // table.header = inferHeader<Data>(table.data)




    // // let missing
    // // let errTmpl = `missing property ${missing} required for drawing table`
    // // if (!container) { missing = "container"; throw new Error(errTmpl); }
    // // if (!data) missing = "data"
    // // // todo: test empty and editable, test empty with dynamic data (when implementing cbd grid)
    // // if (!data) console.warn("table is drawn empty, no data was provided")
    // if (!container) {
    //     console.warn("table is appended to body, no container was provided")
    //     let div = document.createElement("div")
    //     table.container = document.body.appendChild(div)
    // }

    // // todo make sure container is a htmltableelement and change tableBasic to value from config
    // container = container as HTMLTableElement
    // container.classList.add("tableBasic")

    // return



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

function inferHeader<Data extends TableData>(data: Data) {

    // auto generate header
    let header: TableHeader = {}
    if (Array.isArray(data)) {
        // get unique keys
        // todo: store and merge w keys specified in wrapper (cdb) for possible keys which could be fetched from db
        let uniqueKeys: string[]
        let keySet = new Set<string>();
        for (let row of data) {
            for (let col in row) {
                keySet.add(col);
            }
        }
        uniqueKeys = [...keySet]

        // unique keys to header
        let h: Dict<string> = {}
        if (!uniqueKeys) {

        } else {
            for (let val of uniqueKeys) {
                header[val] = val
            }
        }
    }
    return header
}

// function drawTableHeader<Data extends TableData>(table: Table<Data>) {
function drawTableHeader<Data extends TableData>(header: TableHeader, container: HTMLTableElement, table: Table<Data>) {
    console.log("draw table header");
    console.log(header)
    console.log(container)
    // HEADER
    // console.log(this.container)

    // todo make sure container is a htmltableelement
    // container = container as HTMLTableElement
    let thead = container.createTHead();


    // // insert searchbar in header if option is checked
    let searchRow = thead.insertRow();
    let searchCell = document.createElement("td");
    searchCell.setAttribute("colspan", String(Object.keys(header).length))
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

    // i'll leave this check here instead of constructor so the table can be redrawn with diffrent params - idk if theres a case for that tho
    if (table.options.rowCount != false) {
        table.rowCntHtml = document.createElement("div");
        table.rowCntHtml.style.float = "left"; // todo better style wo float
        // table.rowCntHtml.id = table.container.id + "_row-counter";
        table.rowCntHtml.innerHTML = String(table.data.length)
        searchCell.append(table.rowCntHtml)
    }




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

    if (typeof header == "boolean") {
        throw new Error("tried to add row to table with invalid header");
    }

    let rowHeader = thead.insertRow();
    var colNr = 0;
    for (let key in header) {
        let nr = colNr
        let th = document.createElement("th");
        // Object.assign(th.style, tableStyle.th);
        // th.style.cssText = " border: 1px solid #ddd;"

        let test = table.eventConfig

        addEvents(table, th, table.eventConfig?.header)

        // if sortable
        // if (this.options.sortable?.all) {
        //     th.addEventListener('click', () => { this.sortTable(nr), this.changeColourEvenRows() }, false);

        //     // TODO: implement for specific cols only / possibility to disable some
        // }
        let text = document.createTextNode(header[key]);
        th.appendChild(text);
        rowHeader.appendChild(th);
        colNr++
    }
}

// let drawTableDraw = <Data extends TableData>() => {
function drawTableBody<Data extends TableData>(table: Table<Data>, container: HTMLTableElement) {
    console.log("drawtable body");
    console.log(table.header);
    // TABLE

    // check data structure
    // if (!Array.isArray(table.data)) {
    //     throw new Error("todo: for now only use array and transform array, reevaluate if it makes sense to deal w other data structures")
    // }
    // var dataIsArray = Array.isArray(table.data)
    // array verson:
    // let tbody = container.createTBody();

    // // TODO: check this here y did i not put it in the function??
    // // for in returns key (and also Array index) as string
    // for (let row in this.data) {
    //     this.renderRowHtmlTable(tbody, row)
    // }

    // // add row
    // if (this.options?.extendableRows) {
    //     let tbody = container.createTBody();
    //     this.renderRowHtmlTable(tbody, "header")
    // }
    // // filter box for this table
    // if (filterRow) {
    //     this.addFilterBox(filterRow)
    // }
    // // TODO: when is this used? while buildigng sdlfjs;fdl
    // this.initialized = true
    // this.changeColourEvenRows()
    // var keyOrIndex: number | string




    let tbody = container.createTBody();
    table.container = table.container as HTMLTableElement
    table.container.appendChild(tbody)
    if (table.data) {
        console.log("table.data in draw");
        console.log(table.data);

        if (Array.isArray(table.data)) {
            for (let row = 0; row < table.data.length; row++) {
                if (table.options.render?.row) {
                    table.options.render?.row(table, row)
                }
                else table.renderRowHtmlTable(table, row)
            }
        }
        else {
            // data is object not array
            for (let row in table.data) {
                console.log("row is object");
                console.log(table.data);

                if (table.options.render?.row) {
                    table.options.render?.row(table, row)
                }
                else table.renderRowHtmlTable(table, row)
            }

        }
    }
}
type NestedCellData = CellData | Dict<NestedCellData>

// nestedData type is ColData | Dict with colData but unknown lvl of nesting... some recursive dict or sth, idk
// useNestedData in case the value should be undefined
export function renderCellHtmlTable<Data extends TableData>(table: Table<Data>, idx: [number, string], cell: HTMLTableCellElement, nestedData?: NestedCellData, useNestedData: boolean = false) {
    let data = nestedData === undefined ? table.data[idx[0]][idx[1]] : nestedData
    // let data = !useNestedData ? table.data[idx[0]][idx[1]] : nestedData
    if (typeof data === "object" && data != null) {
        // console.log("data rendercell");
        // console.log(data);

        // arr / tuple type:
        // if (Array.isArray(data)) {
        //     console.log("isArray");
        //     for (let val of data) {
        //         console.log(val);

        //         let innerCell = document.createElement("td")
        //         cell.appendChild(innerCell)
        //         renderCellHtmlTable(table, idx, innerCell, val, true)
        //     }

        // }
        // else {
        for (let key in data) {

            let innerCell = document.createElement("td")
            cell.appendChild(innerCell)
            renderCellHtmlTable(table, idx, innerCell, data[key])
        }
        // }
    } else {
        let text = document.createTextNode(String(data));
        cell.appendChild(text);
    }
}

// export function renderRowHtmlTable<Data extends TableData>(table: Table<Data>, keyOrIndex: string | number | "header") {
export function renderRowHtmlTable<Data extends TableData>(table: Table<Data>, rowIdx: number) {
    let row = document.createElement("tr");
    let tableHtml = table.container as HTMLTableElement
    let tbody = tableHtml.tBodies[0]

    // transform row data, called for each row TODO: that good here or call once and set all
    // //  todo:
    // if (table.options?.transformData) {
    //     table.transformData(row, keyOrIndex as KeyOrIndex<Data>)
    //     // this.options.transformData(row, keyOrIndex as KeyOrIndex<Data>, this.tableData, this)
    // }

    // generate columns

    // if (!table.header) {

    //     if (Array.isArray(table.data)) {

    //         // 105ms 
    //         const uniqueKeys = [...new Set(table.data.map((item: RowData) => Object.keys(item)))]; // [ 'A', 'B']
    //     }
    //     // console.log("uniqueKeys");
    //     // console.log(uniqueKeys);

    // }


    for (const col in table.header) {
        let value = table.data[rowIdx][col];

        let cell = document.createElement("td");
        cell.contentEditable = "true"

        // TODO: Test performance difference with concated string 
        // also create rows first then render in one go, createElement for cols instead of insertCell already makes a difference

        // set same class for each cell in a col, TODO: remove bc possible collisions except I find a valid usecase 
        cell.classList.add(col) // idk if that is even used if needed should be a data attr

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

        // todo: assign renderer to use to class instead of checks 
        if (table.options.render?.colContent)
            table.options.render.colContent(table, [rowIdx, col], cell)
        else
            renderCellHtmlTable(table, [rowIdx, col], cell)
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

/**
 * only change data (innerHtml of cells)
 * only modify DOM Nodes if rowNr changes (remove / add (un)necessary rows)
 */
function redrawWithChangedData() {

}