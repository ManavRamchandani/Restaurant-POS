import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TablesPage from './pages/TablesPage';
import CategoryPage from './pages/CategoryPage';
import OrderHistory from './pages/OrderHistory';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/" element={<TablesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
