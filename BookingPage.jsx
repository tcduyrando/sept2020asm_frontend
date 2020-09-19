import React, { useState } from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom'
import fire from './config/Fire.js'
// import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'
import Calendar from 'react-calendar'
// import 'react-calendar/dist/Calendar.css'
import Modal from 'react-modal'   // import react-modal for error messages

// Make stuff stay in the center
var colCentered = {
  float: 'none',
  margin: '0 auto'
}

// Style the "Book" button
var book_button = {
  fontWeight: 'bold',
  width: '300px',
  float: 'none',
  margin: '0 auto',
  fontSize: '24px',
  backgroundColor: 'goldenrod',
  color: 'black',
  borderColor: 'black'
}

// Style the "Refresh" button
var refresh_button = {
  fontWeight: 'bold',
  width: '175px',
  float: 'none',
  margin: '0 auto',
  fontSize: '16px',
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

// const handleCalendar = arrivalDate => this.setState({ arrivalDate })

export default class BookingPage extends React.Component{
 
  constructor(props){
    super(props)
    this.state = {
      bookings: [],
      request: '',
      totalCost: 0,
      
      rooms: [],
      roomId: '',
      roomTypeId: '',
      roomTypeName: '',
      roomNumber: '',
      wifi: '',
      somoking: '',
      floor: '',
      price: 0,

      customeraccounts: [],
      customerId:'',

      bookingdates: [],
      dateId: 0,
      arrivalDate: new Date( new Date().setHours(12,0,0,0) ),
      checkoutDate: new Date( new Date().setHours(12,0,0,0) ),
      // date1: '2020-09-17',
      // date2: '2020-09-24',
      // date1r: new Date(),
      // date2r: new Date(),
      // feedback: '',

      numOfNights: 0,
      redirect: false,
      showModal_1: false, // if "showModal_1" is true, show "Checkout date must be after arrival date" message 
      showModal_2: false, // if "showModal_2" is true, 
      showModal_3: false, // if "showModal_3" is true, 
    }
  }

  fetchBookings() {
    var url = 'http://localhost:8080/bookings/all'
    fetch(url)
    .then(res=>res.json())
    .then(json=>
      this.setState({ bookings: json }) )
  }

  fetchCustomerAccounts() {
    var url = 'http://localhost:8080/customeraccounts/all'
    fetch(url)
    .then(res=>res.json())
    .then(json=>
      this.setState({ customeraccounts: json.filter(ca => String(ca.email).startsWith(fire.auth().currentUser.email)) }) )
  }

  fetchRooms() {
    var url = 'http://localhost:8080/rooms/all'
    fetch(url)
    .then(res=>res.json())
    .then(json=> this.setState({ rooms: json.filter(r => Number(r.id) == this.props.match.params.roomId ) }) )
  }

  // fetchBookingDates() {
  //   var url = 'http://localhost:8080/bookingdates/all'
  //   fetch(url)
  //   .then(res=>res.json())
  //   .then(json=>
  //     this.setState({ bookingdates: json.filter(bd => (
  //       String(bd.room.id).startsWith(this.props.match.params.roomId) 
  //       && String(bd.arrivalDate).startsWith( this.state.arrivalDate.toDateString() ) 
  //       && String(bd.checkoutDate).startsWith( this.state.checkoutDate.toDateString() ) ) 
  //       ) 
  //     }) 
  //   )
  // }

  componentDidMount() {
    this.fetchBookings()
    this.fetchCustomerAccounts()
    this.fetchRooms()
    // this.fetchBookingDates()
  }

  changeHandler(e) {
    var obj = {}
    obj[e.target.name] = e.target.value
    this.setState(obj)
  }

  // function that will update "Total cost" and "Number of nights" on website when user clicks on "Refresh" button
  handleTotalCost() {
    var numOfNights = 0
    var total = 0
    // get number of nights booked by subtracting checkoutDate and arrivalDate
    numOfNights = Math.abs(this.state.checkoutDate - this.state.arrivalDate)
    numOfNights = numOfNights / (1000 * 60 * 60 * 24)
    this.state.numOfNights = numOfNights
    console.log("Number of nights: ", this.state.numOfNights)

    var url = 'http://localhost:8080/rooms/all'
    fetch(url)
    .then(res=>res.json())
    .then(json=> this.setState({ rooms: json.filter(r => Number(r.id) == this.props.match.params.roomId ) 
      }) 
    )
    // calculate total Cost based on price per night and number of nights booked (totalCost = price * numOfNights)
    .then(
      this.state.rooms.map( r => this.state.price = r.price),
      console.log("Price: ", this.state.price),
      total = numOfNights * parseInt(this.state.price),
      this.state.totalCost = total,
      console.log("Total cost: ", this.state.totalCost),
    )
  }

  handleArrivalDate(date) {
    date.setHours(12,0,0,0); // set time to make make it more convenient while subtracting dates in above function
    this.setState( {arrivalDate: date} );

    var numOfNights = 0
    // get number of nights booked by subtracting checkoutDate and arrivalDate
    numOfNights = Math.abs(this.state.checkoutDate - this.state.arrivalDate)
    numOfNights = numOfNights / (1000 * 60 * 60 * 24)
    this.state.numOfNights = numOfNights
    console.log("Number of nights: ", this.state.numOfNights)
  }

  handleCheckoutDate(date) {
    date.setHours(12,0,0,0); // set time to make make it more convenient while subtracting dates in above function
    this.setState( {checkoutDate: date} );

    var numOfNights = 0
    // get number of nights booked by subtracting checkoutDate and arrivalDate
    numOfNights = Math.abs(this.state.checkoutDate - this.state.arrivalDate)
    numOfNights = numOfNights / (1000 * 60 * 60 * 24)
    this.state.numOfNights = numOfNights
    console.log("Number of nights: ", this.state.numOfNights)
  }

  // handleDate1(date) {
  //   this.state.arrivalDate = new Date(date)
  //   console.log(this.state.date1, this.state.arrivalDate)
  // }

  // handleDate2(date) {
  //   this.state.checkoutDate = new Date(date)
  //   console.log(this.state.date2, this.state.checkoutDate)
  // }
  
  addBooking(price) {
    
    // compare dates
    // if arrival date is less than checkout date -> proceed
    if (this.state.arrivalDate < this.state.checkoutDate) {
      // checkout total cost
      // if total cost is more than 0 -> proceed
      if (this.state.totalCost == (price * this.state.numOfNights) && this.state.totalCost > 0) {
        // get ID of current user by filtering with current email from firebase
        var url = 'http://localhost:8080/customeraccounts/all'
        fetch(url)
        .then(res=>res.json())
        .then(json=>
          this.setState({ customeraccounts: json.filter(ca => String(ca.email).startsWith(fire.auth().currentUser.email)) 
          }) 
        )
        .then(this.state.customeraccounts.map( ca => this.state.customerId = ca.id) )
        .then(console.log("Customer ID: ", this.state.customerId))

        // console values that will be submitted to api
        console.log("--SUBMITTING TO BOOKING API--")
        console.log("Customer ID: ", this.state.customerId),
        console.log("Room ID: ", this.props.match.params.roomId),
        console.log("Request: ", this.state.request),
        console.log("Total cost: ", this.state.totalCost),
        console.log("Arrival date: ", this.state.arrivalDate ),
        console.log("Checkout date: ", this.state.checkoutDate )

        // POST new booking instance to api
        var methodVar = 'post'
        var url = 'http://localhost:8080/bookings'
        fetch(url, {
          method: methodVar,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            customer: {
              id: this.state.customerId
            },
            room: {
              id: this.props.match.params.roomId
            },
            request: this.state.request,
            total: parseInt(this.state.totalCost),
            arrivalDate: this.state.arrivalDate,
            checkoutDate: this.state.checkoutDate,
            reviewed: false,
            accepted: false
          })
        })
        .then(res => res.json())
        .then(json => this.fetchBookings())
        .then( this.setState ({ redirect: true }) )
        .then(
          console.log("Arrival date: ", this.state.arrivalDate ),
          console.log("Checkout date: ", this.state.checkoutDate )
        )
      }
      // if total cost is equal to or less than 0 -> error
      else {
        this.setState({showModal_2: true})
      }
    } 
    // if arrival date is equal to more than checkout date -> error
    else {
      this.setState({showModal_1: true})
    }

    
  }

  // function to close modals
  closeModal_1(){
    this.setState({showModal_1: false})
  }
  closeModal_2(){
    this.setState({showModal_2: false})
  }
  closeModal_3(){
    this.setState({showModal_3: false})
  }
 
  render(){
    // If login is successful, redirect to Homepage
    if (this.state.redirect === true) {
      return (<Redirect to='/BookingHistory'/>)  // if "redirect" is true, redirect to homepage
    } 
    // If login failed or is not yet attempted, show these stuff
    else {
      return(
        <div>
          {this.state.rooms.map(r => 
            <div className="container">
              {/* error message modal that shows when register failed because of form errors */}
              <Modal isOpen={this.state.showModal_1}>
                <h4>Checkout date must be AFTER arrival date</h4>
                <button onClick={this.closeModal_1.bind(this)}>Close</button>
              </Modal>
              {/* error message modal that shows when register failed because of used email address */}
              <Modal isOpen={this.state.showModal_2}>
                <h4>Please press "Calculate" before booking</h4>
                <button onClick={this.closeModal_2.bind(this)}>Close</button>
              </Modal>
              <br/>
              <h2>Book room</h2>
              <br/>
              <div className="row">
                {/* Show room information */}
                
                  <div className="col-md-4">
                    <p><b>Number:</b> {r.number}</p>
                    <p><b>Floor:</b> {r.floor}</p>
                    <p><b>Type:</b> {r.type.name}</p>
                    <p><b>Wifi:</b> {r.wifi ? <span>Yes</span> : <span>No</span> }</p>
                    <p><b>Smoking:</b> {r.smoking ? <span>Allowed</span> : <span>Not allowed</span>}</p>
                    <p><b>Price:</b> ${r.price}/night</p>
                  </div>
                

                {/* Calendar so user can pick arrival date */}
                <div className="col-md-4">
                  <h5>Arrival date:</h5>
                  <Calendar value={this.state.arrivalDate} onChange={this.handleArrivalDate.bind(this)}
                  minDate= { new Date( new Date().setDate( new Date().getDate() ) ) }
                  maxDate= { new Date( new Date().setDate( new Date().getDate() +7 ) ) }></Calendar>
                  <div style={{margin:"auto"}}><b>{this.state.arrivalDate.toDateString()}</b></div>
                </div>
                {/* Calendar so user can pick checkout date */}
                <div className="col-md-4">
                  <h5>Checkout date:</h5>
                  <Calendar value={this.state.checkoutDate} onChange={this.handleCheckoutDate.bind(this)}
                  minDate= { new Date( new Date().setDate( new Date().getDate() +1 ) ) }
                  maxDate= { new Date( new Date().setDate( new Date().getDate() +8 ) ) }></Calendar>
                  <div style={{margin:"auto"}}><b>{this.state.checkoutDate.toDateString()}</b></div>
                </div>
              </div>

              {/* <form>
                <label for="date1">Arrival date:</label>
                <input type="date" id="date1" name="date1" min="2020-09-17" max="2020-09-24" 
                onChange={this.handleDate1.bind(this)}
                value={this.state.date1}
                ></input>
                <br/>

                <label for="date2">Checkout date:</label>
                <input type="date" id="date2" name="date2" min="2020-09-17" max="2020-09-24" 
                onChange={this.handleDate2.bind(this)}
                value={this.state.date2}
                ></input>
                <br/>
              </form> */}
              
              {/* Form for other requests user may want */}
              Other requests:<input type='text' className="form-control" id='request' name='request' value={this.state.request} required
                onChange={this.changeHandler.bind(this)}/>
              <br/>
              {/* Show number of nights based on selected dates */}
              <h4>Duration of stay: {this.state.numOfNights} nights</h4>
              {/* Show total cost calculated based on price per room and number of nights*/}
              <h4>Total cost: ${this.state.totalCost}</h4> 
              {/* button that will update Number of nights and Total cost based on new date selection */}
              <button className="btn btn-primary" onClick={this.handleTotalCost.bind(this)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={refresh_button} title="Refresh number of nights and total cost">Calculate</button>
              <br/>
              <br/>
              <p>Please press "Calculate" before booking</p>

              {/* "Confirm booking" button that will trigger addBooking function */}
              <button className="btn btn-primary" 
                onClick={this.addBooking.bind(this, r.price)}
                onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
                style={book_button} title="Confirm booking" >
                    Confirm booking
              </button>
              <br/>
              <br/>
            </div>
          )}
        </div>
      )
    }
  }
}