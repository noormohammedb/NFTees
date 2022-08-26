import logo from './logo.svg';
import './App.css';
import { Switch, Route, Redirect, Link } from "react-router-dom";
import Login from './login';
import LoginUser from './components/login/loginUser';
import LoginDesigner from './components/login/loginDesigner';
import createNFT from './components/createNFT';
import Dashboard from './components/dashboard';
function App() {
  return (
    <div className="">
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/loginuser" component={LoginUser} />
        <Route exact path="/logindesigner" component={LoginDesigner} />
        <Route exact path="/createNFT" component={createNFT} />
        <Route exact path="/dashboard" component={Dashboard} />
      </Switch>
    </div>
  );
}

export default App;
