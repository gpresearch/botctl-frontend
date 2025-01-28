import { useState, useEffect } from 'react';
import { SupportedExchangeNames, InstrumentPair, FrontendOrder } from '../types';
import { getOpenOrders } from '../api';
import './Trade.css';

export function Trade() {
  const [selectedExchange, setSelectedExchange] = useState<SupportedExchangeNames>(SupportedExchangeNames.BINANCEUSDM);
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentPair>(InstrumentPair.BTC_USDT);
  const [orders, setOrders] = useState<FrontendOrder[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (showLoading: boolean = false) => {
    if (showLoading) {
      setIsInitialLoad(true);
    }
    setError(null);
    
    try {
      const [base, counter] = selectedInstrument.split('/');
      const openOrders = await getOpenOrders(selectedExchange, base, counter);
      setOrders(openOrders);
    } catch (err) {
      setError('Failed to fetch open orders');
      console.error('Error fetching orders:', err);
    } finally {
      if (showLoading) {
        setIsInitialLoad(false);
      }
    }
  };

  // Initial load and instrument/exchange change
  useEffect(() => {
    fetchOrders(true); // Show loading on initial load or when selections change
    const interval = setInterval(() => fetchOrders(false), 5000); // Don't show loading on background updates
    return () => clearInterval(interval);
  }, [selectedExchange, selectedInstrument]);

  return (
    <div className="trade-container">
      <div className="open-orders-section">
        <h2>Open Orders</h2>
        
        <div className="selectors">
          <div className="selector-group">
            <label>Exchange:</label>
            <select
              value={selectedExchange}
              onChange={(e) => setSelectedExchange(e.target.value as SupportedExchangeNames)}
            >
              {Object.values(SupportedExchangeNames).map((exchange) => (
                <option key={exchange} value={exchange}>
                  {exchange}
                </option>
              ))}
            </select>
          </div>

          <div className="selector-group">
            <label>Instrument:</label>
            <select
              value={selectedInstrument}
              onChange={(e) => setSelectedInstrument(e.target.value as InstrumentPair)}
            >
              {Object.values(InstrumentPair).map((instrument) => (
                <option key={instrument} value={instrument}>
                  {instrument}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        {isInitialLoad ? (
          <div className="loading">Loading orders...</div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Side</th>
                <th>Price</th>
                <th>Size</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className={order.side.toLowerCase()}>{order.side}</td>
                  <td>{order.price}</td>
                  <td>{order.size}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.timestamp).toLocaleString()}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="no-orders">No open orders</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 