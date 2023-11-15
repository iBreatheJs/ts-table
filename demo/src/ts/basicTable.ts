import { testData } from "../../../data/test-data";
import { Table } from "../../../src/table";


export function basicTable() {
    let c = document.createElement("div")
    document.body.appendChild(c)
    let t = new Table({
        container: c,
        data: [{ asdf: [3, 3] }],
        // data: testData.simple.data, 
        options: {
            extendedData: true
        },

    })
    t.draw()
    t.data
}