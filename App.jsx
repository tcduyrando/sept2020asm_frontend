import React from 'react'
import TopNav from './TopNav.jsx'
import TopNavLoggedIn from './TopNavLoggedIn.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import Footer from './Footer.jsx'
import Homepage from './Homepage.jsx'
import Rooms from './Rooms.jsx'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'
import BookingPage from './BookingPage.jsx'
import BookingHistory from './BookingHistory.jsx'
import BookingDetails from './BookingDetails.jsx'
import UserProfile from './UserProfile.jsx'
import TopNavAdmin from './TopNavAdmin.jsx'
import RoomsAdmin from './RoomsAdmin.jsx'
import RoomTypesAdmin from './RoomTypesAdmin.jsx'
import BookingsAdmin from './BookingsAdmin.jsx'
import BookingDetailsAdmin from './BookingDetailsAdmin.jsx'
import fire from './config/Fire.js' // import firebase for user authentication


export default class App extends React.Component{
  constructor(){
    super();
    this.state = {
      user: {},
      admin: {}
    }
  }
  
  componentDidMount(){
    this.authListener();
  }

  // check if the user is logged in
  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      console.log(user);
      // check if their is a user logged in
      if (user) {
        // check if user is admin
        if (user.email == "admin@gmail.com") {
          this.setState({ admin: user });
        }
        // else: user is customer
        else {
          this.setState({ user: user });
        }
      } 
      // no user is logged in
      else {
        this.setState({ user: null, admin: null });
      }
    });
  }

    render(){
      return(
        <div className="App">
          {this.state.admin === null && this.state.user === null ?
          // if users are NOT logged in, show these stuff
            (<div>
              <div className="main-container">
                <BrowserRouter>
                  {/* Top navigation bar for guest users */}
                  <TopNav></TopNav>
                    <br/>
                    <div className="row">
                      <div className="col-md-1"></div>
                      <div className="col-md-10">
                        <div style={{fontSize: '22px', fontWeight: 'bold'}}>
                          Welcome, Guest!
                        </div>
                      </div>
                      <div className="col-md-1"></div>
                    </div>
                  <Switch>
                    <Route exact path="/" component={Homepage} />
                    <Route path="/Login" component={Login} />
                    <Route path="/Register" component={Register} />
                    <Route path="/Home" component={Homepage} />
                    <Route path="/Rooms" component={Rooms} />
                    <Route path="/BookingPage/:roomId" component={BookingPage} />
          
                  </Switch>
                  <Footer></Footer>
                </BrowserRouter>
              </div>
            </div>)
            :
            this.state.user ?
            // if user is logged in, show these stuff
              (<div> 
                <div className="main-container">
                  <BrowserRouter>
                    {/* Top navigation bar for logged in users */}
                    <TopNavLoggedIn></TopNavLoggedIn> 
                      <br/>
                      <div className="row">
                        <div className="col-md-1"></div>
                        <div className="col-md-10">
                          <div style={{fontSize: '22px', fontWeight: 'bold'}}>
                            Welcome, User!
                          </div>
                        </div>
                        <div className="col-md-1"></div>
                      </div>
                    <Switch>
                      <Route exact path="/" component={Homepage} />
                      <Route path="/Home" component={Homepage} />
                      <Route path="/Rooms" component={Rooms} />
                      <Route path="/BookingPage/:roomId" component={BookingPage} />
                      <Route path="/BookingHistory" component={BookingHistory} />
                      <Route path="/BookingDetails/:bookingId" component={BookingDetails} />
                      <Route path="/UserProfile" component={UserProfile} />
                    </Switch>
                    <Footer></Footer>
                  </BrowserRouter>
                </div>
              </div>)
            : this.state.admin ?
            // if admin is logged in, show these stuff
              (<div> 
                <div className="main-container">
                  <BrowserRouter>
                    {/* Top navigation bar for logged in users */}
                    <TopNavAdmin></TopNavAdmin> 
                      <br/>
                      <div className="row">
                        <div className="col-md-1"></div>
                        <div className="col-md-10">
                          <div style={{fontSize: '22px', fontWeight: 'bold'}}>
                            Welcome, Admin!
                          </div>
                        </div>
                        <div className="col-md-1"></div>
                      </div>
                    <Switch>
                      <Route exact path="/" component={Homepage} />
                      <Route path="/Home" component={Homepage} />
                      <Route path="/RoomsAdmin" component={RoomsAdmin} />
                      <Route path="/RoomTypesAdmin" component={RoomTypesAdmin} />
                      <Route path="/BookingsAdmin" component={BookingsAdmin} />
                      <Route path="/BookingDetailsAdmin/:bookingId" component={BookingDetailsAdmin} />
                    </Switch>
                    <Footer></Footer>
                  </BrowserRouter>
                </div>
              </div>)
              : <div></div>
          }
        </div>
              
            
        )
    }
}