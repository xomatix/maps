
import  React from 'react';
import { MapContainer, Marker, Popup,TileLayer, Polyline } from 'react-leaflet';
import { Link  } from "react-router-dom";
import MapControl from './MapControl';
import ReactToPrint from "react-to-print";

class MapPage extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.getData();
        this.state = { markerA: {}, markerB: {}, from: "", to: "", center: {}, polyline: [], price: 0, cost: 1 , days: 0, distance: 0};
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    }

    forceUpdateHandler(){
        this.forceUpdate();
    };

    componentDidMount() {
        this.getMapData();
    }
    
    calculateCost(e){
        this.price = e;
        this.cost = Math.ceil(this.distance/1000*this.price*1.1*100)/100;
        let calculation = Math.ceil(this.distance/1000 / 800);
        this.days = calculation;
        this.forceUpdateHandler();
    }

    getValue = (e) => {
        this.price = e.target.value;
        this.calculateCost(this.price);
    }

    
    getMapData() {

        this.markerA = this.data['actual']['locationA']['position'];
        this.markerB = this.data['actual']['locationB']['position'];

        this.from = this.data['actual']['locationA']['addr'];
        this.to = this.data['actual']['locationB']['addr'];

        this.center = {lat:((this.markerA['lat']+this.markerB['lat'])/2), lng: ((this.markerA['lng']+this.markerB['lng'])/2)};

        this.polyline = this.data['actual']['polyline'];

        this.distance = this.data['actual']['distance'];

        this.calculateCost(1);

        //needed for map to reload
        this.forceUpdateHandler();
    }

    reactToPrintTrigger = () => {
        return <button className="btn btn-primary">Print 🖨</button>;
    };

    render() {        

        if (this.center === undefined) {
            setTimeout(this.render, 1000);
            return (<h1>Loading...</h1>);
        } else {

            return (
                <div className="MapPage">
                   
                    <div className="print" ref={el=>(this.componentRef=el)}>

                    
                    <div className='mapPart' >
                        <Link to='/' >◀ Go back to search</Link>
                        <MapContainer id='map' center={this.center} zoom={13} scrollWheelZoom={true}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={this.markerA}>
                                <Popup>
                                    A pretty CSS3 popup. <br /> Easily customizable.
                                </Popup>
                            </Marker>
                            <Marker position={this.markerB}>
                                <Popup>
                                    A pretty CSS3 popup. <br /> Easily customizable.
                                </Popup>
                            </Marker>
                           <Polyline color='#220bb9' positions={this.polyline}></Polyline>{/* */}
                           <MapControl markerA={this.markerA} markerB={this.markerB} />
                        </MapContainer>

                    </div>
                    <div className='dataPart' >
                        <h1>Trip details</h1>
                        <h6>From: {this.from}</h6>
                        <h6>to: {this.to}</h6>
                        <label htmlFor="price" >Price per 1 km</label>

                        <input type="number" id='price'  onChange={ this.getValue }></input>
                        <br></br>
                        <h3>Route length {this.distance / 1000} km</h3>
                        <h3>trip cost: {this.cost} (currency)</h3>
                        <h3>Travel days: {this.days}</h3>
                    </div>
                    </div>
                    <ReactToPrint
                    documentTitle="FileName"
                    content={()=>this.componentRef}
                    trigger={this.reactToPrintTrigger}
                    pageStyle="print"
                    />
                   
                </div>
            );
        }
    }
}

export default MapPage;