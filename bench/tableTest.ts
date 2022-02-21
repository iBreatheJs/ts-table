import { fetchEzy } from "../../../utils"
import { RowData, Table, TableData, TableOptions } from "../table"



interface Res {
    error: string,
    data: {
        kraken: any,
        bittrex: any
    }
}

const filter_config = {
    tradeId: "string",
    market: {
        "bittrex": true,
        "kraken": true,
        "eth": true,
        "avax": true
    },
    type: {
        "buy": true,
        "buyer": true,
        "sell": true,
        "move": true,
    },
    // ["buy", "sell", "move"] as const,
    // type: "buy"|| "sell"||"move",
    time: "number",
    // id: 123; // uniqe id amongst all Transactions
    asset: {
        "BTC": true,
        "ETH": true,
    },
    vol: "number",
    fee: "number" // uniqe among trades of same asset pair
}

export class TableTest {
    // private tableHtml: HTMLTableElement;
    // private header: Dictionary<string>;
    // readonly tableData: Data;
    // // private _tableData: Data;
    // public options: TableOptions<Data>;
    // private tableStyle: Dictionary<Dictionary<string>>;
    // public initialized: boolean;
    data: any


    /**
     * 
     * @param tableHtml 
     * @param header Key = name of associated data field, value = display name
     * @param tableData 
     * @param options 
     */
    // constructor(tableHtml: HTMLTableElement, header: Dictionary<string>, tableData: Data, options: TableOptions<Data> = {}) {
    constructor(data: TableData) {
        this.data = data
    }


    getData() {
        return fetchEzy<Res>('/_get-all-transactions').then(res => {
            console.log("all transactions res")
            console.log(res.data)
            if (res.error.length) {
                console.error("error with fetching data")
            } else {
                return res.data
            }
        })
    }


    constructTable() {

        var tableTransactionsHeader = {
            // 'id': 'orderNr',
            // 'associatedTrades': 'associated trade',
            'market': 'market',
            'type': 'type',
            // 'timeDisplay': 'time',
            'time': 'timeUnix',
            'vol': 'vol',
            'price': 'price',
            'cost': 'cost',
            'tradeId': 'exchange-id',
            'pair': 'pair',

            // "volPercentage": "vol %",
            // "gainCurrent": "gain curr",
            // "valueCurrent": "val curr"
        }

        let tableTradesOptions: TableOptions<Transaction[]> = {
            // rowFunc: rowFuncInnerTable, // defined below
            // sortable: {
            //     all: true
            // },
            alternateColour: false,
            // editable: onEdit // defined below
        }



        let tableTransactions = document.getElementById("tableTransactions") as HTMLTableElement;
        let tableData = this.data
        // let data = this.data as unknown as TableData
        // tableData = [...tableData, ...tableData];

        for (let i = 0; i < 6; i++) {
            tableData = [...tableData, ...tableData];
        }





        // nested table, instantiated for each asset listing the trades of the asset
        var tableTrades = new Table(tableTransactions, tableTransactionsHeader, tableData, tableTradesOptions)
        // tableTrades.options.editable = true
        // tableTrades.options.filterBox = true
        tableTrades.options.filter = {}
        tableTrades.options.filter.filterConfig = filter_config
        // tableTrades.options.filter.filterConfig = TRANSACTION_TYPE
        tableTrades.options.search = true


        console.log("hs b")
        tableTrades.drawTable()

        // let row: HTMLTableRowElement = 
        // let key = 3

        // tableTrades.transformData(row, key)

    }
}
