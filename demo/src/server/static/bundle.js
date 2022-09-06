/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../src/container.ts":
/*!***************************!*\
  !*** ../src/container.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getOrCreateContainer": () => (/* binding */ getOrCreateContainer)
/* harmony export */ });
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./table */ "../src/table.ts");

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
function getOrCreateContainer(container) {
    var tableHtml;
    let id;
    // check DOM
    let html = typeof container === "string" ?
        document.getElementById(container) :
        container;
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
        let num = _table__WEBPACK_IMPORTED_MODULE_0__.Table.tablesInstCnt;
        // in case it was created by sth other than this lib
        while (document.getElementById("table_" + num)) {
            num++;
        }
        id = "table-" + num;
        if (!container) {
            console.warn('created Table WITHOUT CONTAINER as "' + container + '", needs to be added to DOM manually or instantiate with valid id');
        }
        // element not found, create it ONLY IN MEMORY:
        let tableHtml = document.createElement("table");
        tableHtml.classList.add("table-basic");
        // let id = html.id ? html.id : String(Table.tablesInstCnt)
        // todo id
        tableHtml.setAttribute("id", id);
        // html.appendChild(tableHtml)
        return tableHtml;
    }
    else {
        // element found, check tag
        var tagName = html === null || html === void 0 ? void 0 : html.tagName;
        if (tagName === "TABLE") {
            return html;
        }
        else if (tagName === "DIV") {
            let tableHtml = document.createElement("table");
            tableHtml.classList.add("table-basic");
            let id = html.id ? html.id : String(_table__WEBPACK_IMPORTED_MODULE_0__.Table.tablesInstCnt);
            tableHtml.setAttribute("id", "table-" + id);
            html.appendChild(tableHtml);
            return tableHtml;
        }
        else {
            throw new Error("Cant initialize Table with provided container, invalid Tag name");
        }
    }
}


/***/ }),

/***/ "../src/table.ts":
/*!***********************!*\
  !*** ../src/table.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Table": () => (/* binding */ Table)
/* harmony export */ });
/* harmony import */ var _container__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./container */ "../src/container.ts");

class Table {
    /**
     *
     * @param tableHtml
     * @param header Key = name of associated data field, value = display name
     * @param tableData
     * @param options
     */
    constructor(params) {
        var _a;
        // this.tableHtml = params.container
        this.tableHtml = (0,_container__WEBPACK_IMPORTED_MODULE_0__.getOrCreateContainer)((_a = params.container) !== null && _a !== void 0 ? _a : null);
        this.header = params.header;
        this.data = params.data;
        this.options = params.options || {};
        // {container: TableContainer, header: Dict<string>, data: Data, options: TableOptions<Data> = {}}
        Table.tablesInstCnt++; // Number of Tables instantiated
        Table.tablesActiveCnt++; // Number of currently existing Table Instances
        console.log(this.tableHtml);
        return;
        registry.register(this, this.tableHtml);
        this.header = header;
        // this._data = data
        this.data = data;
        this.options = options;
        this.tableStyle = (options === null || options === void 0 ? void 0 : options.tableStyle) || tableStyle;
        this.initialized = false;
        // this.rowCntHtml = this.options.rowCount != false ? (() => {
        //     let rowCntHtml = document.createElement("div");
        //     rowCntHtml.id = this.tableHtml.id + "_row-counter";
        //     rowCntHtml.innerHTML = String(this.data.length)
        //     return rowCntHtml
        // })(): null
        this.filterConfig = null;
        this.rowCntHtml = null;
        this.searchHtml = null;
        // this.drawTable()
    }
}
Table.tablesInstCnt = 0; // Number of Tables instantiated
Table.tablesActiveCnt = 0; // Number of currently existing Table Instances


/***/ }),

/***/ "./src/data/tradesTest.js":
/*!********************************!*\
  !*** ./src/data/tradesTest.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"TGBACZ-RN4LO-DGATKM": {"ordertxid": "OXNK66-ROEFQ-AWRJ6I", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1640784104.7459874, "type": "buy", "ordertype": "limit", "price": "1.190000", "cost": "4760.000000", "fee": "6.664000", "vol": "4000.00000000", "margin": "0.000000", "misc": ""}, "TXHNXE-UN3ID-5FUQBG": {"ordertxid": "O2PI73-UMDVE-L4OOAV", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXBTZEUR", "time": 1640712956.43458, "type": "buy", "ordertype": "limit", "price": "42325.00000", "cost": "1003.86731", "fee": "1.40541", "vol": "0.02371807", "margin": "0.00000", "misc": ""}, "TFL2C2-3V5GR-L2LVMI": {"ordertxid": "O2PI73-UMDVE-L4OOAV", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXBTZEUR", "time": 1640712956.3076944, "type": "buy", "ordertype": "limit", "price": "42325.00000", "cost": "7928.82986", "fee": "11.10036", "vol": "0.18733207", "margin": "0.00000", "misc": ""}, "TXXRG5-HPZN7-JTE5WD": {"ordertxid": "O2PI73-UMDVE-L4OOAV", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXBTZEUR", "time": 1640712955.314204, "type": "buy", "ordertype": "limit", "price": "42325.00000", "cost": "1459.48620", "fee": "2.04328", "vol": "0.03448284", "margin": "0.00000", "misc": ""}, "TGYHVW-U2KU3-M6Z3OH": {"ordertxid": "O2PI73-UMDVE-L4OOAV", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXBTZEUR", "time": 1640712952.888419, "type": "buy", "ordertype": "limit", "price": "42325.00000", "cost": "91.79573", "fee": "0.12851", "vol": "0.00216883", "margin": "0.00000", "misc": ""}, "TF3RYA-JHMIA-7U6SSD": {"ordertxid": "O2PI73-UMDVE-L4OOAV", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXBTZEUR", "time": 1640712852.5756378, "type": "buy", "ordertype": "limit", "price": "42325.00000", "cost": "2826.48424", "fee": "3.95708", "vol": "0.06678049", "margin": "0.00000", "misc": ""}, "TJAV6S-QV5PA-FR3X2H": {"ordertxid": "O2PI73-UMDVE-L4OOAV", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXBTZEUR", "time": 1640712713.2145917, "type": "buy", "ordertype": "limit", "price": "42325.00000", "cost": "7852.03665", "fee": "12.56326", "vol": "0.18551770", "margin": "0.00000", "misc": ""}, "TIHB3A-OD42U-AAEA5B": {"ordertxid": "OCVNAM-NS76T-M3ZXYB", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1640651168.27262, "type": "buy", "ordertype": "limit", "price": "1.315000", "cost": "2954.918431", "fee": "4.727869", "vol": "2247.08625959", "margin": "0.000000", "misc": ""}, "TOSDPM-GDICY-2UFPLJ": {"ordertxid": "OCVNAM-NS76T-M3ZXYB", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1640651168.2073357, "type": "buy", "ordertype": "limit", "price": "1.315000", "cost": "53.798868", "fee": "0.086078", "vol": "40.91168657", "margin": "0.000000", "misc": ""}, "T5ZTQ4-VOUSG-WF4D3Z": {"ordertxid": "OCVNAM-NS76T-M3ZXYB", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1640651164.8794186, "type": "buy", "ordertype": "limit", "price": "1.315000", "cost": "2251.282701", "fee": "3.602052", "vol": "1712.00205384", "margin": "0.000000", "misc": ""}, "TC63BV-X42UB-ICGXMX": {"ordertxid": "OS7AR7-VZP3I-LBXUYH", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXBTZEUR", "time": 1639084142.9581213, "type": "sell", "ordertype": "limit", "price": "42280.00000", "cost": "6076.13617", "fee": "9.72182", "vol": "0.14371183", "margin": "0.00000", "misc": ""}, "TEHELV-XZ5I5-RTL57J": {"ordertxid": "OS7AR7-VZP3I-LBXUYH", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXBTZEUR", "time": 1639084142.8125403, "type": "sell", "ordertype": "limit", "price": "42280.00000", "cost": "9.64153", "fee": "0.01543", "vol": "0.00022804", "margin": "0.00000", "misc": ""}, "T4LVVM-DSYUB-I55YKI": {"ordertxid": "OS7AR7-VZP3I-LBXUYH", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXBTZEUR", "time": 1639084136.0588224, "type": "sell", "ordertype": "limit", "price": "42280.00000", "cost": "422.80000", "fee": "0.67648", "vol": "0.01000000", "margin": "0.00000", "misc": ""}, "TD6HVK-YJLVK-TLOUU3": {"ordertxid": "OS7AR7-VZP3I-LBXUYH", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXBTZEUR", "time": 1639084121.488708, "type": "sell", "ordertype": "limit", "price": "42280.00000", "cost": "1423.01458", "fee": "2.27682", "vol": "0.03365692", "margin": "0.00000", "misc": ""}, "TTMRWM-ZOBZE-GDKO7H": {"ordertxid": "OS7AR7-VZP3I-LBXUYH", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXBTZEUR", "time": 1639084119.9643414, "type": "sell", "ordertype": "limit", "price": "42280.00000", "cost": "140.00007", "fee": "0.22400", "vol": "0.00331126", "margin": "0.00000", "misc": ""}, "TLY3SF-AXHRA-5JAVE5": {"ordertxid": "OS7AR7-VZP3I-LBXUYH", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXBTZEUR", "time": 1639084116.8942456, "type": "sell", "ordertype": "limit", "price": "42280.00000", "cost": "136.97113", "fee": "0.21915", "vol": "0.00323962", "margin": "0.00000", "misc": ""}, "TIJLDN-TMZGQ-HZBRVL": {"ordertxid": "OS7AR7-VZP3I-LBXUYH", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXBTZEUR", "time": 1639084115.9937425, "type": "sell", "ordertype": "limit", "price": "42280.00000", "cost": "247.43651", "fee": "0.39590", "vol": "0.00585233", "margin": "0.00000", "misc": ""}, "TZSBRF-IQQH3-4SKBXG": {"ordertxid": "OOEGXC-WH26I-DLEFAA", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "DOTEUR", "time": 1639083412.0567539, "type": "sell", "ordertype": "limit", "price": "23.85000", "cost": "502.63242", "fee": "0.80421", "vol": "21.07473460", "margin": "0.00000", "misc": ""}, "TK4O6V-3HV6P-DTKK7G": {"ordertxid": "OOEGXC-WH26I-DLEFAA", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "DOTEUR", "time": 1639083412.0019317, "type": "sell", "ordertype": "limit", "price": "23.85000", "cost": "451.36758", "fee": "0.72219", "vol": "18.92526540", "margin": "0.00000", "misc": ""}, "TB3EAS-T25E4-5KQOZ6": {"ordertxid": "OU2RUO-CYUSY-V5ZNYS", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1639082987.6885312, "type": "sell", "ordertype": "limit", "price": "0.014355", "cost": "5742.026462", "fee": "14.929268", "vol": "400000.00000000", "margin": "0.000000", "misc": ""}, "TYRZ2D-6J5KM-WZCGEH": {"ordertxid": "OX3OKY-AMEXG-YD6PJV", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1639082832.6615913, "type": "sell", "ordertype": "limit", "price": "1.145563", "cost": "4582.252000", "fee": "11.913855", "vol": "4000.00000000", "margin": "0.000000", "misc": ""}, "TVUQNZ-4ZTIY-JYPXQN": {"ordertxid": "O3RCJG-CNPE7-LXKIQ3", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1639082721.3155093, "type": "sell", "ordertype": "limit", "price": "3610.60719", "cost": "14442.42877", "fee": "37.55032", "vol": "4.00000000", "margin": "0.00000", "misc": ""}, "TTKQFT-WA6TJ-3TMMCW": {"ordertxid": "O63QAM-AUDYO-YF3L6F", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "DOTEUR", "time": 1637913016.3146484, "type": "buy", "ordertype": "limit", "price": "33.50000", "cost": "1340.00000", "fee": "2.14400", "vol": "40.00000000", "margin": "0.00000", "misc": ""}, "TYOTKL-53LUF-JS3HSL": {"ordertxid": "OCAM4J-LJHFC-GXCPBG", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1637912514.5338285, "type": "buy", "ordertype": "limit", "price": "0.021900", "cost": "499.491290", "fee": "0.799186", "vol": "22807.82146704", "margin": "0.000000", "misc": ""}, "TFIVUU-ZFVVP-2PUXZU": {"ordertxid": "OCAM4J-LJHFC-GXCPBG", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1637912507.1609573, "type": "buy", "ordertype": "limit", "price": "0.021900", "cost": "1052.123297", "fee": "1.683397", "vol": "48042.15966535", "margin": "0.000000", "misc": ""}, "TKSPHE-SSE3T-Z4QDMI": {"ordertxid": "OCAM4J-LJHFC-GXCPBG", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1637912500.0741415, "type": "buy", "ordertype": "limit", "price": "0.021900", "cost": "638.385413", "fee": "1.021417", "vol": "29150.01886761", "margin": "0.000000", "misc": ""}, "T4SUNS-KWKGC-BY6KRX": {"ordertxid": "OVMYQC-MKX2B-5OU7GX", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1637912313.795421, "type": "buy", "ordertype": "limit", "price": "1.445000", "cost": "1445.000000", "fee": "2.312000", "vol": "1000.00000000", "margin": "0.000000", "misc": ""}, "TPQ34I-R66SE-36T5DN": {"ordertxid": "O4TA4J-KCLXW-HEV2AY", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1632849242.7948883, "type": "buy", "ordertype": "limit", "price": "1.750000", "cost": "770.912533", "fee": "1.233460", "vol": "440.52144733", "margin": "0.000000", "misc": ""}, "T5LUS4-3ZYQC-PZVZ5Z": {"ordertxid": "O4TA4J-KCLXW-HEV2AY", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1632849241.0358498, "type": "buy", "ordertype": "limit", "price": "1.750000", "cost": "350.000000", "fee": "0.560000", "vol": "200.00000000", "margin": "0.000000", "misc": ""}, "T46BE3-4SOWV-MF65UY": {"ordertxid": "O4TA4J-KCLXW-HEV2AY", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1632849220.991477, "type": "buy", "ordertype": "limit", "price": "1.750000", "cost": "1750.000000", "fee": "2.800000", "vol": "1000.00000000", "margin": "0.000000", "misc": ""}, "TM4PSH-6R72Z-LWP56Z": {"ordertxid": "O4TA4J-KCLXW-HEV2AY", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1632849135.3504922, "type": "buy", "ordertype": "limit", "price": "1.750000", "cost": "629.087467", "fee": "1.006540", "vol": "359.47855267", "margin": "0.000000", "misc": ""}, "TALLKE-J4D3N-FST62L": {"ordertxid": "OZ3I4I-PZOVZ-NURDYE", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1632701849.5732615, "type": "buy", "ordertype": "limit", "price": "1.870000", "cost": "1870.000000", "fee": "2.992000", "vol": "1000.00000000", "margin": "0.000000", "misc": ""}, "TN7LVQ-WKUV5-GTH5LD": {"ordertxid": "OWFGPV-F7VTI-OEW7NP", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1632475493.3023746, "type": "buy", "ordertype": "limit", "price": "0.012800", "cost": "2274.488402", "fee": "3.639181", "vol": "177694.40636853", "margin": "0.000000", "misc": ""}, "TDXAAA-AQYM5-XMJUF7": {"ordertxid": "OWFGPV-F7VTI-OEW7NP", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1632475492.1935637, "type": "buy", "ordertype": "limit", "price": "0.012800", "cost": "1104.711598", "fee": "1.767539", "vol": "86305.59363147", "margin": "0.000000", "misc": ""}, "TFGBAQ-E6DRW-25R4IX": {"ordertxid": "OWFGPV-F7VTI-OEW7NP", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1632475063.8000345, "type": "buy", "ordertype": "limit", "price": "0.012800", "cost": "76.800000", "fee": "0.122880", "vol": "6000.00000000", "margin": "0.000000", "misc": ""}, "TPDBUO-ALW5D-7EAMNJ": {"ordertxid": "OWFGPV-F7VTI-OEW7NP", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1632475048.231108, "type": "buy", "ordertype": "limit", "price": "0.012800", "cost": "384.000000", "fee": "0.614400", "vol": "30000.00000000", "margin": "0.000000", "misc": ""}, "TD4BD2-ZF243-OUGHG7": {"ordertxid": "O36E2G-HVYQD-UGJB2B", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXBTZEUR", "time": 1632256614.4818003, "type": "buy", "ordertype": "limit", "price": "35150.00000", "cost": "3515.00000", "fee": "5.62400", "vol": "0.10000000", "margin": "0.00000", "misc": ""}, "TGWJ3O-D6I6A-QPPQMF": {"ordertxid": "OGBT6I-BOQJJ-H76EJR", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1632256464.177562, "type": "buy", "ordertype": "limit", "price": "2410.00000", "cost": "1013.35022", "fee": "1.62136", "vol": "0.42047727", "margin": "0.00000", "misc": ""}, "TKPHLG-H5RB7-SPTLTA": {"ordertxid": "OGBT6I-BOQJJ-H76EJR", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1632256462.789813, "type": "buy", "ordertype": "limit", "price": "2410.00000", "cost": "3806.64978", "fee": "6.09064", "vol": "1.57952273", "margin": "0.00000", "misc": ""}, "TC5IBZ-FKFIY-VDZ4EQ": {"ordertxid": "OAZ7TN-EJFCU-Q7NPVP", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1632229201.2747784, "type": "buy", "ordertype": "limit", "price": "2580.00000", "cost": "5160.00000", "fee": "8.25600", "vol": "2.00000000", "margin": "0.00000", "misc": ""}, "TNFVMW-4CGDG-QLPJV7": {"ordertxid": "O32XWZ-EZVVO-MLWYHD", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1629017781.174763, "type": "sell", "ordertype": "limit", "price": "0.015750", "cost": "0.000000", "fee": "0.000000", "vol": "0.00000002", "margin": "0.000000", "misc": ""}, "TSYWJX-EU7KV-SENWGQ": {"ordertxid": "O32XWZ-EZVVO-MLWYHD", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1629017781.174142, "type": "sell", "ordertype": "limit", "price": "0.015750", "cost": "0.000000", "fee": "0.000000", "vol": "0.00001524", "margin": "0.000000", "misc": ""}, "TEDJIG-OGQFT-HXNHIV": {"ordertxid": "O32XWZ-EZVVO-MLWYHD", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1629017781.1730535, "type": "sell", "ordertype": "limit", "price": "0.015750", "cost": "2019.755150", "fee": "3.231608", "vol": "128238.42223871", "margin": "0.000000", "misc": ""}, "TFN4CG-X35UQ-ZFN7FW": {"ordertxid": "O32XWZ-EZVVO-MLWYHD", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1629016809.542103, "type": "sell", "ordertype": "limit", "price": "0.015750", "cost": "24.474083", "fee": "0.039159", "vol": "1553.91000000", "margin": "0.000000", "misc": ""}, "T5LY62-BWNG7-GQEF4E": {"ordertxid": "O3ZHXP-TJURP-KITR6Y", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1629016292.5732043, "type": "sell", "ordertype": "limit", "price": "2685.00000", "cost": "1859.66115", "fee": "2.97546", "vol": "0.69261123", "margin": "0.00000", "misc": ""}, "TUVAPK-I6CGY-HXQ5GH": {"ordertxid": "O3ZHXP-TJURP-KITR6Y", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1629016292.3160768, "type": "sell", "ordertype": "limit", "price": "2685.00000", "cost": "95.61306", "fee": "0.15298", "vol": "0.03561008", "margin": "0.00000", "misc": ""}, "TQVCYZ-Y6WOH-FUMVUE": {"ordertxid": "O3ZHXP-TJURP-KITR6Y", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1629015968.2215064, "type": "sell", "ordertype": "limit", "price": "2685.00000", "cost": "1934.28571", "fee": "3.09486", "vol": "0.72040436", "margin": "0.00000", "misc": ""}, "TZEFWF-X7HWK-OHVSO6": {"ordertxid": "O3ZHXP-TJURP-KITR6Y", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1629015965.8488019, "type": "sell", "ordertype": "limit", "price": "2685.00000", "cost": "993.45000", "fee": "1.58952", "vol": "0.37000000", "margin": "0.00000", "misc": ""}, "TFASF2-T4KHL-5MZKFM": {"ordertxid": "O3ZHXP-TJURP-KITR6Y", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1629015964.3654382, "type": "sell", "ordertype": "limit", "price": "2685.00000", "cost": "2159.50356", "fee": "3.45521", "vol": "0.80428438", "margin": "0.00000", "misc": ""}, "TYCAO7-H7VQH-TKDN5U": {"ordertxid": "O3ZHXP-TJURP-KITR6Y", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1629015960.6572387, "type": "sell", "ordertype": "limit", "price": "2685.00000", "cost": "992.64923", "fee": "1.58824", "vol": "0.36970176", "margin": "0.00000", "misc": ""}, "TRBTUF-IS3I4-UVO5HV": {"ordertxid": "O3ZHXP-TJURP-KITR6Y", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1629015920.21873, "type": "sell", "ordertype": "limit", "price": "2685.00000", "cost": "2685.00000", "fee": "6.98100", "vol": "1.00000000", "margin": "0.00000", "misc": ""}, "T63N7G-4LIRY-EF3BIK": {"ordertxid": "OHBBKC-L6WEF-K5JJXB", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1629003492.7259307, "type": "sell", "ordertype": "limit", "price": "1.841978", "cost": "10104.607587", "fee": "26.271979", "vol": "5485.73708397", "margin": "0.000000", "misc": ""}, "TI7XAH-A74XU-YAPAJ5": {"ordertxid": "OL4NEM-JIK2U-KV3XIW", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1624867317.8546677, "type": "buy", "ordertype": "limit", "price": "0.010200", "cost": "1326.000000", "fee": "2.121600", "vol": "130000.00000000", "margin": "0.000000", "misc": ""}, "TDT7SS-5MJ5E-U2OEWA": {"ordertxid": "OHRLVZ-CTEZ3-NXBYZD", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1624311580.8791018, "type": "buy", "ordertype": "limit", "price": "1.035000", "cost": "631.223385", "fee": "0.883713", "vol": "609.87766673", "margin": "0.000000", "misc": ""}, "T6TVN4-LOWEL-ZFCJ2Q": {"ordertxid": "OHRLVZ-CTEZ3-NXBYZD", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1624311580.5946784, "type": "buy", "ordertype": "limit", "price": "1.035000", "cost": "1444.131710", "fee": "2.021784", "vol": "1395.29633774", "margin": "0.000000", "misc": ""}, "TK6SCQ-RL3GS-GCBTTW": {"ordertxid": "OHRLVZ-CTEZ3-NXBYZD", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1624311580.5765297, "type": "buy", "ordertype": "limit", "price": "1.035000", "cost": "0.000000", "fee": "0.000000", "vol": "0.00000012", "margin": "0.000000", "misc": ""}, "TDTECA-55CQQ-NOFXP2": {"ordertxid": "OHRLVZ-CTEZ3-NXBYZD", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1624311580.574932, "type": "buy", "ordertype": "limit", "price": "1.035000", "cost": "155.256205", "fee": "0.217359", "vol": "150.00599541", "margin": "0.000000", "misc": ""}, "TV56O5-RG447-LA4AN4": {"ordertxid": "OHRLVZ-CTEZ3-NXBYZD", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1624311580.567692, "type": "buy", "ordertype": "limit", "price": "1.035000", "cost": "874.388700", "fee": "1.224144", "vol": "844.82000000", "margin": "0.000000", "misc": ""}, "TRMLWQ-SC6YD-NZT6SV": {"ordertxid": "OM5X56-E3TNT-SX6IIY", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1624184662.0950058, "type": "buy", "ordertype": "limit", "price": "1775.00000", "cost": "3550.00000", "fee": "4.97000", "vol": "2.00000000", "margin": "0.00000", "misc": ""}, "TWUI7G-CEE5V-CPICVG": {"ordertxid": "OUW5WF-JT6FR-X4ZM5X", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1623982127.9620936, "type": "buy", "ordertype": "limit", "price": "1.220000", "cost": "2440.000000", "fee": "3.416000", "vol": "2000.00000000", "margin": "0.000000", "misc": ""}, "TJYWZZ-SBVQS-OHN6RY": {"ordertxid": "OXYFZ4-3WMED-DRTPMT", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1623950409.6235821, "type": "buy", "ordertype": "limit", "price": "1950.00000", "cost": "3900.00000", "fee": "5.46000", "vol": "2.00000000", "margin": "0.00000", "misc": ""}, "TSREX7-4SPQR-OMPLIT": {"ordertxid": "OKPFCD-2HGZA-CCKKDE", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXBTZEUR", "time": 1623120560.6286323, "type": "buy", "ordertype": "limit", "price": "26850.00000", "cost": "96.34988", "fee": "0.13489", "vol": "0.00358845", "margin": "0.00000", "misc": ""}, "TFLDUA-5NOWT-Z65QSW": {"ordertxid": "OKPFCD-2HGZA-CCKKDE", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXBTZEUR", "time": 1623120560.5491998, "type": "buy", "ordertype": "limit", "price": "26850.00000", "cost": "1246.15012", "fee": "1.74461", "vol": "0.04641155", "margin": "0.00000", "misc": ""}, "TNAY3F-OCOPS-C7KI2T": {"ordertxid": "OKPFCD-2HGZA-CCKKDE", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXBTZEUR", "time": 1623120560.5420816, "type": "buy", "ordertype": "limit", "price": "26850.00000", "cost": "1342.50000", "fee": "1.87950", "vol": "0.05000000", "margin": "0.00000", "misc": ""}, "TIXMBF-XLQYZ-DASS3F": {"ordertxid": "OOG4UB-NQAV5-LD2DAC", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1622450021.5757387, "type": "sell", "ordertype": "limit", "price": "2046.00000", "cost": "4086.27922", "fee": "5.72079", "vol": "1.99720392", "margin": "0.00000", "misc": ""}, "TCI2IS-2WLCK-CXY7RV": {"ordertxid": "ODFGLG-KRAX2-ECXNJP", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1622310638.1160676, "type": "buy", "ordertype": "limit", "price": "1875.00000", "cost": "3750.00000", "fee": "5.25000", "vol": "2.00000000", "margin": "0.00000", "misc": ""}, "TGK62I-ASCRJ-NZ7GWM": {"ordertxid": "OSEUUR-763DI-FMCGDS", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1622302096.2072997, "type": "buy", "ordertype": "limit", "price": "1.130000", "cost": "565.000000", "fee": "0.791000", "vol": "500.00000000", "margin": "0.000000", "misc": ""}, "TCXJSN-BIZVF-BUXRXS": {"ordertxid": "OAJA6K-QX4NK-B2QZTQ", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1621977556.5344694, "type": "sell", "ordertype": "limit", "price": "1.230000", "cost": "3681.165204", "fee": "8.834796", "vol": "2992.81723902", "margin": "0.000000", "misc": ""}, "T4QIQL-ARFR3-GBBM77": {"ordertxid": "OYZTRQ-OGG6T-3VEOU3", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1621977481.2130723, "type": "sell", "ordertype": "limit", "price": "0.76100000", "cost": "100.92069068", "fee": "0.14128897", "vol": "132.61588788", "margin": "0.00000000", "misc": ""}, "TT3CFT-JDYOT-MKLZUA": {"ordertxid": "OYZTRQ-OGG6T-3VEOU3", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1621977481.183549, "type": "sell", "ordertype": "limit", "price": "0.76100000", "cost": "724.18899381", "fee": "1.01386459", "vol": "951.62811276", "margin": "0.00000000", "misc": ""}, "TSFFIA-MUV3H-ACA5AE": {"ordertxid": "OYZTRQ-OGG6T-3VEOU3", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1621977481.1274977, "type": "sell", "ordertype": "limit", "price": "0.76100000", "cost": "1744.81026377", "fee": "2.44273437", "vol": "2292.78615476", "margin": "0.00000000", "misc": ""}, "TPIX4Z-D5XZ7-RKQVRB": {"ordertxid": "OYZTRQ-OGG6T-3VEOU3", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1621977481.1198888, "type": "sell", "ordertype": "limit", "price": "0.76100000", "cost": "1183.19320984", "fee": "1.65647049", "vol": "1554.78739795", "margin": "0.00000000", "misc": ""}, "TMXE3B-BRJFH-FS5EC7": {"ordertxid": "OYZTRQ-OGG6T-3VEOU3", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1621977481.0174754, "type": "sell", "ordertype": "limit", "price": "0.76100000", "cost": "806.50337874", "fee": "1.12910473", "vol": "1059.79419020", "margin": "0.00000000", "misc": ""}, "TXZYYF-TUAK6-ETIADO": {"ordertxid": "OXEOSE-TSOA7-R67HRR", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1621957090.9459214, "type": "sell", "ordertype": "limit", "price": "2134.00000", "cost": "2080.17845", "fee": "2.91225", "vol": "0.97477903", "margin": "0.00000", "misc": ""}, "T5U25P-H57VV-M52C66": {"ordertxid": "OXEOSE-TSOA7-R67HRR", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1621957090.8903964, "type": "sell", "ordertype": "limit", "price": "2134.00000", "cost": "2175.88786", "fee": "3.04624", "vol": "1.01962880", "margin": "0.00000", "misc": ""}, "TLBQZB-TTHF5-HUIQYE": {"ordertxid": "OROW6P-MZSGK-QRYOQ6", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1621953497.7121527, "type": "sell", "ordertype": "limit", "price": "2174.00000", "cost": "4348.00000", "fee": "6.08720", "vol": "2.00000000", "margin": "0.00000", "misc": ""}, "TSFM77-T2AQV-YKDVYO": {"ordertxid": "ODZQUM-XAJC6-JHFZUW", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1621840219.245313, "type": "buy", "ordertype": "limit", "price": "1.199999", "cost": "3599.996746", "fee": "8.639992", "vol": "3000.00000000", "margin": "0.000000", "misc": ""}, "TCIK5V-I6Y3I-GFQOOJ": {"ordertxid": "OKBVHE-QOCMA-K5EEK7", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1621793015.3400455, "type": "buy", "ordertype": "limit", "price": "1510.00000", "cost": "1510.00000", "fee": "2.11400", "vol": "1.00000000", "margin": "0.00000", "misc": ""}, "TEKPOG-MKYET-SJJUQU": {"ordertxid": "O5NOQ4-B3C2J-NFEXWF", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1621773854.0421023, "type": "buy", "ordertype": "limit", "price": "0.57000000", "cost": "3420.00000000", "fee": "4.78800000", "vol": "6000.00000000", "margin": "0.00000000", "misc": ""}, "TNHQ7V-RI23X-OILMEB": {"ordertxid": "OPYWPB-ZMP75-X5KDOY", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1621757809.0365307, "type": "buy", "ordertype": "limit", "price": "1725.00000", "cost": "5175.00000", "fee": "7.24500", "vol": "3.00000000", "margin": "0.00000", "misc": ""}, "T7PAMG-Y63GY-SLUB3T": {"ordertxid": "OXEHHX-ZKT2E-E37AFW", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1621400107.4397132, "type": "sell", "ordertype": "limit", "price": "2345.00000", "cost": "6088.47611", "fee": "8.52387", "vol": "2.59636508", "margin": "0.00000", "misc": ""}, "TH4KQX-SP4WE-257C67": {"ordertxid": "OSHMEH-YITUF-45QBLW", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1621400054.8322985, "type": "sell", "ordertype": "limit", "price": "0.018000", "cost": "0.000000", "fee": "0.000000", "vol": "0.00000003", "margin": "0.000000", "misc": ""}, "TJJ7CC-YSITS-VAJAQU": {"ordertxid": "OSHMEH-YITUF-45QBLW", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1621400054.8311753, "type": "sell", "ordertype": "limit", "price": "0.018000", "cost": "0.000000", "fee": "0.000000", "vol": "0.00002586", "margin": "0.000000", "misc": ""}, "TWM5KO-6FATX-MTYKPD": {"ordertxid": "OSHMEH-YITUF-45QBLW", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1621400054.829528, "type": "sell", "ordertype": "limit", "price": "0.018000", "cost": "1368.413190", "fee": "1.915778", "vol": "76022.95500409", "margin": "0.000000", "misc": ""}, "TYQSBB-2SLNJ-WHI3JD": {"ordertxid": "OSHMEH-YITUF-45QBLW", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1621400054.105029, "type": "sell", "ordertype": "limit", "price": "0.018000", "cost": "411.011942", "fee": "0.575417", "vol": "22833.99677915", "margin": "0.000000", "misc": ""}, "TGI5CV-W7FSR-ISEMLV": {"ordertxid": "OSHMEH-YITUF-45QBLW", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1621400053.9806128, "type": "sell", "ordertype": "limit", "price": "0.018000", "cost": "619.422284", "fee": "0.867191", "vol": "34412.34911493", "margin": "0.000000", "misc": ""}, "TBCBDQ-JDJ2Z-AZWYE3": {"ordertxid": "OSHMEH-YITUF-45QBLW", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1621400053.8598013, "type": "sell", "ordertype": "limit", "price": "0.018000", "cost": "459.603100", "fee": "0.643444", "vol": "25533.50555555", "margin": "0.000000", "misc": ""}, "T5HNQL-Q5XDF-WLFANZ": {"ordertxid": "OSHMEH-YITUF-45QBLW", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1621400053.8224516, "type": "sell", "ordertype": "limit", "price": "0.018000", "cost": "706.519200", "fee": "0.989127", "vol": "39251.06666666", "margin": "0.000000", "misc": ""}, "T23AFV-KEWY5-VZ4QTL": {"ordertxid": "OSHMEH-YITUF-45QBLW", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1621400052.4331799, "type": "sell", "ordertype": "limit", "price": "0.018000", "cost": "29.997330", "fee": "0.041996", "vol": "1666.51835372", "margin": "0.000000", "misc": ""}, "TMXXPO-CO4YV-4D6WUP": {"ordertxid": "OFFJJE-V3QRZ-HKDO7R", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1621399959.0405595, "type": "sell", "ordertype": "limit", "price": "1.13171411", "cost": "4516.01800571", "fee": "10.83844321", "vol": "3990.42298484", "margin": "0.00000000", "misc": ""}, "T3ONFT-IZ363-CMLG4D": {"ordertxid": "OESIAA-CN7D5-DQTYCR", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1620049634.03103, "type": "buy", "ordertype": "limit", "price": "2575.00000", "cost": "5150.00000", "fee": "7.21000", "vol": "2.00000000", "margin": "0.00000", "misc": ""}, "T5TJ24-Z7TID-C2PINM": {"ordertxid": "OONI2M-UWQZ5-OOHWVE", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XETHZEUR", "time": 1620032355.3861656, "type": "buy", "ordertype": "limit", "price": "2645.00000", "cost": "1587.00000", "fee": "2.22180", "vol": "0.60000000", "margin": "0.00000", "misc": ""}, "TO5435-4XPL5-QXRYPS": {"ordertxid": "OXPDCZ-XGQOB-JJH2XZ", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1619859488.6667635, "type": "buy", "ordertype": "limit", "price": "1.28600000", "cost": "1433.22266790", "fee": "2.29315627", "vol": "1114.48107924", "margin": "0.00000000", "misc": ""}, "TULQKB-K2KLK-THPICL": {"ordertxid": "OXPDCZ-XGQOB-JJH2XZ", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1619859488.6502397, "type": "buy", "ordertype": "limit", "price": "1.28600000", "cost": "783.63589595", "fee": "1.25381743", "vol": "609.35917259", "margin": "0.00000000", "misc": ""}, "TX5EB4-DXONN-SFH66I": {"ordertxid": "OXPDCZ-XGQOB-JJH2XZ", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1619859488.3554657, "type": "buy", "ordertype": "limit", "price": "1.28600000", "cost": "806.16851308", "fee": "1.28986962", "vol": "626.88064781", "margin": "0.00000000", "misc": ""}, "TTHD5T-ESYBD-IPWHQH": {"ordertxid": "OXPDCZ-XGQOB-JJH2XZ", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1619859488.3187633, "type": "buy", "ordertype": "limit", "price": "1.28600000", "cost": "1620.32211363", "fee": "2.59251538", "vol": "1259.97053937", "margin": "0.00000000", "misc": ""}, "TFOT7O-2BBTG-NDDO5Y": {"ordertxid": "OXPDCZ-XGQOB-JJH2XZ", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1619859488.2677224, "type": "buy", "ordertype": "limit", "price": "1.28600000", "cost": "500.65080943", "fee": "0.80104130", "vol": "389.30856099", "margin": "0.00000000", "misc": ""}, "TDT5QO-YFMV2-BG6PXZ": {"ordertxid": "ORZNNG-5MVSL-TROQJK", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1619799335.4192595, "type": "buy", "ordertype": "limit", "price": "0.032800", "cost": "1374.300359", "fee": "2.198881", "vol": "41899.40118902", "margin": "0.000000", "misc": ""}, "TH5ZJJ-YDGC7-OBOV7F": {"ordertxid": "ORZNNG-5MVSL-TROQJK", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1619799326.8273046, "type": "buy", "ordertype": "limit", "price": "0.032800", "cost": "275.520000", "fee": "0.440832", "vol": "8400.00000000", "margin": "0.000000", "misc": ""}, "TXCT2H-3YJAC-QSEU3T": {"ordertxid": "ORZNNG-5MVSL-TROQJK", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1619799261.4359837, "type": "buy", "ordertype": "limit", "price": "0.032800", "cost": "0.000000", "fee": "0.000000", "vol": "0.00000002", "margin": "0.000000", "misc": ""}, "TUOIH5-KP6OB-NT5AFY": {"ordertxid": "ORZNNG-5MVSL-TROQJK", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1619799261.435133, "type": "buy", "ordertype": "limit", "price": "0.032800", "cost": "0.000000", "fee": "0.000000", "vol": "0.00000856", "margin": "0.000000", "misc": ""}, "TIK2OO-LG7JY-G3ETUM": {"ordertxid": "ORZNNG-5MVSL-TROQJK", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1619799261.4337358, "type": "buy", "ordertype": "limit", "price": "0.032800", "cost": "4910.179641", "fee": "7.856287", "vol": "149700.59880240", "margin": "0.000000", "misc": ""}, "TPU4TK-NDT7I-EX2YIZ": {"ordertxid": "OJCTZS-ME6DU-THFEFX", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1619493024.9977973, "type": "sell", "ordertype": "limit", "price": "0.033600", "cost": "0.000000", "fee": "0.000000", "vol": "0.00000001", "margin": "0.000000", "misc": ""}, "T4QUTV-TMLC7-D75OPT": {"ordertxid": "OJCTZS-ME6DU-THFEFX", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1619493024.9968302, "type": "sell", "ordertype": "limit", "price": "0.033600", "cost": "0.000000", "fee": "0.000000", "vol": "0.00000836", "margin": "0.000000", "misc": ""}, "T2WFYB-44SBK-7BON5R": {"ordertxid": "OJCTZS-ME6DU-THFEFX", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1619493024.9953423, "type": "sell", "ordertype": "limit", "price": "0.033600", "cost": "6709.265176", "fee": "10.734824", "vol": "199680.51118211", "margin": "0.000000", "misc": ""}, "T4S66O-3CKVT-FTO2WP": {"ordertxid": "OE6P5H-L5QGX-IGFKT6", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1619468777.6195168, "type": "sell", "ordertype": "limit", "price": "1.014000", "cost": "2024.760383", "fee": "3.239617", "vol": "1996.80511182", "margin": "0.000000", "misc": ""}, "T6AVI3-JPRND-5VGONL": {"ordertxid": "OBYGBM-S4X46-KBLDTV", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1619468771.2268512, "type": "sell", "ordertype": "limit", "price": "1.07000000", "cost": "4129.03966632", "fee": "6.60646347", "vol": "3858.91557600", "margin": "0.00000000", "misc": ""}, "T2NMVG-PREDW-LNRI5J": {"ordertxid": "OBYGBM-S4X46-KBLDTV", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1619468771.1663692, "type": "sell", "ordertype": "limit", "price": "1.07000000", "cost": "354.94746888", "fee": "0.56791595", "vol": "331.72660643", "margin": "0.00000000", "misc": ""}, "TR3PLQ-LXVRD-EYHILQ": {"ordertxid": "OBYGBM-S4X46-KBLDTV", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1619468771.0260384, "type": "sell", "ordertype": "limit", "price": "1.07000000", "cost": "33.09568364", "fee": "0.05295309", "vol": "30.93054546", "margin": "0.00000000", "misc": ""}, "T7JXAN-NTXLE-WYPRWR": {"ordertxid": "OBYGBM-S4X46-KBLDTV", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1619468771.001114, "type": "sell", "ordertype": "limit", "price": "1.07000000", "cost": "323.19350000", "fee": "0.51710960", "vol": "302.05000000", "margin": "0.00000000", "misc": ""}, "TCFEEP-6LXVX-A6TPJD": {"ordertxid": "OBYGBM-S4X46-KBLDTV", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1619468770.4981182, "type": "sell", "ordertype": "limit", "price": "1.07000000", "cost": "501.17735529", "fee": "0.80188377", "vol": "468.39005167", "margin": "0.00000000", "misc": ""}, "TOJL5Z-LJFKJ-DGVN5S": {"ordertxid": "OSIGAC-564JM-VLDPHQ", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1619386577.2483437, "type": "buy", "ordertype": "limit", "price": "0.79000000", "cost": "2406.63389311", "fee": "3.85061423", "vol": "3046.37201659", "margin": "0.00000000", "misc": ""}, "TU4QAM-PET77-IT4DKJ": {"ordertxid": "OSIGAC-564JM-VLDPHQ", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "XXRPZEUR", "time": 1619386577.2414048, "type": "buy", "ordertype": "limit", "price": "0.79000000", "cost": "1543.36610689", "fee": "2.46938577", "vol": "1953.62798341", "margin": "0.00000000", "misc": ""}, "TA65NK-ONRK6-GL4AE3": {"ordertxid": "OY75IT-SWQXA-7E6J4S", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "ADAEUR", "time": 1619383651.7463408, "type": "buy", "ordertype": "limit", "price": "0.908000", "cost": "1816.000000", "fee": "2.905600", "vol": "2000.00000000", "margin": "0.000000", "misc": ""}, "TPQQHW-2COW7-TA2P4J": {"ordertxid": "OSD7W6-WKXT7-N33SD7", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1619140757.9175143, "type": "buy", "ordertype": "limit", "price": "0.027550", "cost": "379.103372", "fee": "0.606565", "vol": "13760.55798464", "margin": "0.000000", "misc": ""}, "TLJPE6-YBAQD-T3EJZC": {"ordertxid": "OSD7W6-WKXT7-N33SD7", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1619140755.885161, "type": "buy", "ordertype": "limit", "price": "0.027550", "cost": "2285.548000", "fee": "3.656877", "vol": "82960.00000000", "margin": "0.000000", "misc": ""}, "TRXQGF-WNRCN-5S667O": {"ordertxid": "OSD7W6-WKXT7-N33SD7", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1619140755.6640792, "type": "buy", "ordertype": "limit", "price": "0.027550", "cost": "950.475000", "fee": "1.520760", "vol": "34500.00000000", "margin": "0.000000", "misc": ""}, "TBXKNK-W7ETI-PMWRZW": {"ordertxid": "OSD7W6-WKXT7-N33SD7", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1619140716.3541276, "type": "buy", "ordertype": "limit", "price": "0.027550", "cost": "82.650000", "fee": "0.132240", "vol": "3000.00000001", "margin": "0.000000", "misc": ""}, "TZMCVY-6GBDC-WR5WA7": {"ordertxid": "OSD7W6-WKXT7-N33SD7", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1619140706.7418053, "type": "buy", "ordertype": "limit", "price": "0.027550", "cost": "1812.223628", "fee": "2.899558", "vol": "65779.44201535", "margin": "0.000000", "misc": ""}, "TFYRXV-RSASU-7FKF5K": {"ordertxid": "OILTNX-4W3J7-H6W46N", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1618578955.8875067, "type": "sell", "ordertype": "limit", "price": "0.029400", "cost": "2935.303514", "fee": "4.696486", "vol": "99840.25559105", "margin": "0.000000", "misc": ""}, "TILV3N-LSCJT-THRIQI": {"ordertxid": "OQSKC7-FRKUW-ZKOK53", "postxid": "TKH2SE-M7IF5-CFI7LT", "pair": "SCEUR", "time": 1618298800.9992037, "type": "buy", "ordertype": "limit", "price": "0.021500", "cost": "2150.000000", "fee": "3.440000", "vol": "100000.00000000", "margin": "0.000000", "misc": ""}});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./src/ts/index.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_table__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/table */ "../src/table.ts");
/* harmony import */ var _data_tradesTest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data/tradesTest */ "./src/data/tradesTest.js");


console.log("tstable test server started");
console.log(_data_tradesTest__WEBPACK_IMPORTED_MODULE_1__["default"]);
let header = {};
let container = document.createElement('table');
let tParams = {
    data: _data_tradesTest__WEBPACK_IMPORTED_MODULE_1__["default"],
    header: header,
    container: container
};
let table = new _src_table__WEBPACK_IMPORTED_MODULE_0__.Table({ container: container, data: _data_tradesTest__WEBPACK_IMPORTED_MODULE_1__["default"], header: header });

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map