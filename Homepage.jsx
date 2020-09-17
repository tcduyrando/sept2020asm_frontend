import React from 'react'

import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'

// Make stuff stay in the center
var colCentered = {
  float: 'none',
  margin: '25px auto'
}

export default class Homepage extends React.Component {

  render() {

    return (
      <div>
        <div className="row">
          <h1 style={colCentered}>HOTELS & RESORTS</h1>
        </div>
        <div className="row">
          {/* Indent */}
          <div className="col-md-1"></div> 
          <div className="col-md-10"> 
            <br/>
            {/* Cool picture of swimming pool */}
            <img src="Ritz-Carlton.jpg" style={{width:"100%"}} alt="pool-picture"></img>
            <br/>
          </div>
          {/* Indent */}
          <div className="col-md-1"></div> 
        </div>
        <br/>
        <div className="row">
          <br/>
          <h4 style={{margin: "auto", fontFamily: "Times New Roman, Times, serif", fontStyle: "italic"}}>
            "Why stay at some cheap motel when you can pay $500 for a room you only use for one night?" - Marriott Carlton, Founder of The Shitz-Carlton
          </h4>
        </div>
          
      </div>
        )
    }
}