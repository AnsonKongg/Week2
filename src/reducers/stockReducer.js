import * as types from "../config/ActionTypes";
const stockState = {
    type: "",
    errorMessage: "",
    stockSymbolList: ['AAPL', 'BA', 'BABA', 'TSLA'],
    stockList: {},
};

const stockReducer = (state = stockState, action) => {
    switch (action.type) {
        case types.GET_STOCK_SUCCESS:
            return {
                ...state,
                type: action.type,
                stockList: { ...state.stockList, [action.symbol]: action.stockDetail },
            };
        case types.GET_STOCK_FAILED:
            return {
                ...state,
                type: action.type,
                errorMessage: action.errorMessage,
            };
        case types.SEARCH_STOCK_SUCCESS:
            return {
                ...state,
                type: action.type,
                stockSymbolList: [...state.stockSymbolList, action.symbol],
            };
        case types.SEARCH_STOCK_FAILED:
            return {
                ...state,
                type: action.type,
                errorMessage: action.errorMessage,
            };
        case types.DELETE_STOCK_SUCCESS:
            const index = state.stockSymbolList.findIndex(element => element === action.symbol)
            state.stockSymbolList.splice(index,1)
            delete state.stockList[action.symbol]
            return {
                ...state,
                type: action.type,
                stockSymbolList: [...state.stockSymbolList],
            };
        case types.DELETE_STOCK_FAILED:
            return {
                ...state,
                type: action.type,
                errorMessage: action.errorMessage,
            };
        default:
            return state;
    }
}

export default stockReducer;