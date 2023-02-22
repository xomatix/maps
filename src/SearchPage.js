
import { MapSearch, DistanceSearch } from './MapSearch';
import { useNavigate, Navigate  } from "react-router-dom";
import decode from './FlexPoly';
import React, { useEffect, useState } from 'react';

export class SearchPage extends React.Component {
  constructor(props) {
      super(props);
      this.state = { history: [], redirect: false};
      this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
  }


  forceUpdateHandler(){
    this.forceUpdate();
  };

  componentDidMount() {
    this.setState({ redirect: false });
    this.getHistoryData();
  }

  getHistoryData(){
    let h = this.props.getData();
    h = h['history'] === undefined ? [] : h['history'];
    this.setState({ history: h });
    console.log(this.history);
  }
  
  handleHistory = (e, item) => {
    e.preventDefault();
    console.log(item);

    let data = {
      actual: item,
      history: this.state.history
    };
    
    this.props.changeData(data);

    this.setState({ redirect: true });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log('You clicked submit.');

    //get form data
    let addressA = e.target.loca.value;
    let addressB = e.target.locb.value;

    //get position data containing cordinates
    let positionA = await MapSearch(addressA);  
    let positionB = await MapSearch(addressB);  

    //set cordinates
    let locationA = {'addr': positionA['items'][0]['address']['label'], 'position': positionA['items'][0]['position']};
    let locationB = {'addr': positionB['items'][0]['address']['label'], 'position': positionB['items'][0]['position']};
    
    //get distance
    let distance = await DistanceSearch(locationA['position'], locationB['position']);

    let history;
    try {
      history = this.props.getData(); 
      let exists = false;

      if(this.state.history.length > 0) {

        for (let i = 0; i < history['history'].length; i++) {
          if(history['history'][i].locationA.addr === locationA.addr && history['history'][i].locationB.addr === locationB.addr){
            exists = true;
            console.log('found ');
          }
        }

      }
      
      history = exists ? history : history['history'].concat([{'locationA': locationA, 'locationB': locationB, polyline: decode(distance['routes'][0]['sections'][0]['polyline'])['polyline'], distance: distance['routes'][0]['sections'][0]['summary']['length']}]);
    } catch (error) {
      history = [{locationA: locationA, locationB: locationB, polyline: decode(distance['routes'][0]['sections'][0]['polyline'])['polyline'], distance: distance['routes'][0]['sections'][0]['summary']['length']}];
    }

    let data = {
      actual: {locationA: locationA, locationB: locationB, polyline: decode(distance['routes'][0]['sections'][0]['polyline'])['polyline'], distance: distance['routes'][0]['sections'][0]['summary']['length']},
      history: history
    };
    
    this.props.changeData(data);

    console.log("finished");

    this.setState({ redirect: true });
  
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to='/map' />;
    }
    
    return (
      <div className="SearchPage">
        <div className="searchPart">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="loca" className="form-label">Location A (START)</label>
              <input type="text" className="form-control" id="loca"></input>
              <div className="form-text-white">Form: Street (Postal Code) City  Country</div>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="locb" className="form-label">Location B (FINISH)</label>
              <input type="text" className="form-control" id="locb"></input>
              <div className="form-text-white">Form: Street (Postal Code) City  Country</div>
            </div>
            
            <button type="submit" className="btn btn-primary btn-lg">Search</button>
          </form>
        </div>
        <div className="historyPart">
          <div>
          {this.state.history.length === 0 ? (
          <p>History will show there</p>
        ) : (
          <div>
              {this.state.history.map(item => (
                <div key={Math.random()} onClick={(e) => {this.handleHistory(e, item)}} className="historyElement">
                <p className='historyText'>From: {item.locationA.addr}</p>
                <p className='historyText'>To: {item.locationB.addr}</p>
                </div>

              ))}
          </div>
        )}
          </div>
        </div>
      </div>
    );
  }
}



function OldSearchPage({setData, getData}) {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);

    useEffect(() => {
      const data = getData();
      setHistory(data);
      console.log(data['history']);
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        console.log('You clicked submit.');
    
        //get form data
        let addressA = e.target.loca.value;
        let addressB = e.target.locb.value;
    
        //get position data containing cordinates
        let positionA = await MapSearch(addressA);  
        let positionB = await MapSearch(addressB);  
    
        //set cordinates
        let locationA = {'addr': positionA['items'][0]['address']['label'], 'position': positionA['items'][0]['position']};
        let locationB = {'addr': positionB['items'][0]['address']['label'], 'position': positionB['items'][0]['position']};
        
        //get distance
        let distance = await DistanceSearch(locationA['position'], locationB['position']);

        let history = getData()['history']; 
        history = (history === undefined )? [{'locationA': locationA, 'locationB': locationB}] : history.concat([{'locationA': locationA, 'locationB': locationB}]);

        let data = {
          'actual': {'locationA': locationA, 'locationB': locationB, 'polyline': decode(distance['routes'][0]['sections'][0]['polyline'])['polyline'], 'distance': distance['routes'][0]['sections'][0]['summary']['length']},
          'history': history
        };

        setData(data);

        navigate('/map');  
      
      }
    
      return (
        <div className="SearchPage">
          <div className="searchPart">
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="loca" className="form-label">Location A (START)</label>
                <input type="text" className="form-control" id="loca"></input>
                <div className="form-text-white">Form: Street (Postal Code) City  Country</div>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="locb" className="form-label">Location B (FINISH)</label>
                <input type="text" className="form-control" id="locb"></input>
                <div className="form-text-white">Form: Street (Postal Code) City  Country</div>
              </div>
              
              <button type="submit" className="btn btn-primary btn-lg">Search</button>
            </form>
          </div>
          <div className="historyPart">
            <ul>
              <li>Search</li>
            </ul>
          </div>
        </div>
      );
}

export default SearchPage;