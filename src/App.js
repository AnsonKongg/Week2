import React, { } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Row } from 'antd';
import StockListFunction from './components/stockListFunction'

function App() {

  return (
    <div className="App">
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
          <StockListFunction />
      </Row>

    </div>
  );
}

export default App;
