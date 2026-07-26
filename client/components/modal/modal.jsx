import "./modal.css"
import Cookies from "js-cookie"
import { Component } from "react"

class AddProblemModal extends Component {
  state = {
    problemName: "",
    platform: "LeetCode",
    topic: "",
    difficulty: "Easy",
    timeSpent: "",
    notes: "",
    isLoading: false,
    isError: false,
    errorMsg: "",
  }

  onSubmit = async event => {
    event.preventDefault()
    const { problemName, platform, difficulty, topic, timeSpent, notes } = this.state

    if (problemName.trim() === "" || topic.trim() === "") {
      this.setState({ isError: true, errorMsg: "Problem name and topic are required" })
      return
    }

    this.setState({ isLoading: true })
    const token = Cookies.get("jwt_token")

    const response = await fetch("hhttps://hireloop-server-production.up.railway.app/api/problems", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        problem_name: problemName,
        platform,
        difficulty,
        topic,
        time_spent_minutes: timeSpent,
        notes
      })
    })

    if (response.ok) {
      this.props.onClose()
      window.location.reload()
    } else {
      this.setState({
        isLoading: false,
        isError: true,
        errorMsg: "Something went wrong. Try again."
      })
    }
  }

  render() {
    const { onClose } = this.props
    const { problemName, platform, difficulty, topic, timeSpent, notes, isLoading, isError, errorMsg } = this.state

    return (
      <div className="modal-overlay">
        <div className="modal-card">

          <div className="modal-header">
            <h2>Log a Problem 🧠</h2>
            <button className="close-button" onClick={onClose}>✕</button>
          </div>

          <div className="modal-body">
            <form onSubmit={this.onSubmit}>

              <label className="modal-label">Problem Name</label>
              <input
                type="text"
                className="modal-input"
                placeholder="e.g. Two Sum"
                value={problemName}
                onChange={e => this.setState({ problemName: e.target.value, isError: false })}
              />

              <label className="modal-label">Platform</label>
              <select
                className="modal-input"
                value={platform}
                onChange={e => this.setState({ platform: e.target.value })}
              >
                <option>LeetCode</option>
                <option>HackerRank</option>
                <option>CodeChef</option>
                <option>Other</option>
              </select>

              <label className="modal-label">Difficulty</label>
              <select
                className="modal-input"
                value={difficulty}
                onChange={e => this.setState({ difficulty: e.target.value })}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>

              <label className="modal-label">Topic</label>
              <input
                type="text"
                className="modal-input"
                placeholder="e.g. Arrays, Trees, DP"
                value={topic}
                onChange={e => this.setState({ topic: e.target.value, isError: false })}
              />

              <label className="modal-label">Time Spent (minutes)</label>
              <input
                type="number"
                className="modal-input"
                placeholder="e.g. 30"
                value={timeSpent}
                onChange={e => this.setState({ timeSpent: e.target.value })}
              />

              <label className="modal-label">Notes (optional)</label>
              <textarea
                className="modal-input modal-textarea"
                placeholder="What approach did you use?"
                value={notes}
                onChange={e => this.setState({ notes: e.target.value })}
              />

              {isError && <p className="modal-error">{errorMsg}</p>}

              <div className="modal-buttons">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Problem 🚀"}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    )
  }
}

export default AddProblemModal