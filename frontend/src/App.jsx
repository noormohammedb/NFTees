import './App.css';
import { Switch, Route, Redirect, Link } from "react-router-dom";
import Login from './login';
import LoginUser from './components/login/loginUser';
import LoginDesigner from './components/login/loginDesigner';
import CreateNFT from './components/Marketplace/Designer/createNFT';
function App() {
  return (
    <div className="">
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/loginuser" component={LoginUser} />
        <Route exact path="/logindesigner" component={LoginDesigner} />
        <Route exact path="/createNFT" component={CreateNFT} />
      </Switch>
    </div>
  );
}

export default App;
