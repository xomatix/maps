
import SearchPage from './SearchPage';
import MapPage from './MapPage';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import './App.css';
import { useState } from 'react';

function App() {

  const [data, setData] = useState({});

  const changeData = (value) => {
    setData(value);
  };

  const getData = () => {
    return data;
  };

  return (
      <div className="App">
    <Router>
        <Routes>
          <Route exact path='/' element={<SearchPage getData={getData} changeData={changeData} />} />
            
          <Route path='/map' element={<MapPage getData={getData} />} exact />
            
        </Routes>
    </Router>
      </div>
  );
}

export default App;
