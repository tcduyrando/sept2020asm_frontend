import React from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom'
import fire from './config/Fire.js'  // import firebase for user authentication

// Make stuff stay in the center
var colCentered = {
  float: 'none',
  margin: '0 auto'
}

// Change color when mouse hover over button
function hoverButtonColorOn(e) {
  e.target.style.background = '#c4941c';
}

// Change color when mouse stops hovering over button
function hoverButtonColorOff(e) {
  e.target.style.background = 'goldenrod';
}

export default class BookingDetailsAdmin extends React.Component{
 
  constructor(props){
    super(props)
    this.state = {
      bookings: [],
    }
  }

  // fetch bookings from api and filter to only include the booking the user selected
  fetchBookings() {
    var url = 'http://localhost:8080/bookings/all'
    fetch(url)
    .then(res=>res.json())
    .then(json=>
      this.setState({ bookings: json.filter(b => Number(b.id) == this.props.match.params.bookingId ) 
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
          <h2 style={colCentered}>Booking details</h2>
          <br/>
          <br/>
        </div>
        <div className="row">
          <br/>
          {/* Table with detailed booking info */}
          {this.state.bookings.map(b =>
            <table className="table table-hover table-bordered table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <td>{b.id}</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Customer name</th>
                  <td style={{fontWeight:"bold"}}>{b.customer.name}</td>
                </tr>
                <tr>
                  <th>Customer email</th>
                  <td>{b.customer.email}</td>
                </tr>
                <tr>
                  <th>Room type</th>
                  <td>{b.room.type.name}</td>
                </tr>
                <tr>
                  <th>Room number</th>
                  <td>{b.room.number}</td>
                </tr>
                <tr>
                  <th>Wifi</th>
                  {/* if "wifi" is true -> "Yes", false -> "No" */}
                  {b.room.wifi 
                    ? <td>Yes</td>
                    : <td>No</td>
                  }
                </tr>
                <tr>
                  <th>Smoking</th>
                  {/* if "smoking" is true -> "Allowed", false -> "Not allowed" */}
                  {b.room.smoking 
                    ? <td>Allowed</td>
                    : <td>Not allowed</td>
                  }
                </tr>
                <tr>
                  <th>Room floor</th>
                  <td>{b.room.floor}</td>
                </tr>
                <tr>
                  <th>Room price</th>
                  <td>${b.room.price}/night</td>
                </tr>
                <tr>
                  <th>Other requests</th>
                  <td>{b.request}</td>
                </tr>
                <tr>
                  <th>Total cost</th>
                  <td style={{fontWeight:"bold"}}>${b.total}</td>
                </tr>
                <tr>
                  <th>Arrival date</th>
                  <td>{b.arrivalDate.substring(0, 10)}</td>
                </tr>
                <tr>
                  <th>Checkout date</th>
                  <td>{b.checkoutDate.substring(0, 10)}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  {/* if "status" is true -> "Accepted", false -> "Pending" */}
                  {/* {b.status 
                    ? <td style={{color:"green"}}>Accepted</td>
                    : <td>Pending...</td>
                  } */}
                  { b.reviewed && b.accepted
                    ? <td style={{color:"lime", fontWeight:"bold"}}>Accepted</td>
                    : b.reviewed === true && b.accepted === false 
                      ? <td style={{color:"red", fontWeight:"bold"}}>Rejected</td>
                      : <td style={{fontWeight:"bold"}}>Pending...</td>
                  }
                </tr>
                <tr>
                  <th>Feedback</th>
                  { b.feedback !== null 
                    ? <td>{b.feedback}</td>
                    : <td>No feedback submitted yet</td>
                  }
                </tr>
              </tbody>                   
            </table>
          )}
          <br/>
        </div>
      </div>
    )
  }
}