import React from 'react';
import "../styles/ManagementDashboard.css";
function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Dashboard</h1>
      <div className="dashboard-widgets">
        <div className="dashboard-widget">
          <h3>Pending Approvals</h3>
          <div className="value">16</div>
        </div>
        <div className="dashboard-widget">
          <h3>Salary</h3>
          <div className="value">02</div>
          <div className="details">
            <div>Policies <br /> 03</div>
            <div>Projects <br /> 02</div>
            <div>Staffing <br /> 06</div>
          </div>
        </div>
        <div className="dashboard-calendar">
          <h3>March</h3>
          <div className="calendar-header">
            <button>&larr;</button>
            <button>&rarr;</button>
          </div>
          <table>
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
              {/* Calendar Days - Replace with actual data if needed */}
              <tr><td>25</td><td>26</td><td>27</td><td>28</td><td>1</td><td>2</td><td>3</td></tr>
              <tr><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td></tr>
              <tr><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td></tr>
              <tr><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td></tr>
              <tr><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="dashboard-requests">
        <h3>Latest Pending Requests/Approvals</h3>
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Request Name</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {/* Request Data - Replace with actual data if needed */}
            <tr><td>123</td><td>Leave Request</td><td>HR</td></tr>
            <tr><td>456</td><td>Purchase Order</td><td>Finance</td></tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default Dashboard;
