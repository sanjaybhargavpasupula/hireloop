import { Component } from "react"
import Cookies from "js-cookie"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"
import "./problems.css"

class Problems extends Component {
  state = {
    problems: [],
    isLoading: true,
    showModal: false,
    problemName: "",
    platform: "LeetCode",
    difficulty: "Easy",
    topic: "",
    timeSpent: "",
    notes: "",
    isError: false,
    errorMsg: "",
    filterDifficulty: "All",
    filterTopic: "",
  }

  componentDidMount() {
    this.getProblems()
  }

  getProblems = async () => {
    const token = Cookies.get("jwt_token")
    const response = await fetch("https://hireloop-server-production.up.railway.app/api/problems", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()
    this.setState({ problems: data, isLoading: false })
  }

  onSubmitProblem = async event => {
    event.preventDefault()
    const { problemName, platform, difficulty, topic, timeSpent, notes } = this.state

    if (problemName.trim() === "" || topic.trim() === "") {
      this.setState({ isError: true, errorMsg: "Problem name and topic are required" })
      return
    }

    const token = Cookies.get("jwt_token")
    const response = await fetch("https://hireloop-server-production.up.railway.app/api/problems", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        problem_name: problemName,
        platform,
        difficulty,
        topic,
        time_spent_minutes: timeSpent,
        notes,
      }),
    })

    if (response.ok) {
      this.setState({
        showModal: false,
        problemName: "",
        platform: "LeetCode",
        difficulty: "Easy",
        topic: "",
        timeSpent: "",
        notes: "",
        isError: false,
      })
      this.getProblems()
    } else {
      this.setState({ isError: true, errorMsg: "Something went wrong. Try again." })
    }
  }

  getFilteredProblems = () => {
    const { problems, filterDifficulty, filterTopic } = this.state
    return problems.filter(each => {
      const diffMatch = filterDifficulty === "All" || each.difficulty === filterDifficulty
      const topicMatch = filterTopic === "" || each.topic.toLowerCase().includes(filterTopic.toLowerCase())
      return diffMatch && topicMatch
    })
  }

  getDifficultyColor = difficulty => {
    if (difficulty === "Easy") return "easy"
    if (difficulty === "Medium") return "medium"
    return "hard"
  }

  render() {
    const {
      isLoading, showModal, problemName, platform,
      difficulty, topic, timeSpent, notes,
      isError, errorMsg, filterDifficulty, filterTopic
    } = this.state

    const filteredProblems = this.getFilteredProblems()

    return (
      <div className="page-wrapper">
        <Navbar history={this.props.history} />

        <div className="page-content">

          <div className="problems-header">
            <div>
              <h1 className="problems-title">Problems Solved</h1>
              <p className="problems-subtitle">Track every problem you solve</p>
            </div>
            <button
              className="add-btn"
              onClick={() => this.setState({ showModal: true })}
            >
              + Log Problem
            </button>
          </div>

          <div className="filter-bar">
            <div className="filter-group">
              <label className="filter-label">Difficulty</label>
              <select
                className="filter-select"
                value={filterDifficulty}
                onChange={e => this.setState({ filterDifficulty: e.target.value })}
              >
                <option value="All">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Topic</label>
              <input
                type="text"
                className="filter-input"
                placeholder="Search topic..."
                value={filterTopic}
                onChange={e => this.setState({ filterTopic: e.target.value })}
              />
            </div>
            <p className="problems-count">
              {filteredProblems.length} problem{filteredProblems.length !== 1 ? "s" : ""}
            </p>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <p className="loading-text">Loading problems...</p>
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="empty-state">
              <p className="empty-emoji">🧩</p>
              <h3>No problems found</h3>
              <p>Start logging your DSA practice!</p>
              <button
                className="add-btn"
                onClick={() => this.setState({ showModal: true })}
              >
                + Log First Problem
              </button>
            </div>
          ) : (
            <div className="problems-table-wrapper">
              <table className="problems-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Problem Name</th>
                    <th>Platform</th>
                    <th>Topic</th>
                    <th>Difficulty</th>
                    <th>Time Spent</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.map((each, index) => (
                    <tr key={each.id}>
                      <td>{index + 1}</td>
                      <td className="problem-name">{each.problem_name}</td>
                      <td>{each.platform}</td>
                      <td><span className="topic-badge">{each.topic}</span></td>
                      <td>
                        <span className={`difficulty-badge ${this.getDifficultyColor(each.difficulty)}`}>
                          {each.difficulty}
                        </span>
                      </td>
                      <td>{each.time_spent_minutes ? `${each.time_spent_minutes} min` : "-"}</td>
                      <td>{each.solved_at ? each.solved_at.slice(0, 10) : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h2>Log a Problem 🧠</h2>
                <button
                  className="close-button"
                  onClick={() => this.setState({ showModal: false })}
                >✕</button>
              </div>
              <form onSubmit={this.onSubmitProblem}>
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
                    onClick={() => this.setState({ showModal: false })}
                  >Cancel</button>
                  <button type="submit" className="modal-submit-btn">
                    Save Problem 🚀
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Footer />
      </div>
    )
  }
}

export default Problems