import './App.css';
import { Switch, Route, Redirect, Link } from "react-router-dom";
import Login from './login';
import LoginUser from './components/login/loginUser';
import LoginDesigner from './components/login/loginDesigner';
import CreateNFT from './components/Marketplace/Designer/createNFT';
import Home from './components/Marketplace/Users/user-home';
import UserDashboard from './components/Marketplace/Users/user-dashboard';
import UserNfts from './components/Marketplace/Users/userNFT';
import SelluserNFT from './components/Marketplace/Users/selluserNFT';

function App() {
  return (
    <div className="">
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/loginuser" component={LoginUser} />
        <Route exact path="/logindesigner" component={LoginDesigner} />
        <Route exact path="/createnfts" component={CreateNFT} />
        <Route exact path="/userdashboard" component={UserDashboard} />
        <Route exact path="/usernfts" component={UserNfts} />
        <Route  path="/sellnfts/:id" component={SelluserNFT} />
        <Route exact path="/home" component={Home} />
      </Switch>
    </div>
  );
}

export default App;
