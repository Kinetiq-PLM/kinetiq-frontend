import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import "../styles/GenerateReports.css";
import logoUrl from "/public/icons/Kinetiq-Logo.png"; 

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios Error:', error);
    return Promise.reject(error);
  }
);

const GenerateReports = () => {
  const [reportData, setReportData] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exportType, setExportType] = useState("selected");
  const [templateType, setTemplateType] = useState("standard");
  const [projectData, setProjectData] = useState({
    externalProjects: [],
    internalProjects: []
  });
  const [filterOptions, setFilterOptions] = useState({
    projectId: "",
    internalProjectId: "",
    reportType: "",
    dateFrom: "",
    dateTo: "",
  });
  const [reportTypes, setReportTypes] = useState([]);
  const [logoImage, setLogoImage] = useState(null);
  const logoRef = useRef(null);

  useEffect(() => {
    fetchData();
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const response = await fetch(logoUrl);
      const arrayBuffer = await response.arrayBuffer();
      setLogoImage(arrayBuffer);
    } catch (err) {
      console.error('Error loading logo:', err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch reports
      const reportsResponse = await axios.get('/api/reports/');
      setReportData(Array.isArray(reportsResponse.data) ? 
        reportsResponse.data : reportsResponse.data.results || []);
      
      // Fetch report types
      try {
        const typesResponse = await axios.get('/api/reports/report_types/');
        // Ensure reportTypes is always an array
        const typesData = typesResponse.data || [];
        setReportTypes(Array.isArray(typesData) ? typesData : [
          'Sales Order',
          'Resource Availability',
          'Bill of Material',
          'Information',
          'Progress Report',
          'Project Details',
          'Inventory Movement',
        ]);
      } catch (err) {
        console.error('Error fetching report types:', err);
        setReportTypes([
          'Sales Order',
          'Resource Availability',
          'Bill of Material',
          'Information',
          'Progress Report',
          'Project Details',
          'Inventory Movement',
        ]);
      }
      
      // Fetch external projects
      try {
        const externalProjectsResponse = await axios.get('/api/external-projects/');
        // Ensure externalProjects is always an array
        const externalProjects = externalProjectsResponse.data || [];
        setProjectData(prev => ({
          ...prev,
          externalProjects: Array.isArray(externalProjects) ? externalProjects : 
            (externalProjects.results || [])
        }));
      } catch (err) {
        console.error('Error fetching external projects:', err);
        setProjectData(prev => ({
          ...prev,
          externalProjects: []
        }));
      }
      
      // Fetch internal projects
      try {
        const internalProjectsResponse = await axios.get('/api/internal-projects/');
        // Ensure internalProjects is always an array
        const internalProjects = internalProjectsResponse.data || [];
        setProjectData(prev => ({
          ...prev,
          internalProjects: Array.isArray(internalProjects) ? internalProjects : 
            (internalProjects.results || [])
        }));
      } catch (err) {
        console.error('Error fetching internal projects:', err);
        setProjectData(prev => ({
          ...prev,
          internalProjects: []
        }));
      }
      
      setLoading(false);
    } catch (err) {
      console.error('API Error:', err);
      setError('Error fetching data: ' + (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };

  const handleCheckboxChange = (index) => {
    if (selectedReports.includes(index)) {
      setSelectedReports(selectedReports.filter((i) => i !== index));
    } else {
      setSelectedReports([...selectedReports, index]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIndexes = filteredReports.map((_, index) => index);
      setSelectedReports(allIndexes);
    } else {
      setSelectedReports([]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilterOptions({
      projectId: "",
      internalProjectId: "",
      reportType: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  // Filter reports based on selected filter options
  const filteredReports = reportData.filter(report => {
    // Filter by project ID
    if (filterOptions.projectId && report.project_id !== filterOptions.projectId) {
      return false;
    }
    
    // Filter by internal project ID
    if (filterOptions.internalProjectId && report.intrnl_project_id !== filterOptions.internalProjectId) {
      return false;
    }
    
    // Filter by report type
    if (filterOptions.reportType && report.report_type !== filterOptions.reportType) {
      return false;
    }
    
    // Filter by date range
    if (filterOptions.dateFrom && filterOptions.dateTo) {
      const reportDate = new Date(report.date_created);
      const fromDate = new Date(filterOptions.dateFrom);
      const toDate = new Date(filterOptions.dateTo);
      toDate.setHours(23, 59, 59); // Include the entire day
      
      if (reportDate < fromDate || reportDate > toDate) {
        return false;
      }
    } else if (filterOptions.dateFrom) {
      const reportDate = new Date(report.date_created);
      const fromDate = new Date(filterOptions.dateFrom);
      
      if (reportDate < fromDate) {
        return false;
      }
    } else if (filterOptions.dateTo) {
      const reportDate = new Date(report.date_created);
      const toDate = new Date(filterOptions.dateTo);
      toDate.setHours(23, 59, 59); // Include the entire day
      
      if (reportDate > toDate) {
        return false;
      }
    }
    
    return true;
  });

  const generateStandardPDF = async (reportsToExport) => {
    try {
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      
      // Add first page
      const page = pdfDoc.addPage([800, 1100]);
      const { width, height } = page.getSize();
      
      // Add logo if available
      if (logoImage) {
        try {
          const logo = await pdfDoc.embedPng(logoImage);
          const logoDims = logo.scale(0.5); // Scale down the logo
          page.drawImage(logo, {
            x: 50,
            y: height - 100,
            width: logoDims.width,
            height: logoDims.height,
          });
        } catch (err) {
          console.error('Error embedding logo:', err);
        }
      }
      
      // Add company name and address
      page.drawText('Kinetiq', {
        x: 50,
        y: height - 50,
        size: 24,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      page.drawText('1975 Address Of Company', {
        x: 50,
        y: height - 80,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      page.drawText('Street, Metro Manila', {
        x: 50,
        y: height - 100,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      page.drawText('Philippines', {
        x: 50,
        y: height - 120,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      // Add report title
      page.drawText('REPORT MONITORING LIST', {
        x: 50,
        y: height - 170,
        size: 16,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      // Add generation date
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      page.drawText(`Generated on: ${currentDate}`, {
        x: 50,
        y: height - 200,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      // Add table headers
      const columnHeaders = ['Project ID', 'Internal Project ID', 'Report Type', 'Report Title', 'Date Created', 'Assigned To'];
      const columnWidths = [100, 100, 120, 180, 100, 100];
      const startX = 50;
      let currentY = height - 250;
      
      // Draw column headers
      let xPosition = startX;
      for (let i = 0; i < columnHeaders.length; i++) {
        page.drawText(columnHeaders[i], {
          x: xPosition,
          y: currentY,
          size: 12,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        xPosition += columnWidths[i];
      }
      
      // Draw horizontal line under headers
      page.drawLine({
        start: { x: startX, y: currentY - 10 },
        end: { x: startX + columnWidths.reduce((sum, width) => sum + width, 0), y: currentY - 10 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
      
      currentY -= 30;
      
      // Add report data
      for (const report of reportsToExport) {
        // Check if we need a new page
        if (currentY < 50) {
          const newPage = pdfDoc.addPage([800, 1100]);
          currentY = height - 50;
          
          // Add continued header
          newPage.drawText('REPORT MONITORING LIST (Continued)', {
            x: 50,
            y: height - 50,
            size: 16,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
          });
          
          // Add column headers again
          currentY = height - 100;
          xPosition = startX;
          for (let i = 0; i < columnHeaders.length; i++) {
            newPage.drawText(columnHeaders[i], {
              x: xPosition,
              y: currentY,
              size: 12,
              font: timesRomanBoldFont,
              color: rgb(0, 0, 0),
            });
            xPosition += columnWidths[i];
          }
          
          // Draw horizontal line under headers
          newPage.drawLine({
            start: { x: startX, y: currentY - 10 },
            end: { x: startX + columnWidths.reduce((sum, width) => sum + width, 0), y: currentY - 10 },
            thickness: 1,
            color: rgb(0, 0, 0),
          });
          
          currentY -= 30;
        }
        
        // Get the current page
        const activePage = pdfDoc.getPage(pdfDoc.getPageCount() - 1);
        
        const values = [
          report.project_id || '-',
          report.intrnl_project_id || '-',
          report.report_type || '-',
          report.report_title || '-',
          report.date_created || '-',
          report.assigned_to || '-'
        ];
        
        xPosition = startX;
        for (let i = 0; i < values.length; i++) {
          // Truncate long text
          let displayText = values[i].toString();
          if (displayText.length > 20 && i === 3) { // Report title
            displayText = displayText.substring(0, 20) + '...';
          }
          
          activePage.drawText(displayText, {
            x: xPosition,
            y: currentY,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          xPosition += columnWidths[i];
        }
        
        currentY -= 20;
      }
      
      // Add footer
      const footerPage = pdfDoc.getPage(pdfDoc.getPageCount() - 1);
      footerPage.drawText('For Internal Use Only', {
        x: 50,
        y: 30,
        size: 10,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      footerPage.drawText(`Page ${pdfDoc.getPageCount()} of ${pdfDoc.getPageCount()}`, {
        x: width - 150,
        y: 30,
        size: 10,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `Report_Monitoring_List_${new Date().toISOString().split('T')[0]}.pdf`);
      
      return true;
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Error generating PDF: ' + err.message);
      return false;
    }
  };

  const generateProjectDetailsPDF = async (reportsToExport) => {
    try {
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      
      // Group reports by project
      const uniqueProjects = [...new Set(reportsToExport.map(report => 
        report.project_id || report.intrnl_project_id
      ))];
      
      for (const projectId of uniqueProjects) {
        // Get reports for this project
        const projectReports = reportsToExport.filter(report => 
          report.project_id === projectId || report.intrnl_project_id === projectId
        );
        
        if (projectReports.length === 0) continue;
        
        // Add page for this project
        const page = pdfDoc.addPage([800, 1100]);
        const { width, height } = page.getSize();
        
        // Add logo if available
        if (logoImage) {
          try {
            const logo = await pdfDoc.embedPng(logoImage);
            const logoDims = logo.scale(0.5); // Scale down the logo
            page.drawImage(logo, {
              x: 50,
              y: height - 100,
              width: logoDims.width,
              height: logoDims.height,
            });
          } catch (err) {
            console.error('Error embedding logo:', err);
          }
        }
        
        // Add company name and address
        page.drawText('Kinetiq', {
          x: 50,
          y: height - 50,
          size: 24,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        
        page.drawText('1975 Address Of Company', {
          x: 50,
          y: height - 80,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        page.drawText('Street, Metro Manila', {
          x: 50,
          y: height - 100,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        page.drawText('Philippines', {
          x: 50,
          y: height - 120,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        // Determine if this is an external or internal project
        const isExternal = projectReports[0].project_id === projectId;
        const projectType = isExternal ? "External" : "Internal";
        
        page.drawText('PROJECT DETAILS', {
          x: 50,
          y: height - 170,
          size: 16,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        
        page.drawText(`Project ID: ${projectId}`, {
          x: 50,
          y: height - 200,
          size: 14,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        
        page.drawText(`Project Type: ${projectType}`, {
          x: 50,
          y: height - 220,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        page.drawText(`Generated on: ${new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`, {
          x: 50,
          y: height - 240,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        // Add associated reports section
        page.drawText('Associated Reports:', {
          x: 50,
          y: height - 280,
          size: 14,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        
        // Add table headers
        const columnHeaders = ['Report Type', 'Report Title', 'Date Created', 'Assigned To', 'Description'];
        const columnWidths = [120, 180, 100, 100, 200];
        const startX = 50;
        let currentY = height - 310;
        
        // Draw column headers
        let xPosition = startX;
        for (let i = 0; i < columnHeaders.length; i++) {
          page.drawText(columnHeaders[i], {
            x: xPosition,
            y: currentY,
            size: 12,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
          });
          xPosition += columnWidths[i];
        }
        
        // Draw horizontal line under headers
        page.drawLine({
          start: { x: startX, y: currentY - 10 },
          end: { x: startX + columnWidths.reduce((sum, width) => sum + width, 0), y: currentY - 10 },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
        
        currentY -= 30;
        
        // Add report data
        for (const report of projectReports) {
          // Check if we need a new page
          if (currentY < 50) {
            const newPage = pdfDoc.addPage([800, 1100]);
            currentY = height - 50;
            
            // Add continued header
            newPage.drawText(`PROJECT DETAILS: ${projectId} (Continued)`, {
              x: 50,
              y: height - 50,
              size: 16,
              font: timesRomanBoldFont,
              color: rgb(0, 0, 0),
            });
            
            // Add column headers again
            currentY = height - 100;
            xPosition = startX;
            for (let i = 0; i < columnHeaders.length; i++) {
              newPage.drawText(columnHeaders[i], {
                x: xPosition,
                y: currentY,
                size: 12,
                font: timesRomanBoldFont,
                color: rgb(0, 0, 0),
              });
              xPosition += columnWidths[i];
            }
            
            // Draw horizontal line under headers
            newPage.drawLine({
              start: { x: startX, y: currentY - 10 },
              end: { x: startX + columnWidths.reduce((sum, width) => sum + width, 0), y: currentY - 10 },
              thickness: 1,
              color: rgb(0, 0, 0),
            });
            
            currentY -= 30;
          }
          
          // Get the current page
          const activePage = pdfDoc.getPage(pdfDoc.getPageCount() - 1);
          
          const values = [
            report.report_type || '-',
            report.report_title || '-',
            report.date_created || '-',
            report.assigned_to || '-',
            report.description || '-'
          ];
          
          xPosition = startX;
          for (let i = 0; i < values.length; i++) {
            // Truncate long text
            let displayText = values[i].toString();
            if (displayText.length > 20 && (i === 1 || i === 4)) { // Title or description
              displayText = displayText.substring(0, 20) + '...';
            }
            
            activePage.drawText(displayText, {
              x: xPosition,
              y: currentY,
              size: 10,
              font: timesRomanFont,
              color: rgb(0, 0, 0),
            });
            xPosition += columnWidths[i];
          }
          
          currentY -= 20;
        }
        
        // Add footer
        const footerPage = pdfDoc.getPage(pdfDoc.getPageCount() - 1);
        footerPage.drawText('For Internal Use Only', {
          x: 50,
          y: 30,
          size: 10,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        footerPage.drawText(`Page ${pdfDoc.getPageCount()} of ${pdfDoc.getPageCount()}`, {
          x: width - 150,
          y: 30,
          size: 10,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
      }
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `Project_Reports_${new Date().toISOString().split('T')[0]}.pdf`);
      
      return true;
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Error generating PDF: ' + err.message);
      return false;
    }
  };

  // Generate a project form PDF with multiple pages
  const generateProjectFormPDF = async (reportsToExport) => {
    try {
      // Get unique projects
      const uniqueProjects = [...new Set(reportsToExport.map(report => 
        report.project_id || report.intrnl_project_id
      ))];
      
      if (uniqueProjects.length === 0) {
        setError("No projects found in the selected reports");
        return false;
      }
      
      // Create a PDF for each project
      for (const projectId of uniqueProjects) {
        const isExternal = reportsToExport.find(r => r.project_id === projectId) !== undefined;
        
        const pdfDoc = await PDFDocument.create();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
        
        // Fetch project details if needed
        let projectDetails = {};
        try {
          const params = isExternal 
            ? { project_id: projectId } 
            : { internal_project_id: projectId };
          
          const response = await axios.get('/api/reports/project_details/', { params });
          projectDetails = response.data;
        } catch (err) {
          console.error('Error fetching project details:', err);
        }
        
        // Create first page
        const page1 = pdfDoc.addPage([800, 1100]);
        const { width, height } = page1.getSize();
        
        // Add logo if available
        if (logoImage) {
          try {
            const logo = await pdfDoc.embedPng(logoImage);
            const logoDims = logo.scale(0.5); // Scale down the logo
            page1.drawImage(logo, {
              x: 50,
              y: height - 100,
              width: logoDims.width,
              height: logoDims.height,
            });
          } catch (err) {
            console.error('Error embedding logo:', err);
          }
        }
        
        // Add company name and address
        page1.drawText('Kinetiq', {
          x: 50,
          y: height - 50,
          size: 24,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        
        page1.drawText('1975 Address Of Company', {
          x: 50,
          y: height - 80,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        page1.drawText('Street, Metro Manila', {
          x: 50,
          y: height - 100,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        page1.drawText('Philippines', {
          x: 50,
          y: height - 120,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        // Add project name
        const projectName = isExternal 
          ? (projectDetails.project?.client_name || 'Project Name') 
          : 'Internal Project';
        
        page1.drawText('Project Name', {
          x: 50,
          y: height - 170,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        page1.drawText(projectName, {
          x: 150,
          y: height - 170,
          size: 12,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        
        // Add project details heading
        page1.drawText('PROJECT DETAILS', {
          x: 50,
          y: height - 220,
          size: 16,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        
        if (isExternal) {
          // Add warranty information
          page1.drawText('Warranty Period Start', {
            x: 50,
            y: height - 250,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          page1.drawText('Warranty Period End', {
            x: 400,
            y: height - 250,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
        }
        
        // Add request text
        const requestText = `Please review the following information regarding Pending Approval Project Request Number
${projectId}. We are expecting responses from the subsequent modules involved in the Planning
Process Phase as soon as possible.`;
        
        page1.drawText(requestText, {
          x: 50,
          y: height - 320,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        // Add attachment info
        page1.drawText('[ Provided attachment: Reports List ]', {
          x: 50,
          y: height - 380,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        if (isExternal) {
          page1.drawText('Page [2-3] for the Equipments List Availability section.', {
            x: 50,
            y: height - 410,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          page1.drawText('Page [4-5] for the Workers Allocation List section.', {
            x: 50,
            y: height - 430,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
        } else {
          page1.drawText('Page [2] for Workers Allocation List section', {
            x: 50,
            y: height - 410,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
        }
        
        // Add deadline text
        page1.drawText('The deadline for completion is three days upon receiving.', {
          x: 50,
          y: height - 460,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        page1.drawText('Thank you for your cooperation.', {
          x: 50,
          y: height - 490,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        // Add date
        page1.drawText('Date', {
          x: 50,
          y: height - 540,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        page1.drawText(new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }), {
          x: 150,
          y: height - 540,
          size: 12,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        
        // Add recipient
        page1.drawText('Send To', {
          x: 50,
          y: height - 570,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        // Collect unique departments
        const departments = [...new Set(reportsToExport
          .filter(r => r.project_id === projectId || r.intrnl_project_id === projectId)
          .map(r => r.assigned_to)
          .filter(Boolean))];
        
        page1.drawText(departments.join(', ') || 'Materials Resource Planning', {
          x: 150,
          y: height - 570,
          size: 12,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        
        if (isExternal) {
          // Add project scale
          page1.drawText('Project Scale', {
            x: 50,
            y: height - 600,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          page1.drawText('Low', {
            x: 150,
            y: height - 600,
            size: 12,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
          });
        }
        
        // Add contact information
        page1.drawText('Zane Mark Banzon', {
          x: 50,
          y: height - 660,
          size: 12,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        
        page1.drawText('Project Management Representative', {
          x: 50,
          y: height - 680,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        page1.drawText('09202337352', {
          x: 50,
          y: height - 700,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        page1.drawText('buyerkinetiq@gmail.com', {
          x: 50,
          y: height - 720,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        // Add project request number
        page1.drawText('Project Request#', {
          x: 50,
          y: height - 780,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        page1.drawText(projectId, {
          x: 150,
          y: height - 780,
          size: 12,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        
        // Add page number
        page1.drawText('Page 1 of ' + (isExternal ? '5' : '2'), {
          x: width - 150,
          y: 30,
          size: 10,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        // Add footer
        page1.drawText('For Internal Use Only', {
          x: 50,
          y: 50,
          size: 10,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        page1.drawText('This document is the property of [Company Name] and is intended for internal use only. Unauthorized sharing, copying, or distribution is strictly prohibited.', {
          x: 50,
          y: 30,
          size: 8,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        if (isExternal) {
          // Add equipment page for external projects
          const page2 = pdfDoc.addPage([800, 1100]);
          
          // Add header
          page2.drawText('Kinetiq', {
            x: 50,
            y: height - 50,
            size: 24,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
          });
          
          page2.drawText('1975 Address Of Company', {
            x: 50,
            y: height - 80,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          page2.drawText('Street, Metro Manila', {
            x: 50,
            y: height - 100,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          page2.drawText('Philippines', {
            x: 50,
            y: height - 120,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          // Add equipment table
          const equipmentHeaders = ['Equipment', 'Description', 'QTY', 'Availability'];
          const equipmentWidths = [150, 350, 50, 150];
          let startX = 50;
          let currentY = height - 200;
          
          // Add project details heading
          page2.drawText('PROJECT DETAILS', {
            x: 50,
            y: height - 170,
            size: 16,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
          });
          
          // Add table headers
          let xPosition = startX;
          for (let i = 0; i < equipmentHeaders.length; i++) {
            page2.drawText(equipmentHeaders[i], {
              x: xPosition,
              y: currentY,
              size: 12,
              font: timesRomanBoldFont,
              color: rgb(0, 0, 0),
            });
            xPosition += equipmentWidths[i];
          }
          
          // Add horizontal line
          page2.drawLine({
            start: { x: startX, y: currentY - 10 },
            end: { x: startX + equipmentWidths.reduce((sum, width) => sum + width, 0), y: currentY - 10 },
            thickness: 1,
            color: rgb(0, 0, 0),
          });
          
          currentY -= 30;
          
          // Add equipment data
          const equipment = projectDetails.equipment || [];
          let equipmentPage = page2;
          let equipmentCount = 0;
          
          for (const item of equipment) {
            // Check if we need a new page
            if (currentY < 100 || equipmentCount >= 11) { // Start a new page after 11 items
              const page3 = pdfDoc.addPage([800, 1100]);
              equipmentPage = page3;
              currentY = height - 100;
              equipmentCount = 0;
              
              // Add continued header
              page3.drawText('PROJECT DETAILS', {
                x: 50,
                y: height - 50,
                size: 16,
                font: timesRomanBoldFont,
                color: rgb(0, 0, 0),
              });
              
              // Add column headers again
              xPosition = startX;
              for (let i = 0; i < equipmentHeaders.length; i++) {
                page3.drawText(equipmentHeaders[i], {
                  x: xPosition,
                  y: currentY,
                  size: 12,
                  font: timesRomanBoldFont,
                  color: rgb(0, 0, 0),
                });
                xPosition += equipmentWidths[i];
              }
              
              // Draw horizontal line under headers
              page3.drawLine({
                start: { x: startX, y: currentY - 10 },
                end: { x: startX + equipmentWidths.reduce((sum, width) => sum + width, 0), y: currentY - 10 },
                thickness: 1,
                color: rgb(0, 0, 0),
              });
              
              currentY -= 30;
            }
            
            // Add equipment row
            const values = [
              item.equipment_name || '-',
              item.description || '-',
              item.quantity?.toString() || '1',
              item.availability_status || 'Pending'
            ];
            
            xPosition = startX;
            for (let i = 0; i < values.length; i++) {
              // Truncate long text
              let displayText = values[i].toString();
              if (displayText.length > 40 && i === 1) { // Description
                displayText = displayText.substring(0, 40) + '...';
              } else if (displayText.length > 15 && i === 0) { // Equipment name
                displayText = displayText.substring(0, 15) + '...';
              }
              
              equipmentPage.drawText(displayText, {
                x: xPosition,
                y: currentY,
                size: 10,
                font: timesRomanFont,
                color: rgb(0, 0, 0),
              });
              xPosition += equipmentWidths[i];
            }
            
            currentY -= 20;
            equipmentCount++;
          }
          
          // Add subject
          equipmentPage.drawText('Subject', {
            x: 50,
            y: 80,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          equipmentPage.drawText('Equipments List Availability', {
            x: 150,
            y: 80,
            size: 12,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
          });
          
          // Add page number
          page2.drawText('Page 2 of 5', {
            x: width - 150,
            y: 30,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          // Add page number for page 3 if it exists
          if (pdfDoc.getPageCount() > 2) {
            const page3 = pdfDoc.getPage(2);
            page3.drawText('Page 3 of 5', {
              x: width - 150,
              y: 30,
              size: 10,
              font: timesRomanFont,
              color: rgb(0, 0, 0),
            });
          }
          
          // Add footer
          page2.drawText('For Internal Use Only', {
            x: 50,
            y: 50,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          page2.drawText('This document is the property of [Company Name] and is intended for internal use only. Unauthorized sharing, copying, or distribution is strictly prohibited.', {
            x: 50,
            y: 30,
            size: 8,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          // Add footer for page 3 if it exists
          if (pdfDoc.getPageCount() > 2) {
            const page3 = pdfDoc.getPage(2);
            page3.drawText('For Internal Use Only', {
              x: 50,
              y: 50,
              size: 10,
              font: timesRomanFont,
              color: rgb(0, 0, 0),
            });
            
            page3.drawText('This document is the property of [Company Name] and is intended for internal use only. Unauthorized sharing, copying, or distribution is strictly prohibited.', {
              x: 50,
              y: 30,
              size: 8,
              font: timesRomanFont,
              color: rgb(0, 0, 0),
            });
          }
          
          // Add workers page
          const page4 = pdfDoc.addPage([800, 1100]);
          
          // Add header
          page4.drawText('Kinetiq', {
            x: 50,
            y: height - 50,
            size: 24,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
          });
          
          page4.drawText('1975 Address Of Company', {
            x: 50,
            y: height - 80,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          page4.drawText('Street, Metro Manila', {
            x: 50,
            y: height - 100,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          page4.drawText('Philippines', {
            x: 50,
            y: height - 120,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          // Add workers table
          const workersHeaders = ['No.', 'Job Role', 'Worker Allocated', 'Employee ID', 'First Name', 'Last Name'];
          const workersWidths = [50, 150, 150, 150, 120, 120];
          startX = 50;
          currentY = height - 200;
          
          // Add project details heading
          page4.drawText('PROJECT DETAILS', {
            x: 50,
            y: height - 170,
            size: 16,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
          });
          
          // Add table headers
          xPosition = startX;
          for (let i = 0; i < workersHeaders.length; i++) {
            page4.drawText(workersHeaders[i], {
              x: xPosition,
              y: currentY,
              size: 12,
              font: timesRomanBoldFont,
              color: rgb(0, 0, 0),
            });
            xPosition += workersWidths[i];
          }
          
          // Add horizontal line
          page4.drawLine({
            start: { x: startX, y: currentY - 10 },
            end: { x: startX + workersWidths.reduce((sum, width) => sum + width, 0), y: currentY - 10 },
            thickness: 1,
            color: rgb(0, 0, 0),
          });
          
          currentY -= 30;
          
          // Add workers data
          const workers = projectDetails.workers || [];
          let workersPage = page4;
          let workerCount = 0;
          
          for (let i = 0; i < 19; i++) { // Show up to 19 workers across two pages
            const worker = i < workers.length ? workers[i] : null;
            
            // Check if we need a new page
            if (currentY < 100 || workerCount >= 10) { // Start a new page after 10 workers
              const page5 = pdfDoc.addPage([800, 1100]);
              workersPage = page5;
              currentY = height - 100;
              workerCount = 0;
              
              // Add continued header
              page5.drawText('PROJECT DETAILS', {
                x: 50,
                y: height - 50,
                size: 16,
                font: timesRomanBoldFont,
                color: rgb(0, 0, 0),
              });
              
              // Add column headers again
              xPosition = startX;
              for (let i = 0; i < workersHeaders.length; i++) {
                page5.drawText(workersHeaders[i], {
                  x: xPosition,
                  y: currentY,
                  size: 12,
                  font: timesRomanBoldFont,
                  color: rgb(0, 0, 0),
                });
                xPosition += workersWidths[i];
              }
              
              // Draw horizontal line under headers
              page5.drawLine({
                start: { x: startX, y: currentY - 10 },
                end: { x: startX + workersWidths.reduce((sum, width) => sum + width, 0), y: currentY - 10 },
                thickness: 1,
                color: rgb(0, 0, 0),
              });
              
              currentY -= 30;
            }
            
            // Add worker row
            const values = [
              (i + 1).toString(),
              worker?.job_role || '',
              '',
              worker?.employee_id || '',
              worker?.first_name || '',
              worker?.last_name || ''
            ];
            
            xPosition = startX;
            for (let j = 0; j < values.length; j++) {
              workersPage.drawText(values[j], {
                x: xPosition,
                y: currentY,
                size: 10,
                font: timesRomanFont,
                color: rgb(0, 0, 0),
              });
              xPosition += workersWidths[j];
            }
            
            currentY -= 20;
            workerCount++;
          }
          
          // Add subject
          workersPage.drawText('Subject', {
            x: 50,
            y: 80,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          workersPage.drawText('Workers Allocation List', {
            x: 150,
            y: 80,
            size: 12,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
          });
          
          // Add page number
          page4.drawText('Page 4 of 5', {
            x: width - 150,
            y: 30,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          // Add page number for page 5
          const page5 = pdfDoc.getPage(pdfDoc.getPageCount() - 1);
          page5.drawText('Page 5 of 5', {
            x: width - 150,
            y: 30,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          // Add footer
          page4.drawText('For Internal Use Only', {
            x: 50,
            y: 50,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          page4.drawText('This document is the property of [Company Name] and is intended for internal use only. Unauthorized sharing, copying, or distribution is strictly prohibited.', {
            x: 50,
            y: 30,
            size: 8,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          // Add footer for page 5
          page5.drawText('For Internal Use Only', {
            x: 50,
            y: 50,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          page5.drawText('This document is the property of [Company Name] and is intended for internal use only. Unauthorized sharing, copying, or distribution is strictly prohibited.', {
            x: 50,
            y: 30,
            size: 8,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
        } else {
          // Add workers page for internal projects (simpler version)
          const page2 = pdfDoc.addPage([800, 1100]);
          
          // Add header
          page2.drawText('Kinetiq', {
            x: 50,
            y: height - 50,
            size: 24,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
          });
          
          page2.drawText('1975 Address Of Company', {
            x: 50,
            y: height - 80,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          page2.drawText('Street, Metro Manila', {
            x: 50,
            y: height - 100,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          page2.drawText('Philippines', {
            x: 50,
            y: height - 120,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          // Add workers table
          const workersHeaders = ['No.', 'Job Role', 'Worker Allocated', 'Employee ID', 'First Name', 'Last Name'];
          const workersWidths = [50, 150, 150, 150, 120, 120];
          startX = 50;
          currentY = height - 200;
          
          // Add project details heading
          page2.drawText('PROJECT DETAILS', {
            x: 50,
            y: height - 170,
            size: 16,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
          });
          
          // Add table headers
          xPosition = startX;
          for (let i = 0; i < workersHeaders.length; i++) {
            page2.drawText(workersHeaders[i], {
              x: xPosition,
              y: currentY,
              size: 12,
              font: timesRomanBoldFont,
              color: rgb(0, 0, 0),
            });
            xPosition += workersWidths[i];
          }
          
          // Add horizontal line
          page2.drawLine({
            start: { x: startX, y: currentY - 10 },
            end: { x: startX + workersWidths.reduce((sum, width) => sum + width, 0), y: currentY - 10 },
            thickness: 1,
            color: rgb(0, 0, 0),
          });
          
          currentY -= 30;
          
          // Add workers data
          const workers = projectDetails.workers || [];
          
          for (let i = 0; i < 10; i++) { // Show up to 10 workers
            const worker = i < workers.length ? workers[i] : null;
            
            // Add worker row
            const values = [
              (i + 1).toString(),
              worker?.job_role || '',
              '',
              worker?.employee_id || '',
              worker?.first_name || '',
              worker?.last_name || ''
            ];
            
            xPosition = startX;
            for (let j = 0; j < values.length; j++) {
              page2.drawText(values[j], {
                x: xPosition,
                y: currentY,
                size: 10,
                font: timesRomanFont,
                color: rgb(0, 0, 0),
              });
              xPosition += workersWidths[j];
            }
            
            currentY -= 20;
          }
          
          // Add subject
          page2.drawText('Subject', {
            x: 50,
            y: 80,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          page2.drawText('Workers Allocation List', {
            x: 150,
            y: 80,
            size: 12,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
          });
          
          // Add page number
          page2.drawText('Page 2 of 2', {
            x: width - 150,
            y: 30,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          // Add footer
          page2.drawText('For Internal Use Only', {
            x: 50,
            y: 50,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          page2.drawText('This document is the property of [Company Name] and is intended for internal use only. Unauthorized sharing, copying, or distribution is strictly prohibited.', {
            x: 50,
            y: 30,
            size: 8,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
        }
        
        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        saveAs(blob, `Project_${projectId}_Form_${new Date().toISOString().split('T')[0]}.pdf`);
      }
      
      return true;
    } catch (err) {
      console.error('Error generating project form PDF:', err);
      setError('Error generating PDF: ' + err.message);
      return false;
    }
  };

  const handleGeneratePDF = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let reportsToExport = [];
      
      if (exportType === "selected") {
        if (selectedReports.length === 0) {
          setError("Please select at least one report to export");
          setLoading(false);
          return;
        }
        reportsToExport = selectedReports.map(index => filteredReports[index]);
      } else if (exportType === "all") {
        reportsToExport = filteredReports;
      } else if (exportType === "filtered") {
        reportsToExport = filteredReports;
      }
      
      if (reportsToExport.length === 0) {
        setError("No reports to export");
        setLoading(false);
        return;
      }
      
      let success = false;
      
      if (templateType === "standard") {
        success = await generateStandardPDF(reportsToExport);
      } else if (templateType === "projectDetails") {
        success = await generateProjectDetailsPDF(reportsToExport);
      } else if (templateType === "projectForm") {
        success = await generateProjectFormPDF(reportsToExport);
      }
      
      if (success) {
        setSelectedReports([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Error generating PDF: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="generate-reports-container">
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      <div className="report-header">
        <h1>Generate Reports</h1>
        <div className="export-options">
          <div className="option-group">
            <label>Export:</label>
            <select 
              value={exportType} 
              onChange={(e) => setExportType(e.target.value)}
              disabled={loading}
            >
              <option value="selected">Selected Reports</option>
              <option value="all">All Reports</option>
              <option value="filtered">Filtered Reports</option>
            </select>
          </div>
          
          <div className="option-group">
            <label>Template:</label>
            <select 
              value={templateType} 
              onChange={(e) => setTemplateType(e.target.value)}
              disabled={loading}
            >
              <option value="standard">Standard Report</option>
              <option value="projectDetails">Project Details</option>
              <option value="projectForm">Project Form</option>
            </select>
          </div>
          
          <button 
            className="generate-btn"
            onClick={handleGeneratePDF}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate PDF"}
          </button>
        </div>
      </div>
      
      <div className="filter-section">
        <h2>Filter Reports</h2>
        <div className="filter-row">
          <div className="filter-group">
            <label>Project ID:</label>
            <select 
              name="projectId"
              value={filterOptions.projectId}
              onChange={handleFilterChange}
              disabled={loading}
            >
              <option value="">All External Projects</option>
              {Array.isArray(projectData.externalProjects) ? 
                projectData.externalProjects.map(project => (
                  <option key={project.project_id} value={project.project_id}>
                    {project.project_id}
                  </option>
                )) : null}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Internal Project ID:</label>
            <select 
              name="internalProjectId"
              value={filterOptions.internalProjectId}
              onChange={handleFilterChange}
              disabled={loading}
            >
              <option value="">All Internal Projects</option>
              {Array.isArray(projectData.internalProjects) ? 
                projectData.internalProjects.map(project => (
                  <option key={project.intrnl_project_id} value={project.intrnl_project_id}>
                    {project.intrnl_project_id}
                  </option>
                )) : null}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Report Type:</label>
            <select 
              name="reportType"
              value={filterOptions.reportType}
              onChange={handleFilterChange}
              disabled={loading}
            >
              <option value="">All Types</option>
              {Array.isArray(reportTypes) && reportTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="filter-row">
          <div className="filter-group">
            <label>Date From:</label>
            <input 
              type="date" 
              name="dateFrom"
              value={filterOptions.dateFrom}
              onChange={handleFilterChange}
              disabled={loading}
            />
          </div>
          
          <div className="filter-group">
            <label>Date To:</label>
            <input 
              type="date" 
              name="dateTo"
              value={filterOptions.dateTo}
              onChange={handleFilterChange}
              disabled={loading}
            />
          </div>
          
          <div className="filter-actions">
            <button 
              className="reset-btn"
              onClick={resetFilters}
              disabled={loading}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      <div className="report-list-container">
        <h2>Report List</h2>
        <div className="report-table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedReports.length > 0 && selectedReports.length === filteredReports.length}
                    disabled={loading || filteredReports.length === 0}
                  />
                </th>
                <th>Project ID</th>
                <th>Internal Project ID</th>
                <th>Report Type</th>
                <th>Report Title</th>
                <th>Date Created</th>
                <th>Assigned To</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <tr key={index} className={selectedReports.includes(index) ? "selected-row" : ""}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                        disabled={loading}
                      />
                    </td>
                    <td>{report.project_id || "-"}</td>
                    <td>{report.intrnl_project_id || "-"}</td>
                    <td>{report.report_type}</td>
                    <td>{report.report_title}</td>
                    <td>{report.date_created}</td>
                    <td>{report.assigned_to}</td>
                    <td className="description-cell">{report.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    {loading ? "Loading reports..." : "No reports found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="selection-info">
          <p>{selectedReports.length} of {filteredReports.length} reports selected</p>
        </div>
      </div>
      
      {/* Hidden image for logo preloading */}
      <img 
        ref={logoRef} 
        src={logoUrl} 
        alt="Kinetiq Logo" 
        style={{ display: 'none' }} 
        onLoad={() => loadLogo()}
      />
    </div>
  );
};

export default GenerateReports;