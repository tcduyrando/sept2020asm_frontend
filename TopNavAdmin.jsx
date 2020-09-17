import React from 'react'
import Homepage from './Homepage.jsx'
import { Link } from 'react-router-dom'
import fire from './config/Fire.js'


// Add an orangered background color to the top navigation bar
var topnav = {
  overflow: 'hidden',
  backgroundColor: 'goldenrod',
}

// Style the links (Logo) inside the navigation bar
var topnav_a = {
  float: 'left',
  display: 'block',
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '0px',
  paddingRight: '5px',
}

// Style the links on right side of navigation bar
var topnav_button = {
  display: 'block',
  color: 'black',
  textAlign: 'center',
  padding: '17px 16px',
  float: 'right',
  textDecoration: 'none',
  fontSize: '20px',
  fontWeight: 'bold'
}

// Style the "Logout" button inside the navigation bar
var logout_button = {
  display: 'block',
  color: 'black',
  textAlign: 'center',
  padding: '17px 16px',
  float: 'right',
  textDecoration: 'none',
  fontSize: '20px',
  fontWeight: 'bold',
  backgroundColor: 'goldenrod',
  border: 'none'
}

// Change color when mouse hover over button
function hoverButtonColorOn(e) {
  e.target.style.background = 'white';
}

// Change color when mouse stop hovering over button
function hoverButtonColorOff(e) {
  e.target.style.background = 'goldenrod';
}

export default class TopNavAdmin extends React.Component {

  logout() {
    fire.auth().signOut();
  }

  render(){
    return(
      <div>
        <div className="topnav" style={topnav}>
          <div className="row">
            {/* Indent */}
            <div className="col-md-1"></div>
            <div className="col-md-10">
              {/* Logo, which links to homepage */}
              <Link to="/Home" style={topnav_a}>
                  <img src="logo.png" alt="Bootleg RMIT"></img>
              </Link>
              {/* "Logout" button */}
              <button onClick={this.logout.bind(this)} style={logout_button}
                onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff}>
                Log out
              </button>
              {/* Link to "RoomsAdmin" page where admin can manage rooms */}
              <Link to="/RoomsAdmin" style={topnav_button}
                onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff}>
                Rooms
              </Link>
              {/* Link to "RoomTypesAdmin" page where admin can manage room types */}
              <Link to="/RoomTypesAdmin" style={topnav_button}
                onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff}>
                Room Types
              </Link>
              {/* Link to "BookingsAdmin" page where admin can view and accept/reject bookings */}
              <Link to="/BookingsAdmin" style={topnav_button}
                onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff}>
                Bookings
              </Link>
            </div>
            {/* Indent */}
            <div className="col-md-1"></div>
          </div>
        </div>
      </div>
    )
  }
}