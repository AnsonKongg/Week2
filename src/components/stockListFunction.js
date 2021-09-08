import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import * as stockAction from "../actions/stockAction";
import '../App.css';
import { Row, Typography, Input, notification } from 'antd';
import { MinusCircleTwoTone } from '@ant-design/icons';
const { Title, Text } = Typography;
const { Search } = Input;
var time = new Date();

// Selectors
const mapStateToProps = (state) => ({
    type: state.stockReducer.type,
    stockSymbolList: state.stockReducer.stockSymbolList,
    stockList: state.stockReducer.stockList
});

// Dispatch actions
const mapDispatchToProps = {
    getStockList: stockAction.getStockList,
    addStock: stockAction.searchStock,
    removeStock: stockAction.removeStock,
};

const StockListFunction = (props) => {
    const { stockList, stockSymbolList, getStockList, addStock, removeStock } = props;
    const [updateTime, setUpdateTime] = useState(time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
    const [shownIndex, setShownIndex] = useState();
    const [selectedStock, setSelectedStock] = useState(null);

    useEffect(() => {
        _fetchStockList()
        let timer = null;
        // Set up timer automatically fetch Stock List
        timer = setInterval(() => {
            _fetchStockList()
        }, 60000)
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        }
    }, [stockSymbolList, getStockList]);

    // Fetch Stock Detail info based on stockSymbolList and update time
    const _fetchStockList = () => {
        if (stockSymbolList && stockSymbolList.length > 0) {
            stockSymbolList.forEach((symbol) => {
                getStockList(symbol)
            })
            setUpdateTime(time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }))
        }
    }
    // Add new Stock after search symbol existed and not repeat in stockSymbolList
    const _onSearch = value => {
        const index = stockSymbolList.findIndex(element => element === value)
        if (index === -1) {
            addStock(value)
        } else {
            notification["warning"]({
                message: 'Warning',
                description: "Stock is existed",
            });
        }
    }
    // Set selected stock when mouse on it
    const _onMouseOver = (stock, index) => {
        setSelectedStock(stock)
        setShownIndex(index)
    }
    // Delete selected stock when delete button clicked
    const _deleteClick = () => {
        removeStock(selectedStock.symbol)
    }

    return (
        <div>
            <Title level={4}>My Stock Watchlist</Title>
            <Text>Updated at {updateTime}</Text>
            <Search placeholder="add new stock" onSearch={_onSearch} enterButton="Add" style={{ paddingTop: "10px" }} />
            <div>
                {Object.keys(stockList).length > 0 && Object.values(stockList).map((stock, index) => (
                    <div className="list-item-container" key={index}>
                        <Row className="listItem" justify="space-between" align="middle" onMouseOver={() => _onMouseOver(stock, index)}>
                            <Text className="list-symbol" strong>{stock.symbol}</Text>
                            <div className="list-number-container" >
                                <Text className="list-current">{stock.current_price}</Text>
                                <Text className="list-change" style={{ color: Number(stock.change) > 0 ? '#32CD32' : '#B22222' }}>
                                    {stock.change} ({stock.change_percent}%)
                                </Text>
                            </div>
                        </Row>
                        {shownIndex === index && <MinusCircleTwoTone className="listIcon" twoToneColor="#B22222" onClick={_deleteClick}/>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StockListFunction);