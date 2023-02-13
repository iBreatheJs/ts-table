import cryptoData from './tradesTest'

// default container: body
let container = document.createElement('table')
document.body.appendChild(container)

const simple = {
    data: [
        { col1: "data1", col2: "r1c2" },
        { col1: "data2", col2: "r2c2", col3: "kaka" },
        { col1: "data33333", col2: "r3c2" }
    ],
    container: container,
    header: { col1: "col1", col2: "col2", col3: "col3" }
}

const crypto = {
    data: cryptoData,
    container: container

}

// all test data
export const testData = {
    simple: simple,
    crypto: crypto
}