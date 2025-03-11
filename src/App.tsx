import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CalculatorPage from './pages/CalculatorPage';
import './styles/main.scss';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Wattback Home Page</h1>} />
        <Route path="/calculator" element={<CalculatorPage />} />
      </Routes>
    </Router>
  )
}

export default App
