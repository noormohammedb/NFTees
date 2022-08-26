import './App.css';
import { Switch, Route, Redirect, Link } from "react-router-dom";
import Login from './login';
import LoginUser from './components/login/loginUser';
import LoginDesigner from './components/login/loginDesigner';
import CreateNFT from './components/Marketplace/Designer/createNFT';
import Home from './components/Marketplace/Users/user-home';
import UserDashboard from './components/Marketplace/Users/user-dashboard';
import ResellNFT from './components/Marketplace/Users/selluserNFT';
import userAssets from './components/Marketplace/Users/userNFT';

function App() {
  return (
    <div className="">
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/loginuser" component={LoginUser} />
        <Route exact path="/logindesigner" component={LoginDesigner} />
        <Route exact path="/createNFT" component={CreateNFT} />
        <Route exact path="/userdashboard" component={UserDashboard} />
        <Route exact path="/sellnfts" component={ResellNFT} />
        <Route exact path="/usernfts" component={userAssets} />
        <Route exact path="/home" component={Home} />
      </Switch>
    </div>
  );
}

export default App;
