import './PersonalProfile.css';
import React, { Component } from 'react';
import Box from '@mui/material/Box';
import Traverse from './helpers/traverse';

// TODO: User logins with uiuds
// this one is just hard-coded for testing and building
//let relAddr = window.location.href.split(":")[1];
let userId = "65f4877528ff1d43a838f10b";
// API port 3001 is proxied on remote Nginx server
// to port 4000 in /etc/nginx/sites-enabled/incisic
let api = "http://localhost:4000/api/user/";

class PersonalProfile extends Component {
  constructor() {
    super();
    this.state = {
      Name: [],
      Picture: [],
      Age: [],
      Relationships: [],
      Spouse: [],
      Dependents: [],
      Children: [],
      Employer: [],
    };
  }

  componentDidMount() {
    fetch(api + userId).then(result => {
      console.log(api + userId);
      return result.json();
    }).then(data => {
      const traverse = new Traverse();
      let user = () => {
        return (
          <span>{data.firstname} {data.lastname}</span>
        )
      }

      let picture = () => {
        var url = "/assets/" + data.picture;
        return (
          <img src={url} className="profile-pic" alt="User profile pic" />
        )
      }

      this.setState({
        Name: user(),
        Picture: picture(),
        Age: data.age,
        Relationships: data.relationships,
        Spouse: data.spousename,
        Dependents: data.dependents,
        Children: traverse.run(data.children),
        Employer: data.employer
      })
    }).catch((error) => {
      // Handle the error
      console.log(error);
    })
  }

  record(key, val) {
    //console.log(key + " --> " + val)
    return (
      <div key={key} className="detail">
        <div className="label col1">
          <b>{key}</b>
        </div>
        <div className="data col2">
          <span>{val}</span>
        </div>
      </div>
    )
  }


  render() {
    var records = [];
    var len = Object.keys(this.state).length;
    // loop through records
    for (var i = 2; i <= len - 2; i++) {
      var keys = Object.keys(this.state);
      var vals = Object.values(this.state);
      // push to array of records
      records.push(this.record(keys[i], vals[i]));
    }
    //console.log(records);
    return (
      <Box sx={{
        flexGrow: 1,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        component: 'div'
      }} id="Profile">
        <div className="profile-pic">
          {this.state.Picture}
        </div>
        <div className="heading h3">
          {this.state.Name}
        </div>
        <div className="records">
          {records}
        </div>
      </Box>
    )
  }
}

export default PersonalProfile;
