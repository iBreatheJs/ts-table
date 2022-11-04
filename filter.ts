/* Concept:
DATA
DATASETS - basically arything that can be represented in a table
    original dataset fetched from somewhere 
    can also be a combination of subsets or unions of diffrent sets 
    they only need to share cols

datasets are not modified only created
by filtering combining original stays intact and new one is defined in form of a 
CONFIG
    config is filter config to narrow down and query config to combine filterd sets


DATASETS - lowest Layer, originally fetched from somewhere / then stored and updated 
    user data - transaction historys from diffrent exchages
    market data - price, volume, of btc etc
FILTERS - narrows datasets down to more specific subsets, can be represented in tables, charts
    base Interface - defines possibilities
    state - keep track of enabled filters
QUERIES - logical operations on mulitple datasets / subsets / 
    AND - can be realised by combining filters
    OR - need for seperately filtered datasets whose results can be combined
    diffrent types of intersections, substract, etc

ARITHMETIC

SUM - sum a col of a dataset
FOR-EACH 
VAR
There is a base Interface 



*/



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
}

var header = {
    col: {
        displayName: "name",
        visible: true,
        type: "number",
        calcCol: "timeUnix",
    },
    'market': 'market',
    'type': 'type',
    // 'timeDisplay': 'time',
    'time': 'timeUnix',
    'vol': 'vol',
    'price': 'price',
    'cost': 'cost',
    'tradeId': 'exchange-id',
    'pair': 'pair',
}