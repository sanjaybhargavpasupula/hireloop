import { withRouter } from "react-router-dom"
import { Component } from "react"
import Cookies from "js-cookie"
import { Link } from "react-router-dom"
import "./login.css"

class Login extends Component {
  state = {
    email: "",
    password: "",
    showErrorMsg: "",
    isError: false,
    isLoading: false,
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set("jwt_token", jwtToken, { expires: 30 })
    const { history } = this.props
    history.replace("/dashboard")
  }

 getData = async event => {
  event.preventDefault()
  const { email, password } = this.state

  const url = "http://localhost:5000/api/auth/login"
  const userDetails = { email, password }
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userDetails),
  }

  const response = await fetch(url, options)
  const data = await response.json()

  console.log("response ok:", response.ok)
  console.log("data received:", data)
  console.log("token value:", data.jwtToken)
  console.log("history:", this.props.history)

 if (response.ok) {
  this.onSubmitSuccess(data.jwtToken)
} else {
  this.setState({
    isError: true,
    isLoading: false,
    isNewUser: data.isNewUser || false,
    showErrorMsg: data.isNewUser 
      ? "Looks like you are new here! Create an account to get started." 
      : "Invalid email or password",
  })
}
 }
  onChangeEmail = event => {
    this.setState({ email: event.target.value, isError: false })
  }

  onChangePassword = event => {
    this.setState({ password: event.target.value, isError: false })
  }

  render() {
    const { email, password, showErrorMsg, isError, isLoading } = this.state

    return (
      <div className="log-maincontainer">
        <div className="log-container">

          <div className="login-header">
            <h1 className="loginhead">HireLoop</h1>
          <p className="navbar-tagline">Learn And Grow Together</p>
          </div>

          <form onSubmit={this.getData}>
            <label htmlFor="email" className="loginemail">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              placeholder="you@example.com"
              onChange={this.onChangeEmail}
              className="loginput"
            />

            <label htmlFor="password" className="loginpass">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="••••••••"
              onChange={this.onChangePassword}
              className="loginput"
            />

            <button className="loginbutn" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {isError && <p className="error-msg">{showErrorMsg}</p>}

          <p className="register-link">
            New to HireLoop? <Link to="/register">Create an account</Link>
          </p>

        </div>
      </div>
    )
  }
 }

export default withRouter(Login)