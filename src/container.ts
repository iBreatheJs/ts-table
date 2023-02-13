import { Table } from './table';
import {
    TableContainer
} from './types'


/**
     * 
     * @param container  
     *      @type {HtmlTableElement} - use provided table
     *      @type {string} - create table if no table, create table in div if div
     *      @type {undefined} - create table, dev has to add to dom //todo
     * @returns 
     * 
     * @description
     * 
     * This methode gets, or if not existing, creates the container in which the table will be placed.
     * 
     * todo desc
     * 
     * 
     * assign HTMLTableElement to this.tableHtml or throw error
     * Table is ether:
     *      - passed to constructor (table)
     *      - found in DOM (string)
     *      - created (string, div, undefined, null)
     * 
     * ID is:
     *      - kept (arg: Table, string which is ID of Table found in DOM)
     *      - assigned (string which is ID of div or new ID, div) - format: table_<string> eg. table_name
     *          - div: use id of div and prefix with "table_"
     *      - generated (undefined, null) - format: table_<number> eg. table_15 - num based on Tables instantiated
     * 
     * ERROR: 
     *      invalid container type //todo consider error log but creating table
     *      
     * todo consider always assigning an ID in case the passed element has none 
     */
export function getOrCreateContainer(container: TableContainer): HTMLTableElement {

    var tableHtml: HTMLTableElement
    let id;

    // check DOM
    let html = typeof container === "string" ?
        document.getElementById(container) :
        container


    // if NO container - create ONLY in memory and auto assign name as "table_<num>" 
    /* if (!container) {
        // get uniqe ID based on tables instantiated
        let num = Table.tablesInstCnt
        // in case it was created by sth other than this lib
        while (document.getElementById("table_" + num)) {
            num++
        }
        id = "table_" + num
        console.warn('created Table WITHOUT CONTAINER as "' + container + '", needs to be added to DOM manually or instantiate with valid id')
    } */

    // can only be string or HtmlElement (undefined -> string) // todo could be removed most likely
    // if (typeof container !== "string" && !isHtmlElement(container)) {
    //     throw new ReferenceError("Table cant be initialized with provided container.")
    // }



    if (!html) {
        // get uniqe ID based on tables instantiated
        let num = Table.tablesInstCnt
        // in case it was created by sth other than this lib
        while (document.getElementById("table_" + num)) {
            num++
        }
        id = "table-" + num

        if (!container) {
            console.warn('created Table WITHOUT CONTAINER as "' + container + '", needs to be added to DOM manually or instantiate with valid id')
        }



        // element not found, create it ONLY IN MEMORY:
        let tableHtml = document.createElement("table");
        tableHtml.classList.add("table-basic")

        // let id = html.id ? html.id : String(Table.tablesInstCnt)
        // todo id
        tableHtml.setAttribute("id", id)
        // html.appendChild(tableHtml)

        return tableHtml as HTMLTableElement

    } else {
        // element found, check tag
        var tagName = html?.tagName
        if (tagName === "TABLE") {
            return html as HTMLTableElement
        }
        else if (tagName === "DIV") {
            let tableHtml = document.createElement("table");
            tableHtml.classList.add("table-basic")
            let id = html.id ? html.id : String(Table.tablesInstCnt)
            tableHtml.setAttribute("id", "table-" + id)
            html.appendChild(tableHtml)

            return tableHtml as HTMLTableElement
        }
        else {
            throw new Error("Cant initialize Table with provided container, invalid Tag name")
        }
    }
}