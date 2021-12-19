import React, { Component, Fragment } from "react";
import axios from "axios";
import image from "./FindYourFitLogo.png"

class Matches extends Component {

  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      current: 0
    }
  }

  componentDidMount() {
    axios.get("http://localhost:5000/app/matches/"+localStorage.getItem("email"))
    .then((response) => {
        let matchList = response.data;
        var profileList = [];
        for (let i = 0; i < matchList.length; i++) {
            let matchEmail = ""
            if (matchList[i].person1 === localStorage.getItem("email")) {
                matchEmail = matchList[i].person2;
            }
            else {
                matchEmail = matchList[i].person1;
            }
            axios.get("http://localhost:5000/app/user/email/"+matchEmail)
            .then((response) => {
                profileList.push(response.data[0])
                this.setState({
                    matches: profileList
                });
            })
        }
    })
  }

  goRight = event => {
      if (this.state.current == this.state.matches.length - 1) {
          this.setState({
              current: 0
          })
      }
      else {
          this.setState({
              current: this.state.current + 1
          })
      }
  }

  goLeft = event => {
      if (this.state.current == 0) {
          this.setState({
              current: this.state.matches.length - 1
          })
      }
      else {
          this.setState({
              current: this.state.current - 1
          })
      }
  }

  render() {
    if (this.state.matches.length == 0) {
        return (
            <div>
                <br/>
                <div className = "profileCard">
                    <h2>You have no matches</h2>
                    <img src = {image}></img>
                </div>
            </div>
        );
    }
    let match = this.state.matches[this.state.current];
    return (
      <div>
          <br/>
          <div className = "profileCard">
          <h2>{match.personName}</h2>
            <img src = {match.img} className="rounded-circle" width="150" height = "150"/>
            <p>{match.goal}</p>
            <p>{match.experience} years of experience</p>
            <p>email for contact: {match.email}</p>
            <div className = "buttons">
                <button onClick = {this.goLeft}>left</button>
                <button onClick = {this.goRight}>right</button>
            </div>
        </div>
      </div>
    );
  }
}
export default Matches;