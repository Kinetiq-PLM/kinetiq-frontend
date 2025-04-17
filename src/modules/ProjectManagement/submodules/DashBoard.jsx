import React, { useState } from 'react';
import "../styles/DashBoard.css"; // Assuming you have this CSS file

const BodyContent = () => {
  const [data, setData] = useState([
    { Overdue: '10days', Task: 'Get out Of Biome 1', Deadline: '00/00/0000', Employee: 'S.vassos' },
    { Overdue: '21days', Task: 'none', Deadline: '00/00/0000', Employee: 'none' },
    { Overdue: '12days', Task: 'none', Deadline: '00/00/0000', Employee: 'none' },
    { Overdue: '5days', Task: 'Another Task', Deadline: '01/01/2024', Employee: 'User 1' },
    { Overdue: '30days', Task: 'Yet Another Task', Deadline: '02/02/2024', Employee: 'User 2' },
    { OverOverdue: '1day', Task: 'Quick Task', Deadline: '03/03/2024', Employee: 'User 3' },
    { Overdue: '15days', Task: 'Long Task', Deadline: '04/04/2024', Employee: 'User 4' },
    { Overdue: '2days', Task: 'Short Task', Deadline: '05/05/2024', Employee: 'User 5' },
    { Overdue: '', Task: '', Deadline: '', Employee: '' },
    { Overdue: '', Task: '', Deadline: '', Employee: '' },
    { Overdue: '', Task: '', Deadline: '', Employee: '' },
    { Overdue: '', Task: '', Deadline: '', Employee: '' },
    { Overdue: '', Task: '', Deadline: '', Employee: '' },
    { Overdue: '', Task: '', Deadline: '', Employee: '' },
    { Overdue: '', Task: '', Deadline: '', Employee: '' },
  ]);

  const [data2, setData2] = useState([
    { ProjectTrackingID: '0000', ProjectID: '0000', ProjectMilestone: 'None', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectWarrantyStatus: 'None', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', ProjectMilestone: 'None', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectWarrantyStatus: 'None', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', ProjectMilestone: 'None', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectWarrantyStatus: 'None', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', ProjectMilestone: 'None', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectWarrantyStatus: 'None', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', ProjectMilestone: 'None', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectWarrantyStatus: 'None', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', ProjectMilestone: 'None', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectWarrantyStatus: 'None', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', ProjectMilestone: 'None', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectWarrantyStatus: 'None', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', ProjectMilestone: 'None', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectWarrantyStatus: 'None', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', ProjectMilestone: 'None', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectWarrantyStatus: 'None', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', ProjectMilestone: 'None', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectWarrantyStatus: 'None', ProjectIssue: '' },
  ]);

  const [data3, setData3] = useState([
    { ProjectTrackingID: '0000', ProjectID: '0000', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectIssue: '' },
    { ProjectTrackingID: '0000', ProjectID: '0000', StartDate: '00/00/0000', EstimatedEndDate: '00/00/0000', ProjectIssue: '' },
  ]);

  const [selectedNav3, setSelectedNav3] = useState('All3');
  const [selectedNav2, setSelectedNav2] = useState('Internal Project');

  const handleNavClick = (navItem) => {
    setSelectedNav2(navItem);
  };

  const handleNavClick2 = (navItem) => {
    setSelectedNav3(navItem);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8", "Item 9", "Item 10"];
  const maxPage = Math.ceil(items.length / itemsPerPage);

  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, maxPage)));
  };

  const pageNumbers = [];
  for (let i = 1; i <= maxPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="body-content-container">
      <h1 className="overview"><b>Overview</b></h1>
      <h2 className="overdue1"><b>Overdue Task</b></h2>
      <h2 className="tft"><b>Tasks for Today</b></h2>
      <h2 className="projsum"><b>Project Tracking</b></h2>
      <div className="rectangle"></div>
      <div className="rectangle2"></div>
      <div className="rectangle3"></div>
      <button className="add"><b>New task</b></button>

      <div className="scroll">
        <table className="tb">
          <thead>
            <tr>
              <th><b>Overdue</b></th>
              <th><b>Task</b></th>
              <th><b>Deadline</b></th>
              <th><b>Employee</b></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="due"><b>{item.Overdue}</b></td>
                <td>{item.Task}</td>
                <td>{item.Deadline}</td>
                <td>{item.Employee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <div className="top-nav2">
          <button
            className={`nav-button ${selectedNav2 === "Internal Project" ? "selected2" : ""}`}
            onClick={() => handleNavClick("Internal Project")}
          >
            <b>Internal Project</b>
          </button>
          <button
            className={`nav-button ${selectedNav2 === "External Project" ? "selected2" : ""}`}
            onClick={() => handleNavClick("External Project")}
          >
            <b>External Project</b>
          </button>
        </div>

        <div className="dashtable4">
          {selectedNav2 === "Internal Project" && (
            <table className="dashtable5">
              <thead>
                <tr>
                  <th><b>Project Tracking ID</b></th>
                  <th><b>Project ID</b></th>
                  <th><b>Start Date</b></th>
                  <th><b>Est. End Date</b></th>
                  <th><b>Project Issue</b></th>
                </tr>
              </thead>
              <tbody>
                {data3.map((item, index) => (
                  <tr key={index}>
                    <td>{item.ProjectTrackingID}</td>
                    <td><b>{item.ProjectID}</b></td>
                    <td>{item.StartDate}</td>
                    <td>{item.EstimatedEndDate}</td>
                    <td>{item.ProjectIssue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="dashtable">
          {selectedNav2 === "External Project" && (
            <table className="dashtable3">
              <thead>
                <tr>
                  <th><b>Project Tracking ID</b></th>
                  <th><b>Project ID</b></th>
                  <th><b>Project Milestone</b></th>
                  <th><b>Start Date</b></th>
                  <th><b>Est. End Date</b></th>
                  <th><b>Project Warranty Status</b></th>
                  <th><b>Project Issue</b></th>
                </tr>
              </thead>
              <tbody>
                {data2.map((item, index) => (
                  <tr key={index}>
                    <td>{item.ProjectTrackingID}</td>
                    <td><b>{item.ProjectID}</b></td>
                    <td>{item.ProjectMilestone}</td>
                    <td>{item.StartDate}</td>
                    <td>{item.EstimatedEndDate}</td>
                    <td>{item.ProjectWarrantyStatus}</td>
                    <td>{item.ProjectIssue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="scroll2">
          <table className="tb2">
            <thead>
              <tr>
                <th
                  className={`nav-button2 ${selectedNav3 === 'All3' ? 'selected3' : ''}`}
                  onClick={() => handleNavClick2('All3')}
                >
                  <b>All</b>
                  {selectedNav3 === 'All3' && (
                    <div className="tasklist">
                      <form>
                        <input type="checkbox" id="docu1" name="docu1" value="documents1" />
                        <label htmlFor="docu1">Get Prescription Pads for Vicodin</label>
                        <br />
                        <input type="checkbox" id="docu2" name="docu2" value="documents2" />
                        <label htmlFor="docu2">Create a user flow of non-creational drugs</label>
                        <br />
                        <input type="checkbox" id="docu3" name="docu3" value="documents3" />
                        <label htmlFor="docu3">Buy Methylamine in Guadalajara</label>
                        <br />
                        <input type="checkbox" id="docu4" name="docu4" value="documents4" />
                        <label htmlFor="docu4">Start a coup</label>
                        <br />
                        <input type="checkbox" id="docu5" name="docu5" value="documents5" />
                        <label htmlFor="docu5">Prototype Meth Empire Blueprint</label>
                        <br />
                      </form>
                    </div>
                  )}
                </th>
                <th
                  className={`nav-button2 ${selectedNav3 === 'Important' ? 'selected3' : ''}`}
                  onClick={() => handleNavClick2('Important')}
                >
                  <b>Important</b>
                  {selectedNav3 === 'Important' && (
                    <div className="tasklist2">
                      <form>
                        <input type="checkbox" id="docu6" name="docu6" value="documents6" />
                        <label htmlFor="docu6">None</label>
                        <br />
                        <input type="checkbox" id="docu7" name="docu7" value="documents7" />
                        <label htmlFor="docu7">None</label>
                        <br />
                        <input type="checkbox" id="docu8" name="docu8" value="documents8" />
                        <label htmlFor="docu8">None</label>
                        <br />
                        <input type="checkbox" id="docu9" name="docu9" value="documents9" />
                        <label htmlFor="docu9">None</label>
                        <br />
                      </form>
                    </div>
                  )}
                </th>
                <th
                  className={`nav-button2 ${selectedNav3 === 'Notes' ? 'selected3' : ''}`}
                  onClick={() => handleNavClick2('Notes')}
                >
                  <b>Notes</b>
                  {selectedNav3 === 'Notes' && (
                    <div className="tasklist3">
                      <form>
                        <input type="checkbox" id="docu10" name="docu10" value="documents10" />
                        <label htmlFor="docu10">Notes</label>
                        <br />
                        <input type="checkbox" id="docu11" name="docu11" value="documents11" />
                        <label htmlFor="docu11">Notes</label>
                        <br />
                        <input type="checkbox" id="docu12" name="docu12" value="documents12" />
                        <label htmlFor="docu12">Notes</label>
                        <br />
                        <input type="checkbox" id="docu13" name="docu13" value="documents13" />
                        <label htmlFor="docu13">Notes</label>
                        <br />
                      </form>
                    </div>
                  )}
                </th>
                <th
                  className={`nav-button2 ${selectedNav3 === 'Links' ? 'selected3' : ''}`}
                  onClick={() => handleNavClick2('Links')}
                >
                  <b>Links</b>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="top-nav-container">
          <div id="line3"></div>
        </div>
      </div>
      <div>
        <ul>
          {currentItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={currentPage === number ? 'active' : ''}
            >
              {number}
            </button>
          ))}

          <button onClick={handleNextPage} disabled={currentPage === maxPage}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BodyContent;