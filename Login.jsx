import React from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom'
import fire from './config/Fire'  // import firebase for user authentication
import Modal from 'react-modal'   // import react-modal for error messages

// we tried to use toastify for error messages but ran into problems with css file
// import { toast } from 'react-toastify' 
// import 'react-toastify/dist/ReactToastify.css'
// import 'react-toastify/scss/main.scss'

Modal.setAppElement('#app')

// Make stuff stay in the center
var colCentered = {
  float: 'none',
  margin: '0 auto'
}

// Style the "Login" button 
var login_button = {
  fontWeight: 'bold',
  width: '150px',
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

// Change color when mouse stops hovering over button
function hoverButtonColorOff(e) {
  e.target.style.background = 'goldenrod';
}

export default class Login extends React.Component{
 
  constructor(props){
    super(props)
    this.state = {
      email: '', 
      password: '',
      redirect: false, // if "redirect" is true, redirect to homepage
      showModal: false // if "showModal" is true, show error message 
    }
  }
  
  changeHandler(e){
    var obj = {}
    obj[e.target.name] = e.target.value
    this.setState(obj)
  }
  
  // login function that will trigger when user clicks "Log in" button under form
  login(e){
    e.preventDefault();
    // use firebase to sign in with email and password
    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then( (u) => {
      this.setState({ redirect: true }) // if login is successful, "redirect" is true
    })
    .catch((error) => {
      console.log(error);
      this.setState({ showModal: true }) // if login failed, "showModal" is true 
    })
  }

  // function that triggers when user click "Close" button on error message modal
  closeModal(){
    this.setState({showModal: false})
  }
 
  render(){
    // If login is successful, redirect to Homepage
    if (this.state.redirect === true) {
      return (<Redirect to='/Home' />)  // if "redirect" is true, redirect to homepage
    } 
    // If login failed or is not yet attempted, show these stuff
    else {
      return(
        <div className="col-md-6" style={colCentered}>
          {/* error message modal that shows when login failed */}
          <Modal isOpen={this.state.showModal} >
            <h4>Invalid email and/or password</h4>
            <button onClick={this.closeModal.bind(this)}>Close</button>
          </Modal>
          <br/>
          <h2>Log in</h2>
          <br/>
          {/* Login form */}
          <form>
            {/* Email address field*/}
            <div className="form-group">
              <label htmlFor="login-email">Email address: </label>
              <input type='email' className="form-control" id='login-email' 
                name='email' value={this.state.email} placeholder="Enter email address"
                onChange={this.changeHandler.bind(this)}/>
            </div>
            {/* Password field*/}
            <div className="form-group">
              <label htmlFor="login-password">Password: </label>
              <input type='password' className="form-control" id='login-password' 
                name='password' value={this.state.password} placeholder="Enter password"
                onChange={this.changeHandler.bind(this)}/>
            </div>
            {/* "Log in" button that will trigger login function */}
            <button type="submit" className="btn btn-primary" 
              onClick={this.login.bind(this)}
              onMouseOver={hoverButtonColorOn} onMouseOut={hoverButtonColorOff} 
              style={login_button} title="Sign in with your account" >
                Log in
            </button>
          </form>
        </div>
        
      )
    }
  }
 
}