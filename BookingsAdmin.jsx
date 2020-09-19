import React from 'react'
import Modal from 'react-modal'   // import react-modal for error messages
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom'
import fire from './config/Fire.js'  // import firebase for user authentication

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

      filterTypeName: '',
      filterNumber: 0,
      filterCustomer: '',
      filterTotalMin: 0,
      filterTotalMax: 0,
      filterArrivalDate: '',
      filterCheckoutDate: '',
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

  changeHandler(e) {
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

  filterByType() {
    console.log("filter room type name: ", this.state.filterTypeName)

    var url = 'http://localhost:8080/bookings/all'
    fetch(url)
      .then(res => res.json())
      .then(json => this.setState({ bookings: json
        .filter( b=> String(b.room.type.name).includes(this.state.filterTypeName) )
      }) )
      // .then(console.log(this.state.rooms))
  }

  filterNumber() {
    console.log("filter room type name: ", this.state.filterNumber)

    var url = 'http://localhost:8080/bookings/all'
    fetch(url)
      .then(res => res.json())
      .then(json => this.setState({ bookings: json
        .filter( b=> Number(b.room.number) == this.state.filterNumber )
      }) )
      // .then(console.log(this.state.rooms))
  }
  
  filterCustomer() {
    console.log("filter customer name: ", this.state.filterCustomer)

    var url = 'http://localhost:8080/bookings/all'
    fetch(url)
      .then(res => res.json())
      .then(json => this.setState({ bookings: json
        .filter( b=> String(b.customer.name).includes(this.state.filterCustomer) )
      }) )
      // .then(console.log(this.state.rooms))
  }

  filterTotal() {
    var url = 'http://localhost:8080/bookings/all'
    fetch(url)
      .then(res => res.json())
      .then(json => this.setState({ bookings: json
        .filter( b=> Number(b.total) >= this.state.filterTotalMin && Number(b.total) <= this.state.filterTotalMax )
      }) )
      // .then(console.log(this.state.rooms))
  }

  filterArrivalDate() {
    console.log("filter arrival date: ", this.state.filterArrivalDate)

    var url = 'http://localhost:8080/bookings/all'
    fetch(url)
      .then(res => res.json())
      .then(json => this.setState({ bookings: json
        .filter( b=> String(b.arrivalDate).includes(this.state.filterArrivalDate) )
      }) )
      // .then(console.log(this.state.rooms))
  }

  filterCheckoutDate() {
    console.log("filter checkout date: ", this.state.filterCheckoutDate)

    var url = 'http://localhost:8080/bookings/all'
    fetch(url)
      .then(res => res.json())
      .then(json => this.setState({ bookings: json
        .filter( b=> String(b.checkoutDate).includes(this.state.filterCheckoutDate) )
      }) )
      // .then(console.log(this.state.rooms))
  }

  filterStatus(filterReviewed, filterAccepted) {
    var url = 'http://localhost:8080/bookings/all'
    fetch(url)
      .then(res => res.json())
      .then(json => this.setState({ bookings: json
        .filter( b=> Boolean(b.reviewed) === filterReviewed && Boolean(b.accepted) === filterAccepted )
      }) )
      // .then(console.log(this.state.rooms))
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
          <h4 style={colCentered}>Filters</h4>
          <br/>
          <br/>
        </div>
        {/* Filters */}
        <div className="row">
          {/* Room number and type name field */}
          <div className="col-md-3">
            {/* Room type */}
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
                Filter by room type
            </button>

            {/* Room number */}
            <div className="input-field">
              <label htmlFor="room-number">Room number:</label>
              <input type="number" id="room-number" className="form-control" formNoValidate
              name="filterNumber" value={this.state.filterNumber} placeholder="Enter room number"
              onChange={this.changeHandler.bind(this)}/>
            </div>
            {/* Button that will trigger filterByType function */}
            {/* this will filter the rooms by type*/}
            <button type="submit" className="btn btn-primary" 
              onClick={this.filterNumber.bind(this)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={small_button} title="Filter by room type">
                Filter by room number
            </button>
          </div>

          {/* Customer name and total */}
          <div className="col-md-3">
            {/* Room type */}
            <div className="input-field">
              <label htmlFor="customer-name">Customer name:</label>
              <input type="text" id="customer-name" className="form-control" formNoValidate
              name="filterCustomer" value={this.state.filterCustomer} placeholder="Enter customer name"
              onChange={this.changeHandler.bind(this)}/>
            </div>
            {/* Button that will trigger filterCustomer function */}
            {/* this will filter the bookings by customer*/}
            <button type="submit" className="btn btn-primary" 
              onClick={this.filterCustomer.bind(this)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={small_button} title="Filter by customer name">
                Filter by customer name
            </button>

            {/* Total cost range */}
            <p>Total cost range: </p>
            <div className="input-field">
              <input type="number" id="total-cost-min" style={{width:"75px", marginRight:"5px"}}
              name="filterTotalMin" value={this.state.filterTotalMin} placeholder="Enter min total"
              onChange={this.changeHandler.bind(this)}/>
               - 
              <input type="number" id="total-cost-max" style={{width:"75px", marginLeft:"5px"}}
              name="filterTotalMax" value={this.state.filterTotalMax} placeholder="Enter max total"
              onChange={this.changeHandler.bind(this)}/>
            </div>
            {/* Button that will trigger filterTotal function */}
            {/* this will filter the rooms by total cost range*/}
            <button type="submit" className="btn btn-primary" 
              onClick={this.filterTotal.bind(this)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={small_button} title="Filter by room type">
                Filter by total cost
            </button>
            <br/>
          </div>

          {/* Arrival and checkout date filters */}
          <div className="col-md-3">
            {/* Arrival date */}
            <div className="input-field">
              <label htmlFor="arrivalDate">Arrival date:</label>
              <input type="text" id="arrivalDate" className="form-control" formNoValidate
              name="filterArrivalDate" value={this.state.filterArrivalDate} placeholder="Enter arrival date"
              onChange={this.changeHandler.bind(this)}/>
            </div>

            {/* Button that will trigger filterByType function */}
            {/* this will filter the rooms by type*/}
            <button type="submit" className="btn btn-primary" 
              onClick={this.filterArrivalDate.bind(this)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={small_button} title="Filter by arrival date">
                Filter by arrival date
            </button>

            {/* Checkout date */}
            <div className="input-field">
              <label htmlFor="checkoutDate">Checkout date:</label>
              <input type="text" id="checkoutDate" className="form-control" formNoValidate
              name="filterCheckoutDate" value={this.state.filterCheckoutDate} placeholder="Enter checkout date"
              onChange={this.changeHandler.bind(this)}/>
            </div>

            {/* Button that will trigger filterByType function */}
            {/* this will filter the rooms by type*/}
            <button type="submit" className="btn btn-primary" 
              onClick={this.filterCheckoutDate.bind(this)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={small_button} title="Filter by checkout date">
                Filter by checkout date
            </button>
            <br/>
          </div>
          <div className="col-md-3">
            {/* Filter bookings by status */}
            <p>Filter by status: </p>
            <button type="submit" className="btn btn-primary" 
              onClick={this.filterStatus.bind(this, false, false)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={small_button}>
                Status: Pending 
            </button>
            <br/>
            <br/>
            <button type="submit" className="btn btn-primary" 
              onClick={this.filterStatus.bind(this, true, true)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={small_button}>
                Status: Accepted 
            </button>
            <br/>
            <br/>
            <button type="submit" className="btn btn-primary" 
              onClick={this.filterStatus.bind(this, true, false)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={small_button}>
                Status: Rejected 
            </button>
            
          </div>

          <br/>
        </div>
        <br/>
        <div className="row" style={colCentered}>
          <br/>
          {/* this will reset the rooms table */}
          <button type="submit" className="btn btn-primary" 
            onClick={this.fetchBookings.bind(this)}
            onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
            style={reset_button} title="Save room type">
              All rooms
          </button>
        </div>
        <br/>
        <div className="row">
          <br/>
          <h2 style={colCentered}>Booking history</h2>
          <br/>
        </div>
        <br/>
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