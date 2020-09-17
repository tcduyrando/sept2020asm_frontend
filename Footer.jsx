import React from 'react'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'

/* Style footer */
var footer = {
  backgroundColor: 'goldenrod',
  paddingTop: '10px',
  paddingBottom: '15px',
  color: 'black',
  // position: 'fixed',
  left: '0',
  bottom: '0',
  width: '100%',
  marginTop: '75px',
  fontFamily: "Times New Roman, Times, serif"
}

export default class Footer extends React.Component {

  render(){
    return(
      <div>
        <div className="footer" style={footer}>
          <div className="row">
            {/* Indent */}
            <div className="col-md-1"></div>
            <div className="col-md-10">
              {/* Table containing hotel info */}
              <table className="contact-table" style={{width: "100%"}}>
                <tbody>
                  <tr>
                    {/* Phone number and address to Area 51 */}
                    <th style={{width: "92px"}}>Contact Us:</th>
                    <th style={{fontWeight: "normal"}}>1800 9999</th>
                    <th style={{float: "right", fontWeight: "normal"}}>
                      <b>Address: </b>5388 US-95, Amargosa Valley, NV 89020, United States
                    </th>
                  </tr>
                  <tr>
                    {/* Fake email and honest slogan */}
                    <td style={{width: "92px"}}></td>
                    <td>shitzcarlton.hotel@gmail.com</td>
                    <td style={{float: "right", fontSize: "20px", fontWeight: "bold"}}>
                      <i>Shitz-Carlton - Just give us your money</i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-1"></div>
          </div>
        </div>
      </div>
    )
  }
}