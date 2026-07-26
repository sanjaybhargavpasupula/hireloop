import { Component } from "react"
import Cookies from "js-cookie"
import { Link } from "react-router-dom"
import { withRouter } from "react-router-dom"
import "./register.css"

class Register extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    showErrorMsg: "",
    isError: false,
    isLoading: false,
  }

  onSubmitSuccess = token => {
    Cookies.set("jwt_token", token, { expires: 30 })
    const { history } = this.props
    history.replace("/dashboard")
  }

  getData = async event => {
    event.preventDefault()
    const { name, email, password, confirmPassword } = this.state

    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      this.setState({
        isError: true,
        showErrorMsg: "All fields are required",
      })
      return
    }

    if (password !== confirmPassword) {
      this.setState({
        isError: true,
        showErrorMsg: "Passwords do not match",
      })
      return
    }

    if (password.length < 6) {
      this.setState({
        isError: true,
        showErrorMsg: "Password must be at least 6 characters",
      })
      return
    }

    this.setState({ isLoading: true })

    const url = "http://localhost:5000/api/auth/register"
    const userDetails = { name, email, password }
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      this.onSubmitSuccess(data.token)
    } else {
      this.setState({
        isError: true,
        isLoading: false,
        showErrorMsg: data.error || "Registration failed. Try again.",
      })
    }
  }

  onChangeName = event => {
    this.setState({ name: event.target.value, isError: false })
  }

  onChangeEmail = event => {
    this.setState({ email: event.target.value, isError: false })
  }

  onChangePassword = event => {
    this.setState({ password: event.target.value, isError: false })
  }

  onChangeConfirmPassword = event => {
    this.setState({ confirmPassword: event.target.value, isError: false })
  }

  render() {
    const { name, email, password, confirmPassword, showErrorMsg, isError, isLoading } = this.state

    return (
      <div className="reg-maincontainer">
        <div className="reg-container">

          <div className="reg-header">
            <h1 className="reghead">Join HireLoop</h1>
            <p className="regpara">Start tracking your placement journey today</p>
          </div>

          <div className="reg-badge">
            🎯 Already used by 500+ placement students
          </div>

          <form onSubmit={this.getData}>
            <label htmlFor="name" className="reglabel">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              placeholder="FirstName LastName"
              onChange={this.onChangeName}
              className="reginput"
              autoComplete="name"
            />

            <label htmlFor="email" className="reglabel">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              placeholder="you@example.com"
              onChange={this.onChangeEmail}
              className="reginput"
              autoComplete="email"
            />

            <label htmlFor="password" className="reglabel">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Min. 6 characters"
              onChange={this.onChangePassword}
              className="reginput"
              autoComplete="new-password"
            />

            <label htmlFor="confirmPassword" className="reglabel">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              placeholder="Re-enter your password"
              onChange={this.onChangeConfirmPassword}
              className="reginput"
              autoComplete="new-password"
            />

            <button
              className="regbutn"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account 🚀"}
            </button>
          </form>

          {isError && <p className="error-msg">{showErrorMsg}</p>}

          <div className="reg-divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="login-link-btn">
            Sign In Instead
          </Link>

        </div>
      </div>
    )
  }
}

export default withRouter(Register)