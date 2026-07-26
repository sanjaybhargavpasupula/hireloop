import { Component } from "react"
import Cookies from "js-cookie"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"
import "./applications.css"

class Applications extends Component {
  state = {
    applications: [],
    isLoading: true,
    showModal: false,
    companyName: "",
    role: "",
    status: "Applied",
    appliedDate: "",
    notes: "",
    isError: false,
    errorMsg: "",
    filterStatus: "All",
  }

  componentDidMount() {
    this.getApplications()
  }

  getApplications = async () => {
    const token = Cookies.get("jwt_token")
    const response = await fetch("http://localhost:5000/api/applications", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()
    this.setState({ applications: data, isLoading: false })
  }

  onSubmitApplication = async event => {
    event.preventDefault()
    const { companyName, role, status, appliedDate, notes } = this.state

    if (companyName.trim() === "") {
      this.setState({ isError: true, errorMsg: "Company name is required" })
      return
    }

    const token = Cookies.get("jwt_token")
    const response = await fetch("http://localhost:5000/api/applications", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_name: companyName,
        role,
        status,
        applied_date: appliedDate,
        notes,
      }),
    })

    if (response.ok) {
      this.setState({
        showModal: false,
        companyName: "",
        role: "",
        status: "Applied",
        appliedDate: "",
        notes: "",
        isError: false,
      })
      this.getApplications()
    } else {
      this.setState({ isError: true, errorMsg: "Something went wrong. Try again." })
    }
  }

  onUpdateStatus = async (id, newStatus) => {
    const token = Cookies.get("jwt_token")
    await fetch(`http://localhost:5000/api/applications/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
    this.getApplications()
  }

  onDelete = async id => {
    const token = Cookies.get("jwt_token")
    await fetch(`http://localhost:5000/api/applications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    this.getApplications()
  }

  getFilteredApplications = () => {
    const { applications, filterStatus } = this.state
    if (filterStatus === "All") return applications
    return applications.filter(each => each.status === filterStatus)
  }

  getStatusClass = status => {
    const map = {
      Applied: "status-applied",
      OA: "status-oa",
      Interview: "status-interview",
      Offer: "status-offer",
      Rejected: "status-rejected",
    }
    return map[status] || ""
  }

  render() {
    const {
      isLoading, showModal, companyName, role,
      status, appliedDate, notes,
      isError, errorMsg, filterStatus
    } = this.state

    const filteredApplications = this.getFilteredApplications()

    return (
      <div className="page-wrapper">
        <Navbar history={this.props.history} />

        <div className="page-content">

          <div className="applications-header">
            <div>
              <h1 className="applications-title">Applications Tracker</h1>
              <p className="applications-subtitle">Track every company you apply to</p>
            </div>
            <button
              className="add-btn"
              onClick={() => this.setState({ showModal: true })}
            >
              + Add Application
            </button>
          </div>

          <div className="status-filter-bar">
            {["All", "Applied", "OA", "Interview", "Offer", "Rejected"].map(s => (
              <button
                key={s}
                className={`status-filter-btn ${filterStatus === s ? "active" : ""}`}
                onClick={() => this.setState({ filterStatus: s })}
              >
                {s}
              </button>
            ))}
            <p className="apps-count">
              {filteredApplications.length} application{filteredApplications.length !== 1 ? "s" : ""}
            </p>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <p className="loading-text">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="empty-state">
              <p className="empty-emoji">📋</p>
              <h3>No applications found</h3>
              <p>Start tracking your placement applications!</p>
              <button
                className="add-btn"
                onClick={() => this.setState({ showModal: true })}
              >
                + Add First Application
              </button>
            </div>
          ) : (
            <div className="applications-grid">
              {filteredApplications.map(each => (
                <div key={each.id} className="application-card">
                  <div className="card-top">
                    <div>
                      <h3 className="company-name">{each.company_name}</h3>
                      <p className="role-name">{each.role || "Role not specified"}</p>
                    </div>
                    <span className={`status-badge ${this.getStatusClass(each.status)}`}>
                      {each.status}
                    </span>
                  </div>

                  <div className="card-meta">
                    <p className="meta-text">
                      📅 {each.applied_date ? each.applied_date.slice(0, 10) : "Date not set"}
                    </p>
                    {each.notes && (
                      <p className="meta-notes">📝 {each.notes}</p>
                    )}
                  </div>

                  <div className="card-actions">
                    <select
                      className="status-select"
                      value={each.status}
                      onChange={e => this.onUpdateStatus(each.id, e.target.value)}
                    >
                      <option>Applied</option>
                      <option>OA</option>
                      <option>Interview</option>
                      <option>Offer</option>
                      <option>Rejected</option>
                    </select>
                    <button
                      className="delete-btn"
                      onClick={() => this.onDelete(each.id)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h2>Add Application 📋</h2>
                <button
                  className="close-button"
                  onClick={() => this.setState({ showModal: false })}
                >✕</button>
              </div>

              <form onSubmit={this.onSubmitApplication}>
                <label className="modal-label">Company Name</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="e.g. Google"
                  value={companyName}
                  onChange={e => this.setState({ companyName: e.target.value, isError: false })}
                />

                <label className="modal-label">Role</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="e.g. SDE Intern"
                  value={role}
                  onChange={e => this.setState({ role: e.target.value })}
                />

                <label className="modal-label">Status</label>
                <select
                  className="modal-input"
                  value={status}
                  onChange={e => this.setState({ status: e.target.value })}
                >
                  <option>Applied</option>
                  <option>OA</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>

                <label className="modal-label">Applied Date</label>
                <input
                  type="date"
                  className="modal-input"
                  value={appliedDate}
                  onChange={e => this.setState({ appliedDate: e.target.value })}
                />

                <label className="modal-label">Notes (optional)</label>
                <textarea
                  className="modal-input modal-textarea"
                  placeholder="Any notes about this application..."
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
                    Save Application 🚀
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

export default Applications