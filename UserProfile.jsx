import React from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom'
import fire from './config/Fire.js'  // import firebase for user authentication
import Modal from 'react-modal'   // import react-modal for error messages

// Make stuff stay in the center
var colCentered = {
  float: 'none',
  margin: '0 auto'
}

// Style the "Apply changes" button
var apply_button = {
  fontWeight: 'bold',
  width: '300px',
  float: 'none',
  margin: '25px auto',
  fontSize: '24px',
  backgroundColor: 'goldenrod',
  color: 'black',
  borderColor: 'black'
}

// Style the "Fill form with this info" button
var fill_button = {
  fontWeight: 'bold',
  width: '250px',
  float: 'none',
  margin: '0px auto',
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

// check if form is valid for submission
const formValid = ({ formErrors, name, newPassword, newEmail, phone, creditCard }) => {
  let valid = true;

  // if, for example, the value "newEmail" in formErrors object is = "" (length = 0) then the Email address field has no errors -> "valid" will stay "true"
  // if the value "newEmail" in formErrors object is = "Invalid email address format" (length > 0) then the Email address field is invalid -> "valid" will become "false"
  // same with other values in formErrors object
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  // if these values are empty, "valid" will become "false"
  name === "" && (valid = false);
  newPassword === "" && (valid = false);
  newEmail === "" && (valid = false);
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

export default class UserProfile extends React.Component{
 
  constructor(props){
    super(props)
    this.state = {
      customeraccounts: [],
      id: '',
      name: '', 
      newPassword: '',
      currentPassword: '',
      phone: '',
      currentEmail: '',
      newEmail: '',
      creditCard: '',
      formErrors: {
        name: '', 
        newPassword: '',
        phone: '',
        currentEmail: '',
        newEmail: '',
        creditCard: '',
      },

      showModal_1: false, // if "showModal_1" is true, show "Invalid credentials" message 
      showModal_2: false, // if "showModal_2" is true, show "Email already used" message 
      showModal_3: false, // if "showModal_3" is true, show "Changes made are successful" message 
      showModal_4: false, // if "showModal_4" is true, show "Please log out and log in again to change email/password" message
      showModal_5: false, // if "showModal_5" is true, show "Current password is incorrect" message 
    }
  }

  // fetch bookings from api and filter to only include the booking the user selected
  fetchCustomerAccounts() {
    var url = 'http://localhost:8080/customeraccounts/all'
    fetch(url)
    .then(res=>res.json())
    .then(json=>
      this.setState({ customeraccounts: json.filter(ca => String(ca.email).startsWith(fire.auth().currentUser.email)) 
      }) 
    )
    .then(this.state.customeraccounts.map( ca => {
      this.state.id = ca.id,
      this.state.currentEmail = ca.email
    }) )
    .then(
      console.log("Customer ID: ", this.state.id),
      console.log("Customer email: ", this.state.currentEmail)
    )
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
      case 'newEmail':
        formErrors.newEmail = 
          emailRegex.test(value) && value.length > 0
            ? ""  // no error
            : "Invalid email address format";
        break;

      // NEW password must include 8-20 characters
      case 'newPassword':
        formErrors.newPassword = 
          value.length < 21 && value.length > 7
            ? ""  // no error
            : "New password must include 8-20 characters";
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

  fillForm(id, name, newEmail, phone, creditCard) {
    this.setState({
      id: id,
      name: name,
      newEmail: newEmail,
      phone: phone,
      creditCard: creditCard
    })
  }

  reauthenticate(currentPassword) {
    var user = fire.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(user.email, currentPassword);
  }

  // "applyChanges" function that triggers when user clicks "Apply changes" button
  applyChanges(e) {
    e.preventDefault();

    // check if form is valid after clicking button to submit
    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING--
        Full name: ${this.state.name}
        Email address: ${this.state.newEmail}
        New password: ${this.state.newPassword}
        Phone number: ${this.state.phone}
        Credit card number: ${this.state.creditCard}
      `)

      var url = 'http://localhost:8080/customeraccounts/all'
      fetch(url)
      .then(res=>res.json())
      .then(json=>
        this.setState({ customeraccounts: json.filter(ca => String(ca.email).startsWith(fire.auth().currentUser.email)) 
        }) 
      )
      .then(this.state.customeraccounts.map( ca => {
        // check if "current password" user entered matches with password from api
        console.log(ca.password);
        console.log(this.state.currentPassword)
        if (this.state.currentPassword == ca.password) {
          // Add email and password to Firebase
          e.preventDefault();

          // Reauthenticate user because firebase requires this before updating email and password
          // this.reauthenticate(this.state.currentPassword).then( () => {

          // }).catch( (error) => {
          //   console.log(error.message)
          // });

          // Update email on Firebase
          var user = fire.auth().currentUser;
          user.updateEmail(this.state.newEmail).then( () => {
            console.log("Email was changed");

            // Update password on Firebase
            user.updatePassword(this.state.newPassword).then( () => {
              console.log("Password was changed");

              // Add account data to postgres database
              var methodVar = 'put'
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
                  id: this.state.id,
                  name: this.state.name,
                  password: this.state.newPassword,
                  phone: this.state.phone,
                  email: this.state.newEmail,
                  creditCard: this.state.creditCard
                })
              })
            .then(res => res.json())
            .then(json => this.fetchCustomerAccounts())
            .then(console.log("account info changed on api"))
            .then(this.setState({showModal_3: true})) // show success message modal
            })
            .catch((error) => {
              console.log(error.message);
            })
          })
          // show error message modal depending on error
          .catch((error) => {
            console.log(error.message);
            if (error.message == "This operation is sensitive and requires recent authentication. Log in again before retrying this request."){
              this.setState({showModal_4: true}) // show error message modal if firebase needs reauthentication
            } else {
              this.setState({showModal_2: true}) // show error message modal if firebase detects email is already used
            }
          })
        } else {
          this.setState({showModal_5: true}) // show error message modal if current password that user typed in is incorrect
        }
      }) 
      ) 
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
  closeModal_3(){
    this.setState({showModal_3: false})
  }
  closeModal_4(){
    this.setState({showModal_4: false})
  }
  closeModal_5(){
    this.setState({showModal_5: false})
  }
 
  render(){
    return(
      <div className="container">
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
        <Modal isOpen={this.state.showModal_3}>
          <h4>Changes made are successful</h4>
          <button onClick={this.closeModal_3.bind(this)}>Close</button>
        </Modal>
        <Modal isOpen={this.state.showModal_4}>
          <h4>Please log out and log in again to change email/password</h4>
          <button onClick={this.closeModal_4.bind(this)}>Close</button>
        </Modal>
        <Modal isOpen={this.state.showModal_5}>
          <h4>Current password is incorrect</h4>
          <button onClick={this.closeModal_5.bind(this)}>Close</button>
        </Modal>
        <br/>
        <div className="row">
          <br/>
          <h2 style={colCentered}>User profile</h2>
          <br/>
          <br/>
        </div>
        <div className="row">
          <br/>
          {/* Table with customer account info */}
          {this.state.customeraccounts.map(ca =>
            <table className="table table-hover table-bordered table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <td>{ca.id}</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td style={{fontWeight:"bold"}}>{ca.name}</td>
                </tr>
                <tr>
                  <th>Email address</th>
                  <td>{ca.email}</td>
                </tr>
                <tr>
                  <th>Phone number</th>
                  <td>{ca.phone}</td>
                </tr>
                <tr>
                  <th>Credit card number</th>
                  <td>{ca.creditCard}</td>
                </tr>
                <tr>
                  <th>Action</th>
                  <td>
                    <button className="btn btn-primary" id="crud-button"
                      onClick={this.fillForm.bind(this, ca.id, ca.name, ca.email, ca.phone, ca.creditCard)}
                      onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
                      style={fill_button} title="Fill the form with info from this table">
                        Copy info to form
                    </button>
                  </td>
                </tr>
              </tbody>                   
            </table>
          )}
          <br/>
        </div>
        <div className="row">
          <div className="col-md-6" style={colCentered}>
            <br/>
            <h2>Edit information</h2>
            <h6 style={{color:"red"}}>Please make sure you logged in recently before changing your information.</h6>
            <h6>INSTRUCTIONS:</h6>
            <div>Please make sure every field is filled.</div>
            <div>If there is a field you do not wish to change, type in the current information for that field.</div>
            <br/>
            {/* "Edit account info" form */}
            <form id="edit-form">

              {/* Full name field */}
              <div className="input-field">
                <label htmlFor="new-name">Full name (4-100 letters and spaces only):</label>
                <input type="text" id="new-name" className="form-control" formNoValidate
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
                <label htmlFor="new-email">Email address:</label>
                <input type="email" id="new-email" className="form-control" formNoValidate
                name="newEmail" value={this.state.newEmail} placeholder="Enter email address"
                onChange={this.changeHandler.bind(this)}/>

                {/* If form is invalid, show warning */}
                {this.state.formErrors.newEmail.length > 0 && (
                  <span className="errorMessage" style={{color:"red"}}>{this.state.formErrors.newEmail}</span>
                )}
              </div>
              <br/>

              {/* NEW password field */}
              <div className="input-field">
                <label htmlFor="new-password">New password (8-32 characters):</label>
                <input type="password" id="new-password" className="form-control" formNoValidate
                name="newPassword" value={this.state.newPassword} placeholder="Enter new password"
                onChange={this.changeHandler.bind(this)}/>

                {/* If form is invalid, show warning */}
                {this.state.formErrors.newPassword.length > 0 && (
                  <span className="errorMessage" style={{color:"red"}}>{this.state.formErrors.newPassword}</span>
                )}
              </div>
              <br/>

              {/* Phone number field */}
              <div className="input-field">
                <label htmlFor="new-phone">Phone number (6-15 numbers from 0-9 only):</label>
                <input type="tel" id="new-phone" className="form-control" formNoValidate
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
                <label htmlFor="new-creditCard">Credit card number (16 numbers from 0-9 only):</label>
                <input type="tel" id="new-creditCard" className="form-control" formNoValidate
                name="creditCard" value={this.state.creditCard} placeholder="Enter credit card number"
                onChange={this.changeHandler.bind(this)}/>

                {/* If form is invalid, show warning */}
                {this.state.formErrors.creditCard.length > 0 && (
                  <span className="errorMessage" style={{color:"red"}}>{this.state.formErrors.creditCard}</span>
                )}
              </div>
              <br/>

              {/* CURRENT password field */}
              <div className="input-field">
                <label htmlFor="current-password">Current password (8-32 characters):</label>
                <input type="password" id="current-password" className="form-control" formNoValidate
                name="currentPassword" value={this.state.currentPassword} placeholder="Enter current password"
                onChange={this.changeHandler.bind(this)}/>
              </div>
              <br/>

              {/* "Apply changes" button that will trigger applyChanges function */}
              <button type="submit" className="btn btn-primary" 
                onClick={this.applyChanges.bind(this)}
                onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
                style={apply_button} title="Apply changes to account information">
                  Apply changes
              </button>
            </form>
          </div>
        </div>
      </div>

    )
  }
}