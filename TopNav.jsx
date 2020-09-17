import React from 'react'
import Homepage from './Homepage.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import { Link } from 'react-router-dom'

// Add an goldenrod background color to the top navigation bar
var topnav = {
  overflow: 'hidden',
  backgroundColor: 'goldenrod',
  color: 'white'
}

// Style the links (Logo) inside the navigation bar
var topnav_a = {
  float: 'left',
  display: 'block',
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '0px',
  paddingRight: '5px'
}

// Style the links (Book a room, Log in, Register) in homepage
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

/* Style the search field */
var form_search_input = {
  padding: '10px',
  fontSize: '17px',
  border: '1px solid grey',
  float: 'left',
  width: '250px',
  background: '#f1f1f1',
  marginTop: '8px',
  marginLeft: '8px'
}

/* Style the submit button */
var form_search_button = {
  float: 'left',
  width: '60px',
  padding: '10px',
  background: '#2196F3',
  color: 'white',
  fontSize: '17px',
  border: '1px solid grey',
  borderLeft: 'none', /* Prevent double borders */
  cursor: 'pointer',
  marginTop: '8px',
  marginRight: '8px'
}

// Change color when mouse hover over button
function hoverButtonColorOn(e) {
  e.target.style.background = 'white';
}

// Change color when mouse stops hovering over button
function hoverButtonColorOff(e) {
  e.target.style.background = 'goldenrod';
}

export default class TopNav extends React.Component {

  render(){
  return(
    <div>
      <div className="topnav" style={topnav}>
        <div className="row">
          {/* Indent */}
          <div className="col-md-1"></div>
          <div className="col-md-10">
            {/* Logo, which links to Homepage */}
            <Link to="/Home" style={topnav_a}>
              <img src="logo.png" alt="Shitz-Carlton"></img>
            </Link>
            {/* Link to page where user can register an account */}
            <Link to="/Register" style={topnav_button}
            onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff}>
              Register
            </Link>
            {/* Link to Login page */}
            <Link to="/Login" style={topnav_button}
            onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff}>
              Log in
            </Link>
            {/* Since the user is not logged in, they cannot book a room yet.
                So this link will redirect them to Login page */}
            <Link to="/Login" style={topnav_button}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff}>
              Book a room
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