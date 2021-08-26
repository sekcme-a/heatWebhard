import "./App.css";
import Main  from "./components/Main";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { authService } from "./fbase";
import Login from "./components/Login";
import Navi from "./components/Navi"

function App() {
  const [inactive, setInactive] = useState(false);
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null)
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      }
      else
        setIsLoggedIn(false)
      setInit(true)
    })
    console.log(isLoggedIn)
  }, [])

  return (
    <>
      {init ?
        <Router>
          <Switch>
            {isLoggedIn ?
                <Route exact path="/">
                  <Main
                    onCollapse={(inactive) => {
                      setInactive(inactive);
                    }}
                    id="0APXkbg7dMEvpUk9PVA"
                    loc="root/"
                    night="false"
                  />
                </Route>
              :
              <Route exact path="/">
                <Login />
              </Route>
            }
            <Route exact path="/navi">
              <Navi />
            </Route>
          </Switch>
        </Router>
        :<></>}
    </>
  );
}

export default App;

