import { Table } from "./table";
import { Dict, TableData } from "./types";

type events = {
    "click"?: Function,
    "scroll"?: Function
}
type events2 = "click" | "sd"



//todo events
export function addEvents<Data extends TableData>(table: Table<Data>, el: HTMLElement, events: any) {
    // default is sort by this col
    // let cfg = {
    //     "click": table.actions.sort
    // }
    const events_custom = {
        click: "sort"
    } as const
    let cfg = events_custom

    let evtName: keyof typeof cfg
    let action: keyof typeof table.actions
    for (evtName in cfg) {

        action = cfg[evtName]

        let fn: Function = table.actions[action].fn

        el.addEventListener(evtName, (evt) => {
            // let args = [el.innerHTML]
            fn(evt)
            // this.sortTable(nr),
            //     this.changeColourEvenRows()
        }, false);
    }
}

//  actions

// event config


// table takes whatever event obj is passed to it or default.
// and provides a default config which can be merged with custom outside of table context
export const events_custom = {
    header: {
        click: "sort"
    }
}
export const events_default = {
    "header": {
        click: "some action"
    }
}