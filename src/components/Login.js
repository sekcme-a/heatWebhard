import React, { useState } from "react";
import { authService, firebaseInstance } from "../fbase";
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [newAccount, setNewAccount] = useState(false)
  const [error, setError] = useState("");
  const onChange = (event) => {
    if(event.target.name === "email"){
      setEmail(event.target.value)
    }
    else if(event.target.name === "password"){
      setPassword(event.target.value)
    }
  }
  const onSubmit = async(event) => {
    event.preventDefault();
    try {
      let data;
      //제출눌렸을때 기본값으로 사이트가 하는 행동 없애기.
      if (newAccount) {
        data = await authService.createUserWithEmailAndPassword(
          email, password
        )
      } else {
        data = await authService.signInWithEmailAndPassword(
          email, password
        )
      }
      console.log(data);
    } catch (error) {
      setError(error.message)
    }
    
  }

  const toggleAccount = () => {
    setNewAccount((prev)=>!prev)
  }

  const onSocialClick = async (event) => {
    const name = event.target.name;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    }
    const data = await authService.signInWithPopup(provider)
  }

  return(
    <div className="App">
      <section>
        <div class="color"></div>
        <div class="color"></div>
        <div class="color"></div>
        <div class="color"></div>
        <div class="box">
          <div class="square" ></div>
          <div class="square" ></div>
          <div class="square" ></div>
          <div class="square" ></div>
          <div class="square" ></div>
          <div class="container">
            <div class="form">
              <h2>Login</h2>
              <form onSubmit={onSubmit}>
                <div class="inputBox">
                  <input type="text" placeholder="Username"></input>
                </div>
                <div class="inputBox">
                  <input type="password" placeholder="Password"></input>
                </div>
                <div class="inputBox">
                  <input type="submit" value="Login"></input>
                  <button onClick={onSocialClick} name = "google">Login with Google</button>
                </div>
                <p class="forget">Forgot Password?</p>
                <p class="forget">Don't have an account?</p>
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* {console.log("in")}
      <form onSubmit={onSubmit}>
        <input 
          name = "email"
          type = "text"
          placeholder = "Email"
          required
          value = {email}
          onChange={onChange}
        />
        <input 
          name = "password"
          type = "password"
          placeholder = "Password"
          required
          value = {password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Log In"}/>
        {error}
      </form>
      <span onClick={toggleAccount}>{newAccount ? "Log In" : "Create Account"}</span>
      <div>
        <button onClick={onSocialClick} name = "google">Continue with Google</button>
      </div> */}
    </div>
  )
}

export default Login;