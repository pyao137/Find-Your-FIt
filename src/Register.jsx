import React, { Component } from "react";
import "./Login.css";
import { Redirect } from "react-router-dom";
import axios from "axios";
import {Link} from "react-router-dom";
import image from "./FindYourFitLogo.png";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRegistered: false,
      registerParams: {
        user_first: "",
        user_last: "",
        user_id: "",
        user_password: "",
        user_img: "",
        user_address: "",
        user_city: "",
        user_state: "",
        user_goal: "",
        user_experience: "",
        user_gender: "",
        user_lat: 0.0,
        user_long: 0.0
      }
    };
  }
  
  handleFormChange = event => {
    let registerParamsNew = { ...this.state.registerParams };
    let val = event.target.value;
    registerParamsNew[event.target.name] = val;
    this.setState({
      registerParams: registerParamsNew
    });
  };

  register = event => {
    let user_first = this.state.registerParams.user_first;
    let user_last = this.state.registerParams.user_last;
    let user_id = this.state.registerParams.user_id;
    let user_password = this.state.registerParams.user_password;
    let user_img = this.state.registerParams.user_img;
    let user_address = this.state.registerParams.user_address;
    let user_city = this.state.registerParams.user_password;
    let user_state = this.state.registerParams.user_state;
    let user_goal = this.state.registerParams.user_goal;
    let user_experience = this.state.registerParams.user_experience;
    let user_gender = this.state.registerParams.user_gender;

    if (user_id.length !== 0 && user_password.length !== 0 && user_address.length !== 0 && user_city.length !== 0 && user_state.length !== 0) {
      const API_KEY = "AIzaSyCXoX_K7Jrg1jARURwvGIGlz06cRUOqxxA";
      let newAddress = "";
      let splitAddress = user_address.split(" ");
      for (let i = 0; i < splitAddress.length; i++) {
        if (i === splitAddress.length - 1) {
          newAddress += splitAddress[i] + ",+"
        } else {
          newAddress += splitAddress[i] + "+";
        }
      }
      let splitCity = user_city.split(" ");
      for (let i = 0; i < splitCity.length; i++) {
        if (i === splitCity.length - 1) {
          newAddress += splitCity[i] + ",+"
        } else {
          newAddress += splitCity[i] + "+";
        }
      }
      newAddress += user_state;
      axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: newAddress,
          key: API_KEY
        }
      })
      .then((response) => {
        let registerParamsNew = { ...this.state.registerParams };
        var user_lat = response.data.results[0].geometry.location.lat;
        var user_lng = response.data.results[0].geometry.location.lng;
        axios.post("http://localhost:5000/app/register", {
          email: user_id,
          pass: user_password,
          personName: user_first + " " + user_last,
          img: user_img,
          latitude: user_lat,
          longitude: user_lng,
          goal: user_goal,
          experience: user_experience,
          gender: user_gender
      })
      .then((response) => {
        this.setState({
            isRegistered: true
        });
      })
      .catch(function (error) {
        console.log(error);
      });
      })
      .catch((error) => {
        console.log(error);
      });

      let user_lat = this.state.registerParams.user_lat;
      let user_long = this.state.registerParams.user_long;

      
    }
    event.preventDefault();
  };
  
  render() {
    if (this.state.isRegistered) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <img src = {image} className = "center"></img><br/>
        <form onSubmit={this.register} className="form-register">
          <h1 className="h3 mb-3 font-weight-normal">Please Register</h1>
          <div className="row">
            <div className="col">
              <input
                type="text"
                name="user_first"
                onChange={this.handleFormChange}
                placeholder="Enter First Name"
              />
              <input
                type="text"
                name="user_last"
                onChange={this.handleFormChange}
                placeholder="Enter Last Name"
              />
              <input
                type="text"
                name="user_id"
                onChange={this.handleFormChange}
                placeholder="Enter Email"
              />
              <input
                type="text"
                name="user_img"
                onChange={this.handleFormChange}
                placeholder="Enter Link of Your Image"
              />
              <input
                type="password"
                name="user_password"
                onChange={this.handleFormChange}
                placeholder="Enter Password"
              />
              <input
                type="text"
                name="user_address"
                onChange={this.handleFormChange}
                placeholder="Enter Your Address"
              />
              <input
                type="text"
                name="user_city"
                onChange={this.handleFormChange}
                placeholder="Enter Your City"
              />
              <input
                type="text"
                name="user_state"
                onChange={this.handleFormChange}
                placeholder="Enter Your State"
              />
              <input
                type="text"
                name="user_goal"
                onChange={this.handleFormChange}
                placeholder="What Are Your Fitness Goals"
              />
              <input
                type="number"
                name="user_experience"
                onChange={this.handleFormChange}
                min="0"
                placeholder="Enter # of Years of Experience"
              />
              <input type="submit" value="Register" />
            </div>
          </div>
        </form><br/>
        <Link to="/login" >
          <button className = "center">
            Back to Login
          </button>
        </Link>
      </div>
    );
  }
}
export default Register;
