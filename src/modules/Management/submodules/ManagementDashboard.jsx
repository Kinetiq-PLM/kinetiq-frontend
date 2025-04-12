import React from 'react';
import "../styles/ManagementDashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="breadcrumbs">Management</div>
        <input type="text" placeholder="Search..." className="search-bar" />
        <div className="user-profile">ZodiacLover</div>
      </header>


      <div className="content-area">
        <h1 className="page-title">Dashboard</h1>


        <div className="stats-container">
          <div className="stat-card approved">
            <div className="stat-label">Approved</div>
            <div className="stat-value">16</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-label">Pending</div>
            <div className="stat-value">2</div>
          </div>
          <div className="stat-card overdue">
            <div className="stat-label">Overdue</div>
            <div className="stat-value">8</div>
          </div>
        </div>


        <div className="lower-content">
          <div className="requests-table">
            <h2 className="requests-title">
              <strong>Latest Pending Requests/Approvals</strong>
            </h2>
            <table className="requests-data">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Department</th>
                  <th>Decision Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array(6).fill().map((_, index) => (
                  <tr key={index}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <div className="calendar-container">
            <div className="calendar-header">
              <button className="calendar-nav">&larr;</button>
              <div className="calendar-month">March</div>
              <button className="calendar-nav">&rarr;</button>
            </div>
            <table className="calendar">
              <thead>
                <tr>
                  <th>Sun</th>
                  <th>Mon</th>
                  <th>Tue</th>
                  <th>Wed</th>
                  <th>Thu</th>
                  <th>Fri</th>
                  <th>Sat</th>
                </tr>
              </thead>
              <tbody>
                {/* Dummy calendar data */}
                <tr><td>25</td><td>26</td><td>27</td><td>28</td><td>1</td><td>2</td><td>3</td></tr>
                <tr><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td></tr>
                <tr><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td></tr>
                <tr><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td></tr>
                <tr><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td></tr>
                <tr><td>30</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


 export default Dashboard;