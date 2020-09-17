import React from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom'
import fire from './config/Fire.js'  // import firebase for user authentication
import Modal from 'react-modal'   // import react-modal for error messages

// Make stuff stay in the center
var colCentered = {
  float: 'none',
  margin: '0 auto'
}

// Style the "Submit" button
var small_button = {
  fontWeight: 'bold',
  width: '100px',
  float: 'none',
  marginRight: '5px',
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

export default class BookingDetails extends React.Component{
 
  constructor(props){
    super(props)
    this.state = {
      bookings: [],
      customerId: '',
      roomId: '',
      request: '',
      total: '',
      arrivalDate: '',
      checkoutDate: '',
      reviewed: '',
      accepted: '',
      feedback: '',

      redirect: false, // if "redirect" is true, redirect to booking history 
      showModal_1: false, // if "showModal_1" is true, show "Feedback is submitted" message 
      showModal_2: false // if "showModal_2" is true, 
    }
  }

  // fetch bookings from api and filter to only include the booking the user selected
  fetchBookings() {
    var url = 'http://localhost:8080/bookings/all'
    fetch(url)
    .then(res=>res.json())
    .then(json=>
      this.setState({ 
        bookings: json.filter(b => Number(b.id) == this.props.match.params.bookingId )
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

  // fillState(id, customerId, roomId, request, total, arrivalDate, checkoutDate, reviewed, accepted) {
  //   this.setState({
  //     id: id,
  //     customerId: customerId,
  //     roomId: roomId,
  //     request: request,
  //     total: total,
  //     arrivalDate: arrivalDate,
  //     checkoutDate: checkoutDate,
  //     reviewed: reviewed,
  //     accepted: accepted
  //   })
  // }

  addFeedback(id, customerId, roomId, request, total, arrivalDate, checkoutDate, reviewed, accepted) {
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
        reviewed: reviewed,
        accepted: accepted,
        feedback: this.state.feedback
      })
    })
    .then(res => res.json())
    .then(json => this.fetchBookings())
    .then(
      console.log("feedback is submitted"),
      console.log(this.state)
    )
    .then(this.setState({showModal_1: true})) // show success message modal
  }

  cancelBooking(id) {
    console.log(this.state)

    var methodVar = 'delete'
    var url = 'http://localhost:8080/bookings/'
    fetch(url + id, {
      method: methodVar,
    })
    .then(res => res.json())
    .then(json => this.fetchBookings())
    .then(
      console.log("booking cancelled"),
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
    this.setState({redirect: true}) // redirect to booking history after closing modal
  }
 
  render(){
    if (this.state.redirect === true) {
      return (<Redirect to='/BookingHistory' />)  // if "redirect" is true, redirect to booking history
    } 
    else {
      return(
        <div className="container">
          {/* success message modal that shows when feedback is submitted */}
          <Modal isOpen={this.state.showModal_1}>
            <h4>Feedback is submitted</h4>
            <button onClick={this.closeModal_1.bind(this)}>Close</button>
          </Modal>
          {/* success message modal that shows when booking is cancelled */}
          <Modal isOpen={this.state.showModal_2}>
            <h4>Booking is cancelled</h4>
            <button onClick={this.closeModal_2.bind(this)}>Close</button>
          </Modal>
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
                    {/* if booking is reviewed and accepted by admin -> "Accepted", 
                        if booking is reviewed but not accepted by admin -> "Rejected"
                        if booking is not reviewed and not accepted by admin - > "Pending..." */}
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
                  { b.reviewed === false 
                    ? (
                      <tr>
                      <th>Action</th>
                        <td>
                            {/* Button to cancel booking */}
                            <button type="submit" className="btn btn-primary" 
                              onClick={this.cancelBooking.bind(this, b.id)}
                              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
                              style={small_button} title="Save room type">
                                Cancel
                            </button>
                        </td>
                      </tr>)
                    : <div></div>
                  }
                </tbody>                   
              </table>
            )}
            <br/>
          </div>
          {this.state.bookings.map(b => 
            <div className="row">
              { b.reviewed === true && b.accepted === true && b.feedback === null 
                ? <div className="col-md-8" style={colCentered}>
                    <br/>
                    <h2>Submit feedback</h2>
                    <br/>
                    <form id="edit-form">
  
                      {/* Room type name field */}
                      <div className="input-field">
                        <label htmlFor="feedback">If you enjoyed your stay, leave us a a good review! If not, don't.</label>
                        <input type="text" id="feedback" className="form-control" formNoValidate
                        name="feedback" value={this.state.feedback} placeholder="Enter feedback"
                        onChange={this.changeHandler.bind(this)}/>
                      </div>
                      <br/>
                    </form>
  
                    {/* <p>Please press "Confirm" before submitting</p> */}
  
                    {/* "Confirm" button that will trigger fillState function */}
                    {/* <button className="btn btn-primary" 
                      onClick={this.fillState.bind(this, b.id, b.customer.id, b.room.id, b.request, b.total, b.arrivalDate, b.checkoutDate, b.reviewed, b.accepted)}
                      onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
                      style={small_button} title="Book this room">
                        Confirm
                    </button> */}
  
                    {/* "Save" button that will trigger saveNewType function */}
                    {/* this will submit the form */}
                    <button type="submit" className="btn btn-primary" 
                      onClick={this.addFeedback.bind(this, b.id, b.customer.id, b.room.id, b.request, b.total, b.arrivalDate, b.checkoutDate, b.reviewed, b.accepted)}
                      onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
                      style={small_button} title="Save room type">
                        Submit
                    </button>
                  </div>
                : <div></div>
              }
            </div>
            
          )}
        </div>
      )
    }
  }
}