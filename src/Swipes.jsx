import React, { Component, Fragment } from "react";
import axios from "axios"
import image from "./FindYourFitLogo.png"

class Swipes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      swipes: [],
      current: 0
    }
  }

  componentDidMount() {
    axios.get("http://localhost:5000/app/ppl/"+localStorage.getItem("id"))
    .then((response) => {
      this.setState({
        swipes: response.data
      });
    })
  }

  swipeLeft = event => {
    axios.post("http://localhost:5000/app/left/", {
      swiper: localStorage.getItem("email"),
      target: this.state.swipes[this.state.current].email
    }).then((response) => {
      this.setState({
        current: this.state.current + 1
      });
    });
  }

  swipeRight = event => {
    axios.post("http://localhost:5000/app/right/", {
      swiper: localStorage.getItem("email"),
      target: this.state.swipes[this.state.current].email
    }).then((response) => {
      if (response.data.foundMatch) {
        alert("You've got a match with: " + this.state.swipes[this.state.current].email);
      }
      this.setState({
        current: this.state.current + 1
      })
    });
  }

  render() {
    if (this.state.current >= this.state.swipes.length) {
      return (
        <div>
          <br/>
          <div className = "profileCard">
              <h2>You're out of swipes!</h2>
              <p>Consider purchasing premium for another round!</p>
              <img src = {image}></img>
          </div>
        </div>
      );
    }
    else {
      let current = this.state.swipes[this.state.current];
      let distance = current.distance * 100;
      distance = Math.trunc(distance);
      distance = distance / 100
      return (
        <div>
          <br/>
          <div className = "profileCard">
              <h2>{current.personName}</h2>
              <p>{current.gender}</p>
              <img src = {current.img} className="rounded-circle" width="150" height = "150"/>
              <br/>
              <br/>
              <p>{current.goal}</p>
              <p>{current.experience} years of experience</p>
              <p>{distance} km from you</p>
              <div className = "buttons">
                  <button onClick = {this.swipeLeft}>No</button>
                  <button onClick = {this.swipeRight}>Yes</button>
              </div>
          </div>
        </div>
      );
    }
  }
}
export default Swipes;