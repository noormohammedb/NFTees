import React, { Component } from "react";
import { Switch, Route, Redirect, Link } from "react-router-dom";

// Styling
import "./App.css";
import Home from "./components//Marketplace/Users/user-home";
import UserDashboard from "./components/Marketplace/Users/user-dashboard";
import MyAssets from "./components/Marketplace/Users/userNFT";
import ResellNFT from "./components/Marketplace/Users/selluserNFT";

class App extends Component {
	render() {
		return (
			<div className="">
				<Switch>
					<Route exact path="/home" component={Home} />
					{/* <Route path="/creator/:id" component={creatorprofile} /> */}
					<Route path="/dashboard" component={UserDashboard} />
					<Route path="/usernfts" component={MyAssets} />
          <Route path="/sellusernfts" component={ResellNFT} />
				</Switch>
			</div>
		);
	}
}
export default App;