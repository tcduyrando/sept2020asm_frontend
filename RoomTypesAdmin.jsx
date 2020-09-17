import React from 'react'
import Modal from 'react-modal'   // import react-modal for error messages

import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'

// Make stuff stay in the center
var colCentered = {
  float: 'none',
  margin: '0 auto'
}

// Style the "Edit" and "Save" button
var small_button = {
  fontWeight: 'bold',
  width: '75px',
  float: 'none',
  marginRight: '5px',
  fontSize: '18px',
  backgroundColor: 'goldenrod',
  color: 'black',
  borderColor: 'black'
}

// Style the "Switch to ADD mode" button
var big_button = {
  fontWeight: 'bold',
  width: '250px',
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

// check if form is valid for submission
const formValid = ({ formErrors, typeName }) => {
  let valid = true;

  // if, for example, the value "newEmail" in formErrors object is = "" (length = 0) then the Email address field has no errors -> "valid" will stay "true"
  // if the value "newEmail" in formErrors object is = "Invalid email address format" (length > 0) then the Email address field is invalid -> "valid" will become "false"
  // same with other values in formErrors object
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  // if these values are empty, "valid" will become "false"
  typeName === "" && (valid = false);

  // if all fields are valid and are not empty, formValid will return "true"
  // if at least one field is invalid or is empty, formValid will return "false"
  return valid;
}

// regex for stuff
const numbersRegex = RegExp(/^[1-9][0-9]*$/)
const nameRegex = RegExp(/^[A-Z][a-zA-Z]{1,}(?: [A-Z][a-zA-Z]{1,}){1,}$/)

export default class RoomTypesAdmin extends React.Component{
 
  constructor(){
    super()
    this.state = {
      roomtypes: [],
      typeId: "",
      typeName: "",

      formErrors: {
        typeName: "",
      },
      addNewType: true,
      showModal_1: false, // if "showModal_1" is true, show "Invalid credentials" message 
      showModal_2: false, // if "showModal_2" is true, show "Email already used" message 
      showModal_3: false, // if "showModal_3" is true, show "Changes made are successful" message 
      showModal_4: false, // if "showModal_4" is true, show "Please log out and log in again to change email/password" message
      showModal_5: false, // if "showModal_5" is true, show "Current password is incorrect" message 
    }
  }

  fetchRoomTypes() {
    var url = 'http://localhost:8080/roomtypes/all'
    fetch(url)
      .then(res => res.json())
      .then(json => this.setState({ roomtypes: json }))
      // .then(console.log(this.state.roomtypes))
  }

  componentDidMount() {
    this.fetchRoomTypes()
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

      // Room type name must include 4-50 letters and spaces only
      case 'typeName':
        formErrors.typeName = 
          nameRegex.test(value) && value.length < 51 && value.length > 3
            ? ""  // no error
            : "Invalid name format/length. Make sure to cpaitalize first letters.";
        break;
      default:
        break;
    }

    this.setState(
      { formErrors, [name]: value }, () => {
        console.log(`
          Type ID: ${this.state.typeId},
          Type name: ${this.state.typeName},
          Form errors: ${this.state.formErrors.typeName}`)
      }
    )
  }

  editRoomType(typeId, typeName) {
    this.setState({
      typeId: typeId,
      typeName: typeName,
      addNewType: false
    })
    this.then(console.log("addNewType: ", this.state.addNewType))
  }

  addRoomType() {
    this.setState({
      addNewType: true
    })
    this.then(console.log("addNewType: ", this.state.addNewType))
  }

  saveRoomType() {

    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING--
        Room type name: ${this.state.typeName}
      `)

      console.log("addNewType: ", this.state.addNewType)
      var methodVar = this.state.addNewType ? 'post' : 'put'
      var url = 'http://localhost:8080/roomtypes'

      if (methodVar == "post") {
        fetch(url, {
          method: methodVar,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // 'Postman-Token': '<calculated when request is sent>',
            // 'Content-Length': '<calculated when request is sent>',
            // 'Host': '<calculated when request is sent>',
            // 'User-Agent': 'PostmanRuntime/7.26.2',
            // 'Accept-Encoding': 'gzip, deflate, br',
            // 'Connection': 'keep-alive'
          },
          body: JSON.stringify({
            name: this.state.typeName
          })
        })
        .then(res => res.json())
        .then(json => this.fetchRoomTypes())
        .then(console.log("room type added on api"))
        .then(this.setState({showModal_1: true})) // show success message modal
      } 
      else if (methodVar == "put") {
        fetch(url, {
          method: methodVar,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // 'Postman-Token': '<calculated when request is sent>',
            // 'Content-Length': '<calculated when request is sent>',
            // 'Host': '<calculated when request is sent>',
            // 'User-Agent': 'PostmanRuntime/7.26.2',
            // 'Accept-Encoding': 'gzip, deflate, br',
            // 'Connection': 'keep-alive'
          },
          body: JSON.stringify({
            id: this.state.typeId,
            name: this.state.typeName
          })
        })
        .then(res => res.json())
        .then(json => this.fetchRoomTypes())
        .then(console.log("room type info changed on api"))
        .then(this.setState({showModal_2: true})) // show success message modal
      }
    }
    else {
      console.log('ERROR - FORM INVALID');
      this.setState({ showModal_3: true }) // show error message modal if form is invalid
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
        <Modal isOpen={this.state.showModal_1}>
          <h4>Room type added</h4>
          <button onClick={this.closeModal_1.bind(this)}>Close</button>
        </Modal>
        <Modal isOpen={this.state.showModal_2}>
          <h4>Room type info changed</h4>
          <button onClick={this.closeModal_2.bind(this)}>Close</button>
        </Modal>
        <Modal isOpen={this.state.showModal_3}>
          <h4>Invalid formats</h4>
          <button onClick={this.closeModal_3.bind(this)}>Close</button>
        </Modal>
        <br/>

        <div className="row">
          <br/>
          <h2 style={colCentered}>Room types list</h2>
          <br/>
          <br/>
        </div>
        <div className="row">
          <br/>
          {/* Table for room types to choose */}
          <table className="table table-hover table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type name</th>
                <th>Action</th>
              </tr>
            </thead>
              <tbody>
                {this.state.roomtypes.map(rt =>
                  <tr>
                    <td>{rt.id}</td>
                    <td>{rt.name}</td>
                    {/* Button that triggers editRoomType function */}
                    {/* This will switch the form below to EDIT mode and fill the type name into the field*/}
                    <td>
                      <button className="btn btn-primary" 
                      onClick={this.editRoomType.bind(this, rt.id, rt.name)}
                      onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
                      style={small_button} title="Edit this room">
                        Edit
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
          </table>
          <br/>
        </div>
        <div className="row">
          <div className="col-md-6" style={colCentered}>
            <br/>
            <h2>Add/Edit room type</h2>
            <br/>
            <div><b style={{fontSize:"16px"}}>INSTRUCTIONS:</b></div>
            <div>By default, the form is in ADD mode.</div>
            <div>If "Edit" button is pressed, the form will switch to EDIT mode</div>
            <div>To switch back to ADD mode, press "Switch to ADD mode" button</div>
            <br/>
            {/* "Add/Edit room type" form */}
            {/* By default, this form is in ADD mode. When pressing "Save" button, a new room type will be added */}
            {/* If admin presses "Edit" button from above, the form will switch to EDIT mode and pressing "Save" will change the room type name */}
            <form id="edit-form">

              {/* Room type name field */}
              <div className="input-field">
                <label htmlFor="type-name">Room type name (must include 4-50 letters and spaces only):</label>
                <input type="text" id="type-name" className="form-control" formNoValidate
                name="typeName" value={this.state.typeName} placeholder="Enter room type name"
                onChange={this.changeHandler.bind(this)}/>

                {/* If form is invalid, show warning */}
                {this.state.formErrors.typeName.length > 0 && (
                  <span className="errorMessage" style={{color:"red"}}>{this.state.formErrors.typeName}</span>
                )}
              </div>
              <br/>
            </form>

            {/* "Save" button that will trigger saveNewType function */}
            {/* this will submit the form */}
            <button type="submit" className="btn btn-primary" 
              onClick={this.saveRoomType.bind(this)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={small_button} title="Save room type">
                Save
            </button>
            
            {/* "Switch to ADD" button that will trigger addNewType function */}
            {/* this will switch the form back to ADD, so when admin presses "Save" button, it will add new room type */}
            <button type="submit" className="btn btn-primary" 
              onClick={this.addRoomType.bind(this)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={big_button} title="Switch form to add new room type">
                Switch to ADD mode
            </button>
          </div>
        </div>
        
      </div>
    )
  }
}