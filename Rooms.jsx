import React from 'react'

import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'

// Make stuff stay in the center
var colCentered = {
  float: 'none',
  margin: '0 auto'
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
    }
  }

  fetchRooms() {
    var url = 'http://localhost:8080/rooms/all'
    fetch(url)
      .then(res => res.json())
      .then(json => this.setState({ rooms: json
        .filter(r=>Boolean(r.booked) == false) 
      }) )
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

  handleChange(e) {
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