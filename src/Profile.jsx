import React, { Component, Fragment } from "react";
import axios from "axios";

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      myself: {}
    }
  }

  componentDidMount() {
    axios.get("http://localhost:5000/app/user/"+localStorage.getItem("id"))
    .then((response) => {
      this.setState({
        myself: response.data[0]
      });
    })
  }

  render() {
    let current = this.state.myself;
    return (
      <div>
        <br/>
        <div className = "profileCard">
            <h2>{current.personName}</h2>
            <p>{current.gender}</p>
            <img src = {current.img} className="rounded-circle" width="150" height = "150"/>
            <br/>
            <br/>
            <p>E-mail: {current.email}</p>
            <p>Goal: {current.goal}</p>
            <p>Experience: {current.experience} years</p>
        </div>
      </div>
    );
  }
}
export default Profile;
