import React from 'react'

import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'

// Make stuff stay in the center
var colCentered = {
  float: 'none',
  margin: '0 auto'
}

// Style the "Filter" button
var small_button = {
  fontWeight: 'bold',
  // width: '200px',
  float: 'none',
  marginTop: '5px',
  marginRight: '5px',
  fontSize: '16px',
  backgroundColor: 'goldenrod',
  color: 'black',
  borderColor: 'black'
}

// Style the "Reset" button
var reset_button = {
  fontWeight: 'bold',
  width: '125px',
  float: 'none',
  margin: '0 auto',
  fontSize: '18px',
  backgroundColor: 'goldenrod',
  color: 'black',
  borderColor: 'black'
}

// Style the "Book" button
var book_button = {
  fontWeight: 'bold',
  width: '150px',
  float: 'none',
  margin: '0 auto',
  fontSize: '18px',
  backgroundColor: 'goldenrod',
  color: 'black',
  borderColor: 'black'
}

// Change color when mouse hover over button
function hoverButtonColorOn(e) {
  e.target.style.background = '#c4941c';
}

// Change color when mouse stops hovering over button
function hoverButtonColorOff(e) {
  e.target.style.background = 'goldenrod';
}

export default class Rooms extends React.Component{
 
  constructor(){
    super()
    this.state = {
      rooms: [],
      // roomtypes: [],
      id: "",
      // type: {},
      number: "",
      wifi: "",
      smoking: "",
      floor: "",

      filterTypeName: '',
      filterPriceMin: 0,
      filterPriceMax: 0,
      // filterWifi: true,
      // filterSmoking: true
    }
  }

  fetchRooms() {
    var url = 'http://localhost:8080/rooms/all'
    fetch(url)
      .then(res => res.json())
      .then(json => this.setState({ rooms: json }) )
      // .then(console.log(this.state.rooms))
  }

  fetchRoomTypes() {
    var url = 'http://localhost:8080/roomtypes/all'
    fetch(url)
      .then(res => res.json())
      .then(json => this.setState({ roomtypes: json }))
      // .then(console.log(this.state.roomtypes))
  }

  componentDidMount() {
    this.fetchRooms()
    // this.fetchRoomTypes()
  }

  filterByType() {
    console.log("filter room type name: ", this.state.filterTypeName)

    var url = 'http://localhost:8080/rooms/all'
    fetch(url)
      .then(res => res.json())
      .then(json => this.setState({ rooms: json
        .filter( r=> String(r.type.name).includes(this.state.filterTypeName) )
      }) )
      // .then(console.log(this.state.rooms))
  }

  filterByWifi(filterWifi) {
    var url = 'http://localhost:8080/rooms/all'
    fetch(url)
      .then(res => res.json())
      .then(json => this.setState({ rooms: json
        .filter( r=> Boolean(r.wifi) === filterWifi )
      }) )
      // .then(console.log(this.state.rooms))
  }

  filterBySmoking(filterSmoking) {
    var url = 'http://localhost:8080/rooms/all'
    fetch(url)
      .then(res => res.json())
      .then(json => this.setState({ rooms: json
        .filter( r=> Boolean(r.smoking) === filterSmoking )
      }) )
      // .then(console.log(this.state.rooms))
  }

  filterByPrice() {
    var url = 'http://localhost:8080/rooms/all'
    fetch(url)
      .then(res => res.json())
      .then(json => this.setState({ rooms: json
        .filter( r=> Number(r.price) >= this.state.filterPriceMin && Number(r.price) <= this.state.filterPriceMax )
      }) )
      // .then(console.log(this.state.rooms))
  }

  changeHandler(e) {
    var obj = {}
    obj[e.target.name] = e.target.value
    this.setState(obj)
  }
 
  render(){
    return(
      <div className="container">
        <br/>
        <div className="row">
          <br/>
          <h4 style={colCentered}>Filters</h4>
          <br/>
          <br/>
        </div>
        {/* Filters */}
        <div className="row">
          {/* Room type name field */}
          <div className="col-md-4">
            <div className="input-field">
              <label htmlFor="type-name">Room type:</label>
              <input type="text" id="type-name" className="form-control" formNoValidate
              name="filterTypeName" value={this.state.filterTypeName} placeholder="Enter room type name"
              onChange={this.changeHandler.bind(this)}/>
            </div>

            {/* Button that will trigger filterByType function */}
            {/* this will filter the rooms by type*/}
            <button type="submit" className="btn btn-primary" 
              onClick={this.filterByType.bind(this)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={small_button} title="Filter by room type">
                Filter by type
            </button>
          </div>

          {/* Room wifi and smoking field */}
          <div className="col-md-4">
            {/* Room wifi field */}
            {/* Button that will trigger filterByWifi function */}
            {/* this will filter the rooms by smoking allowance */}
            <button type="submit" className="btn btn-primary" 
              onClick={this.filterByWifi.bind(this, true)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={small_button}>
                Wifi: Yes 
            </button>
            <button type="submit" className="btn btn-primary" 
              onClick={this.filterByWifi.bind(this, false)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={small_button}>
                Wifi: No
            </button>
            <br/>
            {/* Room smoking field */}
            {/* Button that will trigger filterByWifi function */}
            {/* this will filter the rooms by smoking allowance */}
            <button type="submit" className="btn btn-primary" 
              onClick={this.filterBySmoking.bind(this, true)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={small_button}>
                Smoking: Allowed 
            </button>
            <button type="submit" className="btn btn-primary" 
              onClick={this.filterBySmoking.bind(this, false)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={small_button}>
                Smoking: Not allowed 
            </button>
            <br/>
          </div>

          {/* Room price range field */}
          <div className="col-md-4">
            <p>Price range: </p>
            <div className="input-field">
              <input type="number" id="room-price-min" style={{width:"75px", marginRight:"5px"}}
              name="filterPriceMin" value={this.state.filterPriceMin} placeholder="Enter min price"
              onChange={this.changeHandler.bind(this)} min="50" max="500"/>
               - 
              <input type="number" id="room-price-max" style={{width:"75px", marginLeft:"5px"}}
              name="filterPriceMax" value={this.state.filterPriceMax} placeholder="Enter max price"
              onChange={this.changeHandler.bind(this)} min="50" max="500"/>
            </div>

            {/* Button that will trigger filterByPrice function */}
            {/* this will filter the rooms by price range*/}
            <button type="submit" className="btn btn-primary" 
              onClick={this.filterByPrice.bind(this)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={small_button} title="Filter by room type">
                Filter by price
            </button>
          </div>

          <br/>
        </div>
        <br/>
        <div className="row" style={colCentered}>
          <br/>
          {/* this will reset the rooms table */}
          <button type="submit" className="btn btn-primary" 
            onClick={this.fetchRooms.bind(this)}
            onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
            style={reset_button} title="Save room type">
              All rooms
          </button>
        </div>
        <br/>
        <div className="row">
          <br/>
          <h2 style={colCentered}>Choose a room</h2>
          <br/>
          <br/>
        </div>
        <div className="row">
          <br/>
          {/* Table for rooms to choose */}
          <table className="table table-hover table-bordered table-striped">
            <thead>
              <tr>
                <th>Room number</th>
                <th>Floor</th>
                <th>Type</th>
                <th>Wifi</th>
                <th>Smoking</th>
                <th>Price</th>
              </tr>
            </thead>
              <tbody>
                {this.state.rooms.map(r =>
                  <tr>
                    <td style={{fontWeight:"bold"}}>{r.number}</td>
                    <td>{r.floor}</td>
                    <td>{r.type.name}</td>

                    {/* if "wifi" is true -> "Yes", false -> "No" */}
                    {r.wifi 
                      ? <td>Yes</td>
                      : <td>No</td>
                    }
                    {/* if "smoking" is true -> "Allowed", false -> "Not allowed" */}
                    {r.smoking 
                      ? <td>Allowed</td>
                      : <td>Not allowed</td>
                    }
                    {/* Button showing room's price per night and links to BookingPage for that room */}
                    <td>
                      <Link to={"/BookingPage/" + r.id}>
                        <button className="btn btn-primary" 
                        onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
                        style={book_button} title="Book this room">
                            ${r.price}/night
                        </button>
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
          </table>
          <br/>
        </div>
      </div>
    )
  }
}