import React, { Component } from "react";
import { Redirect, Switch, Route, Link } from "react-router-dom";
import { withRouter } from "react-router";
import "./Dashboard.css";
import Profile from "./Profile";
import Matches from "./Matches"
import Swipes from "./Swipes";
import NotFound from "./Notfound";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      islogout: false

    };
  }

  signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    this.setState({
      islogout: true
    });
  };

  render() {
    if (this.state.islogout) {
      return <Redirect to="/login" />;
    }
    const { match } = this.props;
    
    return (
      <div>
        <ul>
          <li>
            <Link to={`${match.path}`}>Swipes</Link>
          </li>
          <li>
            <Link to={`${match.path}/profile`}>Profile</Link>
          </li>
          <li>
            <Link to={`${match.path}/matches`}>Matches</Link>
          </li>
          <li className="push-right">
            <button onClick={this.signOut} href="#">
              Sign Out
            </button>
          </li>
        </ul>
        <main role="main">
          <div className="main">
            <Switch>
              <Route path={`${match.path}/profile`}>
                <Profile />
              </Route>
              <Route path={`${match.path}/matches`}>
                <Matches />
              </Route>
              <Route exact path={`${match.path}`}>
                <Swipes />
              </Route>
              <Route path="*">
                <NotFound />
              </Route>
            </Switch>
          </div>
        </main>
      </div>
    );
  }
}

export default withRouter(Dashboard);
