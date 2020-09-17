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
const formValid = ({ formErrors, typeId, number, floor, price }) => {
  let valid = true;

  // if, for example, the value "newEmail" in formErrors object is = "" (length = 0) then the Email address field has no errors -> "valid" will stay "true"
  // if the value "newEmail" in formErrors object is = "Invalid email address format" (length > 0) then the Email address field is invalid -> "valid" will become "false"
  // same with other values in formErrors object
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  // if these values are empty, "valid" will become "false"
  typeId === "" && (valid = false);
  number === "" && (valid = false);
  floor === "" && (valid = false);
  price === "" && (valid = false);

  // if all fields are valid and are not empty, formValid will return "true"
  // if at least one field is invalid or is empty, formValid will return "false"
  return valid;
}

// regex for stuff
const numbersRegex = RegExp(/^[1-9][0-9]*$/)
const nameRegex = RegExp(/^[A-Z][a-zA-Z]{1,}(?: [A-Z][a-zA-Z]{1,}){1,}$/)

export default class RoomsAdmin extends React.Component{
 
  constructor(){
    super()
    this.state = {
      rooms: [],
      rooms2: [],
      roomtypes: [],
      id: "",
      typeId: 0,
      number: 0,
      wifi: false,
      smoking: false,
      floor: 0,
      price: 0,

      formErrors: {
        typeId: "",
        number: "",
        floor: "",
        price: ""
      },
      addNewRoom: true, // if true -> ADD mode, if false -> EDIT mode

      // if true -> show modal
      showModal_1: false,
      showModal_2: false,
      showModal_3: false,
      showModal_4: false,
      showModal_5: false,
    }
  }

  fetchRooms() {
    var url = 'http://localhost:8080/rooms/all'
    fetch(url)
      .then(res => res.json())
      .then(json => this.setState({ rooms: json }) )
      // .then(console.log(this.state.rooms))
  }

  componentDidMount() {
    this.fetchRooms()
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

      // Room type ID must be a number between 1-30
      case 'typeId':
        formErrors.typeId = 
          numbersRegex.test(value) && value > 0 && value < 31
            ? ""  // no error
            : "Room type ID must be a number between 1-30";
        break;

      // Room number must be a number between 101-2599
      case 'number':
        formErrors.number = 
          numbersRegex.test(value) && value > 100 && value.length < 2600
            ? ""  // no error
            : "Invalid room number format";
        break;

      // Floor number must be a number between 1-25
      case 'floor':
        formErrors.floor = 
          numbersRegex.test(value) && value > 0 && value < 26
            ? ""  // no error
            : "Floor number must be a number between 1-25";
        break;

      // Price must be a number between 50-500
      case 'price':
        formErrors.price = 
          numbersRegex.test(value) && value > 49 && value < 501
            ? ""  // no error
            : "Price must be a number between 50-500";
        break;
      default:
        break;
    }

    this.setState(
      { formErrors, [name]: value }, () => {
        console.log(`
          Room ID: ${this.state.id}, Type ID: ${this.state.typeId}, Room number: ${this.state.number},
          Wifi: ${this.state.wifi}, Smoking: ${this.state.smoking}, Floor: ${this.state.floor}, Price: ${this.state.price},
          addNewRoom: ${this.state.addNewRoom}, Form errors: ${this.state.formErrors}`)
      }
    )
  }

  editRoom(id, typeId, number, wifi, smoking, floor, price) {
    this.setState({
      id: id,
      typeId: typeId,
      number: number,
      wifi: wifi,
      smoking: smoking,
      floor: floor,
      price: price,
      addNewRoom: false
    })
  }

  addRoom() {
    this.setState({
      addNewRoom: true
    })
  }

  saveRoom() {
    var i;
    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING--

        Room ID: ${this.state.id}
        Type ID: ${this.state.typeId}
        Room number: ${this.state.number}
        Wifi: ${this.state.wifi}
        Smoking: ${this.state.smoking}
        Floor: ${this.state.floor}
        Price: ${this.state.price}
      `)

      var url = 'http://localhost:8080/roomtypes/all'
      fetch(url)
      .then(res=>res.json())
      .then(json=> {
        this.setState({ roomtypes: json.filter(rt => Number(rt.id) == this.state.typeId) 
        })

        // check if room type id exists
        if (this.state.roomtypes.length != 0) {

          var url = 'http://localhost:8080/rooms/all'
          fetch(url)
          .then(res=>res.json())
          .then(json=> {
            this.setState({ rooms2: json.filter(r => Number(r.number) == this.state.number) 
            })

            // check if room number is already taken
            if (this.state.rooms2.length == 0) {

              console.log("addNewRoom: ", this.state.addNewRoom)
              var methodVar = this.state.addNewRoom ? 'post' : 'put'
              var url = 'http://localhost:8080/rooms'

              if (methodVar == "post") {
                fetch(url, {
                  method: methodVar,
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                  },
                  body: JSON.stringify({
                    type: {
                      id: this.state.typeId
                    },
                    number: this.state.number,
                    wifi: this.state.wifi,
                    smoking: this.state.smoking,
                    floor: this.state.floor,
                    price: this.state.price,
                  })
                })
                .then(res => res.json())
                .then(json => this.fetchRooms())
                .then(console.log("room added on api"))
                .then(this.setState({showModal_1: true})) // show success message modal
              } 
              else if (methodVar == "put") {
                fetch(url, {
                  method: methodVar,
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                  },
                  body: JSON.stringify({
                    id: this.state.id,
                    type: {
                      id: this.state.typeId
                    },
                    number: this.state.number,
                    wifi: this.state.wifi,
                    smoking: this.state.smoking,
                    floor: this.state.floor,
                    price: this.state.price,
                  })
                })
                .then(res => res.json())
                .then(json => this.fetchRooms())
                .then(console.log("room info changed on api"))
                .then(this.setState({showModal_2: true})) // show success message modal
              }
            } else {
              console.log('ERROR: Room number is already taken')
              this.setState({ showModal_5: true }) // show error message modal if room number is already taken
            }
          })
        } else {
          console.log('ERROR: Room type id does not exist')
          this.setState({ showModal_4: true }) // show error message modal if room type id doesnt exist
        }
      })

      
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
          <h4>Room added</h4>
          <button onClick={this.closeModal_1.bind(this)}>Close</button>
        </Modal>
        <Modal isOpen={this.state.showModal_2}>
          <h4>Room info changed</h4>
          <button onClick={this.closeModal_2.bind(this)}>Close</button>
        </Modal>
        <Modal isOpen={this.state.showModal_3}>
          <h4>Invalid formats</h4>
          <button onClick={this.closeModal_3.bind(this)}>Close</button>
        </Modal>
        <Modal isOpen={this.state.showModal_4}>
          <h4>Room type ID does not exist</h4>
          <button onClick={this.closeModal_4.bind(this)}>Close</button>
        </Modal>
        <Modal isOpen={this.state.showModal_5}>
          <h4>Room number is already taken</h4>
          <button onClick={this.closeModal_5.bind(this)}>Close</button>
        </Modal>
        <br/>
        {/* ROOMS SECTION */}
        <div className="row">
          <br/>
          <h2 style={colCentered}>Rooms list</h2>
          <br/>
          <br/>
        </div>
        <div className="row">
          <br/>
          {/* Table for rooms to choose */}
          <table className="table table-hover table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Room number</th>
                <th>Floor</th>
                <th>Type</th>
                <th>Type ID</th>
                <th>Wifi</th>
                <th>Smoking</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
              <tbody>
                {this.state.rooms.map(r =>
                  <tr>
                    <td>{r.id}</td>
                    <td style={{fontWeight:"bold"}}>{r.number}</td>
                    <td>{r.floor}</td>
                    <td>{r.type.name}</td>
                    <td>{r.type.id}</td>

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
                    <td style={{fontWeight:"bold"}}>${r.price}/night</td>
                    {/* Button that triggers editRoomType function */}
                    {/* This will switch the form below to EDIT mode and fill the type name into the field*/}
                    <td>
                      <button className="btn btn-primary" 
                      onClick={this.editRoom.bind(this, r.id, r.type.id, r.number, r.wifi, r.smoking, r.floor, r.price)}
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
            <h2>Add/Edit room</h2>
            <br/>
            <div><b style={{fontSize:"16px"}}>INSTRUCTIONS:</b></div>
            <div>By default, the form is in ADD mode.</div>
            <div>If "Edit" button is pressed, the form will switch to EDIT mode</div>
            <div>To switch back to ADD mode, press "Switch to ADD mode" button</div>
            <br/>
            {/* "Add/Edit room" form */}
            {/* By default, this form is in ADD mode. When pressing "Save" button, a new room will be added */}
            {/* If admin presses "Edit" button from above, the form will switch to EDIT mode and pressing "Save" will change the room info */}
            <form id="edit-form">

              {/* Room type ID field */}
              <div className="input-field">
                <label htmlFor="type-id">Room type ID (must be a number between 1-30):</label>
                <input type="number" min="1" max="30" id="type-id" className="form-control" formNoValidate
                name="typeId" value={this.state.typeId} placeholder="Enter room type ID"
                onChange={this.changeHandler.bind(this)}/>

                {/* If form is invalid, show warning */}
                {this.state.formErrors.typeId.length > 0 && (
                  <span className="errorMessage" style={{color:"red"}}>{this.state.formErrors.typeId}</span>
                )}
              </div>
              <br/>

              {/* Room number field */}
              <div className="input-field">
                <label htmlFor="room-number">Room number (must be a number between 101-2599):</label>
                <input type="number" min="101" max="2599" id="room-number" className="form-control" formNoValidate
                name="number" value={this.state.number} placeholder="Enter room number"
                onChange={this.changeHandler.bind(this)}/>

                {/* If form is invalid, show warning */}
                {this.state.formErrors.number.length > 0 && (
                  <span className="errorMessage" style={{color:"red"}}>{this.state.formErrors.number}</span>
                )}
              </div>
              <br/>

              {/* Room wifi field */}
              <div className="input-field">
                <div>Room wifi:</div>
                <p style={{color:"red"}}>(Double click to choose. Double click again after pressing Edit button)</p>
                <input type="radio" id="room-wifi-true" name="wifi" value="true"
                onChange={this.changeHandler.bind(this)}
                />
                <label style={{marginLeft:"5px"}} htmlFor="room-wifi-true">Yes</label>
                <input type="radio" id="room-wifi-false" name="wifi" value="false"
                style={{marginLeft:"100px"}} onChange={this.changeHandler.bind(this)}
                />
                <label style={{marginLeft:"5px"}} htmlFor="room-wifi-false">No</label>
              </div>
              <br/>

              {/* Room smoking field */}
              <div className="input-field">
                <div>Room smoking:</div>
                <p style={{color:"red"}}>(Double click to choose. Double click again after pressing Edit button)</p>
                <input type="radio" id="room-smoking-true" name="smoking" value="true"
                onChange={this.changeHandler.bind(this)}/>
                <label style={{marginLeft:"5px"}} htmlFor="room-smoking-true">Allowed</label>
                <input type="radio" id="room-smoking-false" name="smoking" value="false"
                style={{marginLeft:"100px"}} onChange={this.changeHandler.bind(this)}/>
                <label style={{marginLeft:"5px"}} htmlFor="room-smoking-false">Not allowed</label>
              </div>
              <br/>

              {/* Room floor field */}
              <div className="input-field">
                <label htmlFor="room-floor">Floor number (must be a number between 1-25):</label>
                <input type="number" min="1" max="25" id="room-floor" className="form-control" formNoValidate
                name="floor" value={this.state.floor} placeholder="Enter room floor"
                onChange={this.changeHandler.bind(this)}/>

                {/* If form is invalid, show warning */}
                {this.state.formErrors.floor.length > 0 && (
                  <span className="errorMessage" style={{color:"red"}}>{this.state.formErrors.floor}</span>
                )}
              </div>
              <br/>

              {/* Room price field */}
              <div className="input-field">
                <label htmlFor="room-price">Room price (must be a number between 50-500):</label>
                <input type="number" min="50" max="500" id="room-price" className="form-control" formNoValidate
                name="price" value={this.state.price} placeholder="Enter room price"
                onChange={this.changeHandler.bind(this)}/>

                {/* If form is invalid, show warning */}
                {this.state.formErrors.price.length > 0 && (
                  <span className="errorMessage" style={{color:"red"}}>{this.state.formErrors.price}</span>
                )}
              </div>
              <br/>
            </form>

            {/* "Save" button that will trigger saveNewRoom function */}
            {/* this will submit the form */}
            <button type="submit" className="btn btn-primary" 
              onClick={this.saveRoom.bind(this)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={small_button} title="Save room type">
                Save
            </button>
            
            {/* "Switch to ADD" button that will trigger addNewRoom function */}
            {/* this will switch the form back to ADD, so when admin presses "Save" button, it will add new room type */}
            <button type="submit" className="btn btn-primary" 
              onClick={this.addRoom.bind(this)}
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