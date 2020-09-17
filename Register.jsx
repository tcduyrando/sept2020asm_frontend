import React from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom'
import fire from './config/Fire'  // import firebase for user authentication
import Modal from 'react-modal'   // import react-modal for error messages

// Make stuff stay in center
var colCentered = {
  float: 'none',
  margin: '0 auto'
}

// Style the "Register" button
var register_button = {
  fontWeight: 'bold',
  width: '300px',
  float: 'none',
  margin: '25px auto',
  fontSize: '24px',
  backgroundColor: 'goldenrod',
  color: 'black',
  borderColor: 'black'
}

// Change color when mouse hover over button
function hoverButtonColorOn(e) {
  e.target.style.background = '#c4941c';
}

// Change color when mouse stop hovering over button
function hoverButtonColorOff(e) {
  e.target.style.background = 'goldenrod';
}

// check if form is valid for submission
const formValid = ({ formErrors, name, password, email, phone, creditCard }) => {
  let valid = true;

  // if, for example, the value "email" in formErrors object is = "" (length = 0) then the Email address field has no errors -> "valid" will stay "true"
  // if the value "email" in formErrors object is = "Invalid email address format" (length > 0) then the Email address field is invalid -> "valid" will become "false"
  // same with other values in formErrors object
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  // if these values are empty, "valid" will become "false"
  name === "" && (valid = false);
  password === "" && (valid = false);
  email === "" && (valid = false);
  phone === "" && (valid = false);
  creditCard === "" && (valid = false);

  // if all fields are valid and are not empty, formValid will return "true"
  // if at least one field is invalid or is empty, formValid will return "false"
  return valid;
}

// regex for email address, phone number, credit card number, full name
const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
const numbersRegex = RegExp(/^\d+$/)
const nameRegex = RegExp(/^[A-Z][a-zA-Z]{1,}(?: [A-Z][a-zA-Z]{1,}){1,}$/)

export default class Register extends React.Component{
 
  constructor(){
    super()
    this.state = {
      customerAccounts: [],
      // id: '',
      name: '', 
      password: '',
      phone: '',
      email: '',
      creditCard: '',
      formErrors: {
        name: '', 
        password: '',
        phone: '',
        email: '',
        creditCard: '',
      },
      redirect: false, // if "redirect" is true, redirect to homepage
      showModal_1: false, // if "showModal_1" is true, show "Invalid credentials" message 
      showModal_2: false // if "showModal_2" is true, show "Email already used" message 
    }
  }

  fetchCustomerAccounts() {
    var url = 'http://localhost:8080/customeraccounts/all'
    fetch(url)
    .then(res=>res.json())
    .then(json=>
      this.setState({ customerAccounts: json }) )
  }

  componentDidMount() {
    this.fetchCustomerAccounts()
  }

  // Detect errors in form in real time before submitting
  changeHandler(e){
    var obj = {}
    obj[e.target.name] = e.target.value
    this.setState(obj)

    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = this.state.formErrors;

    // values in formErrors object will change according to the user's input in the Register account form
    // if form fields are invalid, values in formErrors object will contain error message
    switch (name) {

      // Name must include 4-100 letters and spaces only
      case 'name':
        formErrors.name = 
          nameRegex.test(value) && value.length < 101 && value.length > 3
            ? ""  // no error
            : "Invalid name format/length. Make sure to cpaitalize first letters.";
        break;

      // Email must be in correct format
      case 'email':
        formErrors.email = 
          emailRegex.test(value) && value.length > 0
            ? ""  // no error
            : "Invalid email address format";
        break;

      // Password must include 8-20 characters
      case 'password':
        formErrors.password = 
          value.length < 21 && value.length > 7
            ? ""  // no error
            : "Password must include 8-20 characters";
        break;

      // Phone number must include 6-15 numbers from 0-9 only
      case 'phone':
        formErrors.phone = 
          numbersRegex.test(value) && value.length < 16 && value.length > 5
            ? ""  // no error
            : "Phone number must include 6-15 numbers from 0-9 only";
        break;

      // Credit card number must include 16 numbers from 0-9 only
      case 'creditCard':
        formErrors.creditCard = 
          numbersRegex.test(value) && value.length == 16
            ? ""  // no error
            : "Credit card number must include 16 numbers from 0-9 only";
        break;
      default:
        break;
    }

    this.setState(
      { formErrors, [name]: value }, () => console.log(this.state)
    )
  }

  // signup function that triggers when user clicks "Create a new account" button
  signup(e) {
    e.preventDefault();

    // check if form is valid after clicking button to submit
    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING--
        Full name: ${this.state.name}
        Email address: ${this.state.email}
        Password: ${this.state.password}
        Phone number: ${this.state.phone}
        Credit card number: ${this.state.creditCard}
      `)

      // Add email and password to Firebase
      e.preventDefault();
      fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then( (u) => {
        this.setState({ redirect: true })

        // Add account data to postgres database
        var methodVar = 'post'
        var url = 'http://localhost:8080/customeraccounts';
        fetch(url, {
          method: methodVar,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Postman-Token': '<calculated when request is sent>',
            'Content-Length': '<calculated when request is sent>',
            'Host': '<calculated when request is sent>',
            'User-Agent': 'PostmanRuntime/7.26.2',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive'
          },
          body: JSON.stringify({
            name: this.state.name,
            password: this.state.password,
            phone: this.state.phone,
            email: this.state.email,
            creditCard: this.state.creditCard
          })
        })
        .then(res => res.json())
        .then(json => this.fetchCustomerAccounts())
        .then(console.log("account added to api"))
      })
      .catch((error) => {
        console.log(error.message);
        this.setState({showModal_2: true}) // show error message modal if firebase detects email is already used
      })

      
    } 
    else {
      console.log('ERROR - FORM INVALID');
      this.setState({ showModal_1: true }) // show error message modal if form is invalid
    }
  }

  // function to close modals
  closeModal_1(){
    this.setState({showModal_1: false})
  }
  closeModal_2(){
    this.setState({showModal_2: false})
  }
 
  render(){
    const { formErrors } = this.state;

    // if Register is successful, user will be logged in and redirected to Homepage
    if (this.state.redirect === true) {
      return (<Redirect to='/Home' />)  // if "redirect" is true, redirect to homepage
    } 

    // If Register failed or is not yet attempted, show these stuff
    else {
      return(
        <div className="col-md-6" style={colCentered}>
          {/* error message modal that shows when register failed because of form errors */}
          <Modal isOpen={this.state.showModal_1}>
            <h4>Invalid formats</h4>
            <button onClick={this.closeModal_1.bind(this)}>Close</button>
          </Modal>
          {/* error message modal that shows when register failed because of used email address */}
          <Modal isOpen={this.state.showModal_2}>
            <h4>Email is already used</h4>
            <button onClick={this.closeModal_2.bind(this)}>Close</button>
          </Modal>
          <br/>
          <h2>Register</h2>
          <br/>
          {/* Sign up form */}
          <form id="signup-form">

            {/* Full name field */}
            <div className="input-field">
              <label htmlFor="signup-name">Full name (4-100 letters and spaces only):</label>
              <input type="text" id="signup-name" className="form-control" formNoValidate
              name="name" value={this.state.name} placeholder="Enter full name"
              onChange={this.changeHandler.bind(this)}/>

              {/* If form is invalid, show warning */}
              {this.state.formErrors.name.length > 0 && (
                <span className="errorMessage" style={{color:"red"}}>{this.state.formErrors.name}</span>
              )}
            </div>
            <br/>

            {/* Email address field */}
            <div className="input-field">
              <label htmlFor="signup-email">Email address:</label>
              <input type="email" id="signup-email" className="form-control" formNoValidate
              name="email" value={this.state.email} placeholder="Enter email address"
              onChange={this.changeHandler.bind(this)}/>

              {/* If form is invalid, show warning */}
              {this.state.formErrors.email.length > 0 && (
                <span className="errorMessage" style={{color:"red"}}>{this.state.formErrors.email}</span>
              )}
            </div>
            <br/>

            {/* Password field */}
            <div className="input-field">
              <label htmlFor="signup-password">Password (8-32 characters):</label>
              <input type="password" id="signup-password" className="form-control" formNoValidate
              name="password" value={this.state.password} placeholder="Enter password"
              onChange={this.changeHandler.bind(this)}/>

              {/* If form is invalid, show warning */}
              {this.state.formErrors.password.length > 0 && (
                <span className="errorMessage" style={{color:"red"}}>{this.state.formErrors.password}</span>
              )}
            </div>
            <br/>

            {/* Phone number field */}
            <div className="input-field">
              <label htmlFor="signup-phone">Phone number (6-15 numbers from 0-9 only):</label>
              <input type="tel" id="signup-phone" className="form-control" formNoValidate
              name="phone" value={this.state.phone} placeholder="Enter phone number"
              onChange={this.changeHandler.bind(this)}/>

              {/* If form is invalid, show warning */}
              {this.state.formErrors.phone.length > 0 && (
                <span className="errorMessage" style={{color:"red"}}>{this.state.formErrors.phone}</span>
              )}
            </div>
            <br/>

            {/* Credit card number field */}
            <div className="input-field">
              <label htmlFor="signup-creditCard">Credit card number (16 numbers from 0-9 only):</label>
              <input type="tel" id="signup-creditCard" className="form-control" formNoValidate
              name="creditCard" value={this.state.creditCard} placeholder="Enter credit card number"
              onChange={this.changeHandler.bind(this)}/>

              {/* If form is invalid, show warning */}
              {this.state.formErrors.creditCard.length > 0 && (
                <span className="errorMessage" style={{color:"red"}}>{this.state.formErrors.creditCard}</span>
              )}
            </div>
            <br/>

            {/* "Create a new account" button that will trigger signup function */}
            <button type="submit" className="btn btn-primary" 
              onClick={this.signup.bind(this)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={register_button} title="Create a new account">
                Create a new account
            </button>
          </form>
        </div>
        
      )
    }
  }
 
}