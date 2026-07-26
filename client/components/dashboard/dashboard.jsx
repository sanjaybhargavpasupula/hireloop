import { Component } from "react";
import Cookies from "js-cookie";
import Navbar from "../navbar/navbar";
import TopicChart from "../charts/charts";
import Footer from "../footer/footer";
import AddProblemModal from "../modal/modal";
import "./dashboard.css";

class Dashboard extends Component {
  state = {
    stats: [],
    applications: [],
    problems: [],
    isLoading: true,
    showAddProblemModal: false,
  };

  componentDidMount() {
    this.getDashboard();

  }
  getDashboard = async () => {
    const token = Cookies.get("jwt_token");
    const statsUrl = "https://hireloop-server-production.up.railway.app/api/problems/stats";
    const applicationsUrl = "https://hireloop-server-production.up.railway.app/api/applications";
    const problemsUrl = "https://hireloop-server-production.up.railway.app0/api/problems";
    const statsResponse = await fetch(statsUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const applicationsResponse = await fetch(applicationsUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const problemsResponse = await fetch(problemsUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const statsData = await statsResponse.json();
    const applicationsData = await applicationsResponse.json();
    const problemsData = await problemsResponse.json();
    const newStatsData = statsData.map((each) => ({
      topic: each.topic,
      difficulty: each.difficulty,
      count: each.count,
    }));
    const newApplicationsData = applicationsData.map((each) => ({
      id: each.id,
      companyName: each.company_name,
      status: each.status,
    }));
    const newProblemsData = problemsData.map((each) => ({
      id: each.id,
      problemName: each.problem_name,
      difficulty: each.difficulty,
    }));

    this.setState({
      stats: newStatsData,
      applications: newApplicationsData,
      problems: newProblemsData,
      isLoading: false,
    });
  };
  getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}/${month}/${day}`;
    return formattedDate;
  };
  getApplicationSummary = () => {
    const { applications } = this.state;

    const summary = {
      Applied: 0,
      OA: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };
    applications.forEach((each) => {
      if (each.status === "Applied") {
        summary.Applied++;
      } else if (each.status === "OA") {
        summary.OA++;
      } else if (each.status === "Interview") {
        summary.Interview++;
      } else if (each.status == "Offer") {
        summary.Offer++;
      } else if (each.status === "Rejected") {
        summary.Rejected++;
      }
    });
    return summary;
  };
  openAddProblemModal = () => {
    this.setState({
      showAddProblemModal: true,
    });
  };

  closeAddProblemModal = () => {
    this.setState({
      showAddProblemModal: false,
    });
  };
  render() {
    const { stats, problems, applications, isLoading, showAddProblemModal } =
      this.state;

    if (isLoading) {
      return <h1>Loading...</h1>;
    }

    const todaysDate = this.getCurrentDate();

    const totalProblems = problems.length;
    const totalApplications = applications.length;
    const applicationSummary = this.getApplicationSummary();
    return (
      <div className="page-wrapper">
        <Navbar history={this.props.history} />

        <div className="page-content">
          <section className="welcome-banner">
            <h1>Hey Sanjay 👋</h1>
            <p>Let's get placed today 🎯</p>
            <p>{todaysDate}</p>
          </section>

          <section className="stats-section">
            <h2>Stats</h2>

            <div className="stats-container">
              <div className="stat-card">
                <h3>Total Problems Solved</h3>
                <p>{totalProblems}</p>
              </div>

              <div className="stat-card">
                <h3>This Week</h3>
                <p>0</p>
              </div>

              <div className="stat-card">
                <h3>Total Applications</h3>
                <p>{totalApplications}</p>
              </div>

              <div className="stat-card">
                <h3>Current Streak</h3>
                <p>0</p>
              </div>
            </div>
          </section>

          <section>
            <TopicChart stats={stats} />
          </section>

          <section className="application-summary-section">
  <h2>Application Summary</h2>
  <div className="application-summary-container">
              <div className="summary-card">
                <h3>Applied</h3>
                <p>{applicationSummary.Applied}</p>
              </div>

              <div className="summary-card">
                <h3>OA</h3>
                <p>{applicationSummary.OA}</p>
              </div>

              <div className="summary-card">
                <h3>Interview</h3>
                <p>{applicationSummary.Interview}</p>
              </div>

              <div className="summary-card">
                <h3>Offer</h3>
                <p>{applicationSummary.Offer}</p>
              </div>

              <div className="summary-card">
                <h3>Rejected</h3>
                <p>{applicationSummary.Rejected}</p>
              </div>
            </div>
          </section>
          <section>
  <button className="add-problem-btn" onClick={this.openAddProblemModal}>
    + Log a Problem
  </button>
</section>

          {showAddProblemModal && (
            <AddProblemModal onClose={this.closeAddProblemModal} />
          )}
        </div>

        <Footer />
      </div>
    );
  }
}

export default Dashboard;
