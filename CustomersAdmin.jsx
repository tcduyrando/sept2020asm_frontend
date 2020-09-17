import React from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom'
import fire from './config/Fire.js'  // import firebase for user authentication

// Make stuff stay in the center
var colCentered = {
  float: 'none',
  margin: '0 auto'
}

// Style the "Details" button
var details_button = {
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

export default class CustomersAdmin extends React.Component{
 
  constructor(props){
    super(props)
    this.state = {
      bookings: [],
    }
  }

  // fetch bookings from api and filter to only include bookings of the currently logged in user
  fetchBookings() {
    var url = 'http://localhost:8080/bookings/all'
    fetch(url)
    .then(res=>res.json())
    .then(json=>
      this.setState({ bookings: json.filter(b => String(b.customer.email).startsWith(fire.auth().currentUser.email))
      })
    )
  }

  componentDidMount() {
    this.fetchBookings()
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
          <h2 style={colCentered}>Booking history</h2>
          <br/>
          <br/>
        </div>
        <div className="row">
          <br/>
          {/* Table with bookings containing main info for user to choose */}
          <table className="table table-hover table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Room Type</th>
                <th>Room Number</th>
                <th>Total Cost</th>
                <th>Arrival Date</th>
                <th>Checkout Date</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
              <tbody>
                {this.state.bookings.map(b =>
                  <tr>
                    <td>{b.id}</td>
                    <td style={{fontWeight:"bold"}}>{b.room.type.name}</td>
                    <td>{b.room.number}</td>
                    <td style={{fontWeight:"bold"}}>${b.total}</td>
                    <td>{b.arrivalDate.substring(0, 10)}</td>
                    <td>{b.checkoutDate.substring(0, 10)}</td>
                    {/* if "status" is true -> "Accepted", false -> "Pending" */}
                    
                    { b.reviewed && b.accepted
                      ? <td style={{color:"green", fontWeight:"bold"}}>Accepted</td>
                      : b.reviewed === true && b.accepted === false 
                        ? <td style={{color:"red", fontWeight:"bold"}}>Rejected</td>
                        : <td style={{fontWeight:"bold"}}>Pending...</td>
                    }
                    {/* Button linking to BookingDeatils page for that room */}
                    <td>
                      <Link to={"/BookingDetails/" + b.id}>
                        <button className="btn btn-primary" 
                        onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
                        style={details_button} title="Book this room">
                            View Details
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