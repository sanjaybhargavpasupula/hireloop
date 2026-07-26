import { Component } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./charts.css";

class TopicChart extends Component {
 render() {
  const { stats } = this.props

  if (stats.length === 0) {
    return (
      <div className="chart-section">
        <h2>Topic Breakdown</h2>
        <p className="no-data">No problems logged yet. Start solving! 🚀</p>
      </div>
    )
  }

  return (
    <div className="chart-section">
      <h2>Topic Breakdown</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={stats}
            margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="topic" tick={{ fontSize: 12, fill: "#6b7280" }} />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #e9d5ff",
                borderRadius: "8px",
                fontSize: "13px",
                fontFamily: "Poppins"
              }}
            />
            <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
}

export default TopicChart;
