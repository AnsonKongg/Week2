import * as APIs from "../config/APIs";
import * as types from "../config/ActionTypes";
import { notification } from 'antd';

const token = "sandbox_c4im3jiad3if6e3efam0"

export const getStockList = (symbol) => {
    return async dispatch => {
        try {
            const url = APIs.GET_STOCK_LIST_API + "?symbol=" + symbol + "&token=" + token;
            const response = await fetch(url)
            const stock = await response.json()
            const stockDetail = {
                symbol: symbol,
                current_price: stock.c,
                change: stock.d > 0 ? "+" + String(stock.d) : String(stock.d),
                change_percent: Math.abs(Number(stock.dp).toFixed(2)),
            }
            dispatch({
                type: types.GET_STOCK_SUCCESS,
                symbol,
                stockDetail: stockDetail,
            });
        } catch (error) {
            dispatch({
                type: types.GET_STOCK_FAILED,
                errorMessage: error,
            });
        }
    }
}
export const searchStock = (symbol) => {
    return async dispatch => {
        try {
            const url = APIs.SEARCH_STOCK_API + "?q=" + symbol + "&token=" + token;
            const response = await fetch(url)
            const searchResult = await response.json()
            if (searchResult.count > 0) {
                dispatch({
                    type: types.SEARCH_STOCK_SUCCESS,
                    symbol: symbol
                });
                notification["success"]({
                    message: 'Success',
                    description: "You successfully added stock!",
                });
            } else {
                notification["error"]({
                    message: 'Error',
                    description: "Cannot find relative stock",
                });
            }
        } catch (error) {
            dispatch({
                type: types.SEARCH_STOCK_FAILED,
                errorMessage: error,
            });
        }
    }
}
export const removeStock = (symbol) => {
    return async dispatch => {
        try {
            dispatch({
                type: types.DELETE_STOCK_SUCCESS,
                symbol: symbol
            });
        } catch (error) {
            dispatch({
                type: types.DELETE_STOCK_FAILED,
                errorMessage: error,
            });
        }
    }
}