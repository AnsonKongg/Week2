import React from 'react';
import * as types from "../config/ActionTypes";
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

class StockListClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateTime: time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
            shownIndex: null,
            selectedStock: null
        };
        var timer = null;
    }

    componentDidMount(){
        this._fetchStockList()
        this.timer = setInterval(() => {
            this._fetchStockList()
        }, 10000)
    }
    componentDidUpdate(prevProps) {
        if (prevProps.type !== this.props.type) {
            if (this.props.type === types.SEARCH_STOCK_SUCCESS) {
                this._fetchStockList()
            }
            if (this.props.type === types.DELETE_STOCK_SUCCESS) {
                this._fetchStockList()
            }
        }
    }
    componentWillUnmount(){
        clearInterval(this.timer)
    }

    // Fetch Stock Detail info based on stockSymbolList and update time
    _fetchStockList = () => {
        if (this.props.stockSymbolList && this.props.stockSymbolList.length > 0) {
            this.props.stockSymbolList.forEach((symbol) => {
                this.props.getStockList(symbol)
            })
            this.setState({ updateTime: time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })})
        }
    }
    // Add new Stock after search symbol existed and not repeat in stockSymbolList
    _onSearch = value => {
        const index = this.props.stockSymbolList.findIndex(element => element === value)
        if (index === -1) {
            this.props.addStock(value)
        } else {
            notification["warning"]({
                message: 'Warning',
                description: "Stock is existed",
            });
        }
    }
    // Set selected stock when mouse on it
    _onMouseOver = (stock, index) => {
        this.setState({ selectedStock: stock, shownIndex: index })
    }
    // Delete selected stock when delete button clicked
    _deleteClick = () => {
        this.props.removeStock(this.state.selectedStock.symbol)
    }

    render() {
        return (
            <div>
                <Title level={4}>My Stock Watchlist</Title>
                <Text>Updated at {this.state.updateTime}</Text>
                <Search placeholder="add new stock" onSearch={this._onSearch} enterButton="Add" style={{ paddingTop: "10px" }} />
                <div>
                    {Object.keys(this.props.stockList).length > 0 && Object.values(this.props.stockList).map((stock, index) => (
                        <div className="list-item-container" key={index}>
                            <Row className="listItem" justify="space-between" align="middle" onMouseOver={() => this._onMouseOver(stock, index)}>
                                <Text className="list-symbol" strong>{stock.symbol}</Text>
                                <div className="list-number-container" >
                                    <Text className="list-current">{stock.current_price}</Text>
                                    <Text className="list-change" style={{ color: Number(stock.change) > 0 ? '#32CD32' : '#B22222' }}>
                                        {stock.change} ({stock.change_percent}%)
                                    </Text>
                                </div>
                            </Row>
                            {this.state.shownIndex === index && <MinusCircleTwoTone className="listIcon" twoToneColor="#B22222" onClick={this._deleteClick} />}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StockListClass);