import React, { Component } from "react";
import "./Login.css";
import axios from 'axios';
import { Redirect, Link } from "react-router-dom";
import image from "./FindYourFitLogo.png"

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      islogged: false,
      loginParams: {
        user_id: "",
        user_password: ""
      }
    };
  }
  handleFormChange = event => {
    let loginParamsNew = { ...this.state.loginParams };
    let val = event.target.value;
    loginParamsNew[event.target.name] = val;
    this.setState({
      loginParams: loginParamsNew
    });
  };
 
  login = event => {
    let user_id = this.state.loginParams.user_id;
    let user_password = this.state.loginParams.user_password;
    axios.post("http://localhost:5000/app/login", {
      email: user_id,
      pass: user_password
    })
    .then((response) => {
      if (response.data.status === 1){
        localStorage.setItem("token", "T");
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("email", response.data.email);
        this.setState({
          islogged: true
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });

    event.preventDefault();
  };
  render() {
    if (localStorage.getItem("token")) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <img src = {image} className = "center"></img><br/>
        <form onSubmit={this.login} className="form-signin">
          <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
          <div className="row">
            <div className="col">
              <input
                type="text"
                name="user_id"
                onChange={this.handleFormChange}
                placeholder="Enter Username"
              />
              <input
                type="password"
                name="user_password"
                onChange={this.handleFormChange}
                placeholder="Enter Password"
              />
              <input type="submit" value="Login" />
              <Link to="/register" >
              <button>
                Register Here if You Don't Have an Account!
              </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
export default Login;