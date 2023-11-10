import { TableData, TableOptions } from "src/types";
import { Class } from "@lib/helpers/types";

type Required_ish<T> =
    {
        [K in keyof Required<T>]: T[K]
    };


export const tableOptionSchema = {
    silent: "boolean",
    showOptions: ["boolean", undefined],
    header: [
        {
            hide: ["boolean", undefined],
            infer: ["boolean", undefined],
        },
        undefined
    ],
    extendedData: ["boolean", undefined],
    // edit?: edit
    // tableStyle?: Dict<Dict<string>>,
    alternateColour: ["boolean", undefined],
    // todo: these fk up the call method used for passing this context
    // transformData?: RowFunc<Data>,
    render: undefined,
    tableStyle: undefined,
    showRules: undefined,
    eventConfig: undefined,
    // render?: {
    //     row?: RenderRow<Data> // row html frame that calls rowContnent
    //     // rowContent?: RenderRow<Data> //todo this is sth,,, data inside eg. table cell
    //     // col?: Function
    //     colContent?: RenderColContent<Data>
    // }
    // rowFunc?: RowFunc<Data>,
    // collapsible?: CollapsibleRowFunc<Data>,
    sortable: undefined,
    // sortable?: { // TODO: add 3rd value to header that is used for sorting, eg. for time: display simple date format but calc with unix time stamp
    //     all: boolean,
    //     cols?: [string]
    // },
    filter: undefined,
    // filter?: boolean | {
    //     filterConfig?: FilterConfig
    //     /* {
    //         |
    //         custom: {
    //             // todo low: add cb functions for custom filters if necessary for sth at all  
    //             // cb to define literal, string, num or whatever 
    //         }
    //     } */
    // },
    search: undefined,
    rowCount: ["boolean", undefined],
    // showRules: boolean
    // editable?: OnEditFunc | true | false
    // extendableRows?: asdf
    // eventConfig?: EventConfig
}
export let tableParamSchema = {
    data: "TableData",
    container: "HtmlElement",
    options: tableOptionSchema
}

// more defined. idk maybe everything should just be undefined
// todo: should eventually be constructor type with everything mandatory 
export const tableDefaultConf: Required_ish<TableOptions<TableData>> = {
    silent: undefined,
    showOptions: undefined,
    header: undefined,
    extendedData: undefined,
    // edit?: edit
    // tableStyle?: Dict<Dict<string>>,
    alternateColour: undefined, //default true
    // todo: these fk up the call method used for passing this context
    // transformData?: RowFunc<Data>,
    render: undefined,
    tableStyle: undefined,
    showRules: undefined,
    eventConfig: undefined,
    // render?: {
    //     row?: RenderRow<Data> // row html frame that calls rowContnent
    //     // rowContent?: RenderRow<Data> //todo this is sth,,, data inside eg. table cell
    //     // col?: Function
    //     colContent?: RenderColContent<Data>
    // }
    // rowFunc?: RowFunc<Data>,
    // collapsible?: CollapsibleRowFunc<Data>,
    sortable: undefined,
    // sortable?: { // TODO: add 3rd value to header that is used for sorting, eg. for time: display simple date format but calc with unix time stamp
    //     all: boolean,
    //     cols?: [string]
    // },
    filter: undefined,
    // filter?: boolean | {
    //     filterConfig?: FilterConfig
    //     /* {
    //         |
    //         custom: {
    //             // todo low: add cb functions for custom filters if necessary for sth at all  
    //             // cb to define literal, string, num or whatever 
    //         }
    //     } */
    // },
    search: undefined,
    rowCount: undefined,
    // showRules: boolean
    // editable?: OnEditFunc | true | false
    // extendableRows?: asdf
    // eventConfig?: EventConfig
}
export const tableDefaultConf2: Required_ish<TableOptions<TableData>> = {
    showOptions: false,
    header: undefined,
    extendedData: false,
    // edit?: edit
    // tableStyle?: Dict<Dict<string>>,
    alternateColour: false, //default true
    // todo: these fk up the call method used for passing this context
    // transformData?: RowFunc<Data>,
    render: undefined,
    tableStyle: undefined,
    showRules: false,
    eventConfig: undefined,
    // render?: {
    //     row?: RenderRow<Data> // row html frame that calls rowContnent
    //     // rowContent?: RenderRow<Data> //todo this is sth,,, data inside eg. table cell
    //     // col?: Function
    //     colContent?: RenderColContent<Data>
    // }
    // rowFunc?: RowFunc<Data>,
    // collapsible?: CollapsibleRowFunc<Data>,
    sortable: undefined,
    // sortable?: { // TODO: add 3rd value to header that is used for sorting, eg. for time: display simple date format but calc with unix time stamp
    //     all: boolean,
    //     cols?: [string]
    // },
    filter: false,
    // filter?: boolean | {
    //     filterConfig?: FilterConfig
    //     /* {
    //         |
    //         custom: {
    //             // todo low: add cb functions for custom filters if necessary for sth at all  
    //             // cb to define literal, string, num or whatever 
    //         }
    //     } */
    // },
    search: false,
    rowCount: true,
    // showRules: boolean
    // editable?: OnEditFunc | true | false
    // extendableRows?: asdf
    // eventConfig?: EventConfig
}

// todo: should be a feature of the widget wrapper in cdb
// ether use:
//      - defaultOptions
//      - config: more advanced like union types
//          config to counter/remove some options
export function addOptionsBox(html: HTMLDivElement, cls: Class, conf?: any) {
    console.log("adding options box");
    html.classList.add("ts-options-box")
    for (let opt in tableDefaultConf) {
        console.log("opt box");
        console.log(opt);
        html.appendChild(createOption(opt as keyof TableOptions<TableData>))

    }
}

// todo: fix types for more generic approach
function createOption(opt: keyof TableOptions<TableData>) {
    let val = tableDefaultConf[opt]
    console.log("val");
    console.log(val);
    let d = document.createElement("div")
    d.innerHTML = opt
    d.classList.add("ts-options-option")
    switch (typeof val) {
        case "boolean":
            let o = document.createElement("input")
            o.type = "checkbox"
            d.appendChild(o)
            break;

        default:
            break;
    }

    return d
}