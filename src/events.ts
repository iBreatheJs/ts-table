import { Table } from "./table";
import { Dict, EventConfig, TableData, TableOptions } from "./types";




//todo events
export function addEvents<Data extends TableData>(table: Table<Data>, el: HTMLElement, cfg: EventConfig['header']) {
    // default is sort by this col
    // let cfg = {
    //     "click": table.actions.sort
    // }
    // const events_custom = {
    //     click: "sort"
    // } as const

    let evtName: keyof typeof cfg
    let action: keyof typeof table.actions



    for (evtName in cfg) {
        let entry = cfg[evtName]
        action = cfg[evtName].action
        console.log("entryyyyy");
        console.log(entry);
        console.log("action");
        console.log(action);

        let a = table.actions
        let fn = table.actions[action].fn
        console.log("fn");
        console.log(fn);

        if (fn) {
            el.addEventListener(evtName, (evt) => {
                let args = [el]
                fn(evt, ...args)
                // this.sortTable(nr),
                //     this.changeColourEvenRows()
            }, false);
        }
    }
}

//  actions

// event config


// table takes whatever event obj is passed to it or default.
// and provides a default config which can be merged with custom outside of table context
// export const events_custom = {
//     header: {
//         click: {
//             action: "sort",
//             args: setArgs
//         }
//     }
// }
export const events_default = {
    "header": {
        click: "some action"
    }
}
let dataSimple = [
    { col1: "data1", col2: "r1c2" },
    { col1: "data2", col2: "r2c2" },
    { col1: "data33333", col2: "r3c2" }
]

// let h = { col1: "col1", col2: "coll2" }
// let opt: TableOptions<typeof dataSimple> = { eventConfig: events_custom }
// let container = document.createElement('table')

// let t = new Table(container, dataSimple)

// t.sort
// type asdf = Parameters<typeof t.sort>

