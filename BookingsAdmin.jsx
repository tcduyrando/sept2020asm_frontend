import React from 'react'
import Modal from 'react-modal'   // import react-modal for error messages
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
  width: '80px',
  float: 'none',
  marginRight: '5px',
  fontSize: '18px',
  backgroundColor: 'goldenrod',
  color: 'black',
  borderColor: 'black'
}

// Style the "Details" button
var arm_button = {
  fontWeight: 'bold',
  width: '65px',
  float: 'none',
  marginRight: '5px',
  fontSize: '18px',
  backgroundColor: 'goldenrod',
  color: 'black',
  borderColor: 'black'
}

// Style the "Accept" button
var accept_button = {
  fontWeight: 'bold',
  width: '80px',
  float: 'none',
  marginRight: '5px',
  fontSize: '18px',
  backgroundColor: 'lime',
  color: 'black',
  borderColor: 'black'
}

// Style the "Reject" button
var reject_button = {
  fontWeight: 'bold',
  width: '80px',
  float: 'none',
  margin: '0 auto',
  fontSize: '18px',
  backgroundColor: '#F23311', // red
  color: 'black',
  borderColor: 'black'
}

// Change color when mouse hover over the 3 buttons
function hoverButtonColorOn_A(e) {
  e.target.style.background = '#00DB00'; // darker lime
}
function hoverButtonColorOn_R(e) {
  e.target.style.background = '#D6280A'; // darker red
}
function hoverButtonColorOn(e) {
  e.target.style.background = '#c4941c';
}

// Change color when mouse stops hovering over the 3 buttons
function hoverButtonColorOff_A(e) {
  e.target.style.background = 'lime';
}
function hoverButtonColorOff_R(e) {
  e.target.style.background = '#F23311'; // red
}
function hoverButtonColorOff(e) {
  e.target.style.background = 'goldenrod';
}

export default class BookingsAdmin extends React.Component{
 
  constructor(props){
    super(props)
    this.state = {
      bookings: [],
      id: '',
      customerId: '',
      roomId: '',
      request: '',
      total: '',
      arrivalDate: '',
      checkoutDate: '',
    }
  }

  // fetch bookings from api and filter to only include bookings of the currently logged in user
  fetchBookings() {
    var url = 'http://localhost:8080/bookings/all'
    fetch(url)
    .then(res=>res.json())
    .then(json=>
      this.setState({ bookings: json })
    )
  }

  componentDidMount() {
    this.fetchBookings()
  }

  handleChange(e) {
    var obj = {}
    obj[e.target.name] = e.target.value
    this.setState(obj)
  }

  // fillState(id, customerId, roomId, request, total, arrivalDate, checkoutDate) {
  //   this.setState({
  //     id: id,
  //     customerId: customerId,
  //     roomId: roomId,
  //     request: request,
  //     total: total,
  //     arrivalDate: arrivalDate,
  //     checkoutDate: checkoutDate
  //   })
  // }

  accept(id, customerId, roomId, request, total, arrivalDate, checkoutDate) {
    console.log(this.state)

    var methodVar = 'put'
    var url = 'http://localhost:8080/bookings'
    fetch(url, {
      method: methodVar,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        customer: {
          id: customerId
        },
        room: {
          id: roomId
        },
        request: request,
        total: total,
        arrivalDate: arrivalDate,
        checkoutDate: checkoutDate,
        reviewed: true,
        accepted: true
      })
    })
    .then(res => res.json())
    .then(json => this.fetchBookings())
    .then(
      console.log("booking accepted"),
      console.log(this.state)
    )
    .then(this.setState({showModal_1: true})) // show success message modal
  }

  reject(id, customerId, roomId, request, total, arrivalDate, checkoutDate) {
    console.log(this.state)

    var methodVar = 'put'
    var url = 'http://localhost:8080/bookings'
    fetch(url, {
      method: methodVar,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        customer: {
          id: customerId
        },
        room: {
          id: roomId
        },
        request: request,
        total: total,
        arrivalDate: arrivalDate,
        checkoutDate: checkoutDate,
        reviewed: true,
        accepted: false
      })
    })
    .then(res => res.json())
    .then(json => this.fetchBookings())
    .then(
      console.log("booking reject"),
      console.log(this.state)
    )
    .then(this.setState({showModal_2: true})) // show success message modal
  }

  // function to close modals
  closeModal_1(){
    this.setState({showModal_1: false})
  }
  closeModal_2(){
    this.setState({showModal_2: false})
  }
 
  render(){
    return(
      <div className="container">
        {/* If booking is successfully accepted, show this modal */}
        <Modal isOpen={this.state.showModal_1}>
          <h4>Booking is accepted</h4>
          <button onClick={this.closeModal_1.bind(this)}>Close</button>
        </Modal>
        {/* If booking is successfully rejected, show this modal */}
        <Modal isOpen={this.state.showModal_2}>
          <h4>Booking is rejected</h4>
          <button onClick={this.closeModal_2.bind(this)}>Close</button>
        </Modal>
        <br/>
        <div className="row">
          <br/>
          <h2 style={colCentered}>Booking history</h2>
          <br/>
        </div>
        <div className="row">
          <br/>
          {/* Table with bookings containing main info for user to choose */}
          <table className="table table-hover table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer name</th>
                <th>Room Number</th>
                <th>Total Cost</th>
                <th>Arrival - Checkout Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
              <tbody>
                {this.state.bookings.map(b =>
                  <tr>
                    <td>{b.id}</td>
                    <td style={{fontWeight:"bold"}}>{b.customer.name}</td>
                    <td>{b.room.number}</td>
                    <td style={{fontWeight:"bold"}}>${b.total}</td>
                    <td>{b.arrivalDate.substring(0, 10)} - {b.checkoutDate.substring(0, 10)}</td>

                    {/* if "reviewed" is true & "accepted" is true -> "Accepted",
                        if "reviewed" is true & "accepted" is false -> "Rejected",
                        if "reviewed" is false & "accepted" is false -> "Pending..." */}
                    { b.reviewed && b.accepted
                      ? <td style={{color:"lime", fontWeight:"bold"}}>Accepted</td>
                      : b.reviewed === true && b.accepted === false 
                        ? <td style={{color:"red", fontWeight:"bold"}}>Rejected</td>
                        : <td style={{fontWeight:"bold"}}>Pending...</td>
                    }

                    {/* if "reviewed" is false -> show "Accept", "Reject" and "Details" button,
                        if "reviewed" is true -> show "Details" button */}
                    { b.reviewed === false
                      ? <td>
                          {/* Button linking to BookingDeatils page for that room */}
                          <Link to={"/BookingDetailsAdmin/" + b.id}>
                            <button className="btn btn-primary"
                            onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
                            style={details_button} title="Book this room">
                              Details
                            </button>
                          </Link>

                          {/* "Arm" button that will trigger fillState function */}
                          {/* <button className="btn btn-primary" 
                          onClick={this.fillState.bind(this, b.id, b.customer.id, b.room.id, b.request, b.total, b.arrivalDate, b.checkoutDate)}
                          onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
                          style={arm_button} title="Book this room">
                            Arm
                          </button> */}

                          {/* "Accept" button that will trigger accept function */}
                          <button className="btn btn-primary" 
                          onClick={
                              this.accept.bind(this, b.id, b.customer.id, b.room.id, b.request, b.total, b.arrivalDate, b.checkoutDate)
                          }
                          onMouseOver={hoverButtonColorOn_A} onMouseOut={hoverButtonColorOff_A} 
                          style={accept_button} title="Book this room">
                            Accept
                          </button>
                      
                          {/* "Reject" button that will trigger reject function */}
                          <button className="btn btn-primary" 
                          onClick={this.reject.bind(this, b.id, b.customer.id, b.room.id, b.request, b.total, b.arrivalDate, b.checkoutDate)}
                          onMouseOver={hoverButtonColorOn_R} onMouseOut={hoverButtonColorOff_R} 
                          style={reject_button} title="Book this room">
                            Reject
                          </button>
                        </td>
                      : <td>
                          {/* Button linking to BookingDeatils page for that room */}
                          <Link to={"/BookingDetailsAdmin/" + b.id}>
                            <button className="btn btn-primary" 
                            onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
                            style={details_button} title="Book this room">
                              Details
                            </button>
                          </Link>
                        </td>
                    }
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