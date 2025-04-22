import React, { useState, useEffect } from "react";
import axios from "axios";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import "../styles/ProjectForms.css";
import logoUrl from "/public/icons/Kinetiq-Logo.png";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const ProjectForms = () => {
  const [formType, setFormType] = useState("equipment");
  const [projectType, setProjectType] = useState("external");
  const [externalProjects, setExternalProjects] = useState([]);
  const [internalProjects, setInternalProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  
  
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [searchEquipment, setSearchEquipment] = useState("");
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  
  
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [searchEmployee, setSearchEmployee] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");
  
  
  const [apiErrors, setApiErrors] = useState({
    equipment: false,
    employees: false,
    positions: false,
    externalProjects: false,
    internalProjects: false
  });
  
  useEffect(() => {
    fetchInitialData();
    loadLogo();
  }, []);
  
  useEffect(() => {
    if (searchEquipment.trim() && !apiErrors.equipment) {
      fetchEquipment(searchEquipment);
    } else {
      setFilteredEquipment(equipment);
    }
  }, [searchEquipment, equipment, apiErrors.equipment]);
  
  useEffect(() => {
    if ((searchEmployee.trim() || selectedPosition) && !apiErrors.employees) {
      fetchEmployees(searchEmployee, selectedPosition);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchEmployee, selectedPosition, employees, apiErrors.employees]);
  
  const loadLogo = async () => {
    try {
      const response = await fetch(logoUrl);
      const arrayBuffer = await response.arrayBuffer();
      setLogoImage(arrayBuffer);
    } catch (err) {
      console.error('Error loading logo:', err);
    }
  };
  
  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      
      try {
        const externalResponse = await axios.get('/api/external-projects/');
        setExternalProjects(externalResponse.data || []);
      } catch (err) {
        console.error('Error fetching external projects:', err);
        setApiErrors(prev => ({ ...prev, externalProjects: true }));
        
        setExternalProjects([]);
      }
      
      
      try {
        const internalResponse = await axios.get('/api/internal-projects/');
        setInternalProjects(internalResponse.data || []);
      } catch (err) {
        console.error('Error fetching internal projects:', err);
        setApiErrors(prev => ({ ...prev, internalProjects: true }));
        
        setInternalProjects([]);
      }
      
      
      try {
        const equipmentResponse = await axios.get('/api/equipment/');
        setEquipment(equipmentResponse.data || []);
        setFilteredEquipment(equipmentResponse.data || []);
      } catch (err) {
        console.error('Error fetching equipment:', err);
        setApiErrors(prev => ({ ...prev, equipment: true }));
        
        const mockEquipment = [
          { equipment_id: 'EQ001', equipment_name: 'Drill Machine', description: 'Heavy duty drill', availability_status: 'Available' },
          { equipment_id: 'EQ002', equipment_name: 'Welding Machine', description: 'Industrial welding equipment', availability_status: 'Available' },
          { equipment_id: 'EQ003', equipment_name: 'Generator', description: '5000W portable generator', availability_status: 'Unavailable' },
          { equipment_id: 'EQ004', equipment_name: 'Forklift', description: '2-ton capacity forklift', availability_status: 'Available' },
          { equipment_id: 'EQ005', equipment_name: 'Concrete Mixer', description: 'Large concrete mixer', availability_status: 'Pending' }
        ];
        setEquipment(mockEquipment);
        setFilteredEquipment(mockEquipment);
      }
      
      
      try {
        const employeesResponse = await axios.get('/api/employees/');
        setEmployees(employeesResponse.data || []);
        setFilteredEmployees(employeesResponse.data || []);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setApiErrors(prev => ({ ...prev, employees: true }));
        
        const mockEmployees = [
          { employee_id: 'EMP001', first_name: 'John', last_name: 'Doe', position_id: 'POS001', position_title: 'Engineer' },
          { employee_id: 'EMP002', first_name: 'Jane', last_name: 'Smith', position_id: 'POS002', position_title: 'Technician' },
          { employee_id: 'EMP003', first_name: 'Robert', last_name: 'Johnson', position_id: 'POS003', position_title: 'Project Manager' },
          { employee_id: 'EMP004', first_name: 'Emily', last_name: 'Brown', position_id: 'POS004', position_title: 'Supervisor' },
          { employee_id: 'EMP005', first_name: 'Michael', last_name: 'Wilson', position_id: 'POS002', position_title: 'Technician' }
        ];
        setEmployees(mockEmployees);
        setFilteredEmployees(mockEmployees);
      }
      
      
      try {
        const positionsResponse = await axios.get('/api/positions/');
        setPositions(positionsResponse.data || []);
      } catch (err) {
        console.error('Error fetching positions:', err);
        setApiErrors(prev => ({ ...prev, positions: true }));
        
        const mockPositions = [
          { position_id: 'POS001', position_title: 'Engineer' },
          { position_id: 'POS002', position_title: 'Technician' },
          { position_id: 'POS003', position_title: 'Project Manager' },
          { position_id: 'POS004', position_title: 'Supervisor' },
          { position_id: 'POS005', position_title: 'Electrician' }
        ];
        setPositions(mockPositions);
      }
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching data: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  const fetchEquipment = async (search) => {
    if (apiErrors.equipment) {
      
      const filtered = equipment.filter(item => 
        item.equipment_name.toLowerCase().includes(search.toLowerCase()) || 
        item.description.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredEquipment(filtered);
      return;
    }
    
    try {
      const response = await axios.get('/api/equipment/', {
        params: { search }
      });
      setFilteredEquipment(response.data || []);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setApiErrors(prev => ({ ...prev, equipment: true }));
      
      const filtered = equipment.filter(item => 
        item.equipment_name.toLowerCase().includes(search.toLowerCase()) || 
        item.description.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredEquipment(filtered);
    }
  };
  
  const fetchEmployees = async (search, position) => {
    if (apiErrors.employees) {
      
      let filtered = employees;
      
      if (search) {
        filtered = filtered.filter(emp => 
          emp.first_name.toLowerCase().includes(search.toLowerCase()) || 
          emp.last_name.toLowerCase().includes(search.toLowerCase()) || 
          emp.employee_id.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (position) {
        filtered = filtered.filter(emp => emp.position_id === position);
      }
      
      setFilteredEmployees(filtered);
      return;
    }
    
    try {
      const response = await axios.get('/api/employees/', {
        params: { search, position }
      });
      setFilteredEmployees(response.data || []);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setApiErrors(prev => ({ ...prev, employees: true }));
      
      let filtered = employees;
      
      if (search) {
        filtered = filtered.filter(emp => 
          emp.first_name.toLowerCase().includes(search.toLowerCase()) || 
          emp.last_name.toLowerCase().includes(search.toLowerCase()) || 
          emp.employee_id.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (position) {
        filtered = filtered.filter(emp => emp.position_id === position);
      }
      
      setFilteredEmployees(filtered);
    }
  };
  
  const handleProjectTypeChange = (e) => {
    setProjectType(e.target.value);
    setSelectedProject("");
  };
  
  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
  };
  
  const handleFormTypeChange = (e) => {
    setFormType(e.target.value);
  };
  
  const toggleEquipmentSelection = (equipment) => {
    const isSelected = selectedEquipment.some(e => e.equipment_id === equipment.equipment_id);
    
    if (isSelected) {
      setSelectedEquipment(selectedEquipment.filter(e => e.equipment_id !== equipment.equipment_id));
    } else {
      setSelectedEquipment([...selectedEquipment, { ...equipment, quantity: 1 }]);
    }
  };
  
  const handleEquipmentQuantityChange = (id, quantity) => {
    setSelectedEquipment(selectedEquipment.map(item => 
      item.equipment_id === id ? { ...item, quantity: parseInt(quantity) || 1 } : item
    ));
  };
  
  const toggleWorkerSelection = (employee) => {
    const isSelected = selectedWorkers.some(w => w.employee_id === employee.employee_id);
    
    if (isSelected) {
      setSelectedWorkers(selectedWorkers.filter(w => w.employee_id !== employee.employee_id));
    } else {
      setSelectedWorkers([...selectedWorkers, { 
        ...employee, 
        job_role: employee.position_title || "Staff"
      }]);
    }
  };
  
  const handleWorkerRoleChange = (id, role) => {
    setSelectedWorkers(selectedWorkers.map(worker => 
      worker.employee_id === id ? { ...worker, job_role: role } : worker
    ));
  };
  
  const generateEquipmentFormPDF = async () => {
    if (!selectedProject) {
      setError("Please select a project first");
      return;
    }
    
    if (selectedEquipment.length === 0) {
      setError("Please select at least one equipment");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      
      
      const page = pdfDoc.addPage([800, 1100]);
      const { width, height } = page.getSize();
      
      
      if (logoImage) {
        try {
          const logo = await pdfDoc.embedPng(logoImage);
          const logoDims = logo.scale(0.5); 
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
      
      
      const projectName = projectType === 'external' 
        ? `External Project: ${selectedProject}` 
        : `Internal Project: ${selectedProject}`;
      
      page.drawText('Project ID', {
        x: 50,
        y: height - 170,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      page.drawText(selectedProject, {
        x: 150,
        y: height - 170,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      
      page.drawText('EQUIPMENT AVAILABILITY REQUEST', {
        x: 50,
        y: height - 220,
        size: 16,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      
      page.drawText('Date Requested', {
        x: 50,
        y: height - 250,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      page.drawText(new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }), {
        x: 150,
        y: height - 250,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      
      const equipmentHeaders = ['Equipment', 'Description', 'QTY', 'Availability'];
      const equipmentWidths = [150, 350, 50, 150];
      let startX = 50;
      let currentY = height - 300;
      
      
      let xPosition = startX;
      for (let i = 0; i < equipmentHeaders.length; i++) {
        page.drawText(equipmentHeaders[i], {
          x: xPosition,
          y: currentY,
          size: 12,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        xPosition += equipmentWidths[i];
      }
      
      
      page.drawLine({
        start: { x: startX, y: currentY - 10 },
        end: { x: startX + equipmentWidths.reduce((sum, width) => sum + width, 0), y: currentY - 10 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
      
      currentY -= 30;
      
      
      let equipmentPage = page;
      let equipmentCount = 0;
      
      for (const item of selectedEquipment) {
        
        if (currentY < 100 || equipmentCount >= 11) { 
          const newPage = pdfDoc.addPage([800, 1100]);
          equipmentPage = newPage;
          currentY = height - 100;
          equipmentCount = 0;
          
          
          newPage.drawText('EQUIPMENT AVAILABILITY REQUEST (Continued)', {
            x: 50,
            y: height - 50,
            size: 16,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
          });
          
          
          xPosition = startX;
          for (let i = 0; i < equipmentHeaders.length; i++) {
            newPage.drawText(equipmentHeaders[i], {
              x: xPosition,
              y: currentY,
              size: 12,
              font: timesRomanBoldFont,
              color: rgb(0, 0, 0),
            });
            xPosition += equipmentWidths[i];
          }
          
          
          newPage.drawLine({
            start: { x: startX, y: currentY - 10 },
            end: { x: startX + equipmentWidths.reduce((sum, width) => sum + width, 0), y: currentY - 10 },
            thickness: 1,
            color: rgb(0, 0, 0),
          });
          
          currentY -= 30;
        }
        
        
        const values = [
          item.equipment_name || '-',
          item.description || '-',
          item.quantity?.toString() || '1',
          item.availability_status || 'Pending'
        ];
        
        xPosition = startX;
        for (let i = 0; i < values.length; i++) {
          
          let displayText = values[i].toString();
          if (displayText.length > 40 && i === 1) { 
            displayText = displayText.substring(0, 40) + '...';
          } else if (displayText.length > 15 && i === 0) { 
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
      
      
      equipmentPage.drawText('Notes:', {
        x: 50,
        y: currentY - 30,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      equipmentPage.drawText('This is a request for equipment availability. Please respond within 24 hours.', {
        x: 50,
        y: currentY - 50,
        size: 10,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      
      equipmentPage.drawText('Subject', {
        x: 50,
        y: 80,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      equipmentPage.drawText('Equipment Availability Request', {
        x: 150,
        y: 80,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      
      equipmentPage.drawText('Requested by', {
        x: 50,
        y: 60,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      equipmentPage.drawText('Project Management Team', {
        x: 150,
        y: 60,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      
      const pageCount = pdfDoc.getPageCount();
      for (let i = 0; i < pageCount; i++) {
        const page = pdfDoc.getPage(i);
        page.drawText(`Page ${i + 1} of ${pageCount}`, {
          x: width - 150,
          y: 30,
          size: 10,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        
        page.drawText('For Internal Use Only', {
          x: 50,
          y: 50,
          size: 10,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        page.drawText('This document is the property of Kinetiq and is intended for internal use only.', {
          x: 50,
          y: 30,
          size: 8,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
      }
      
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `Equipment_Request_${selectedProject}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      setLoading(false);
    } catch (err) {
      console.error('Error generating equipment form PDF:', err);
      setError('Error generating PDF: ' + err.message);
      setLoading(false);
    }
  };
  
  const generateWorkersFormPDF = async () => {
    if (!selectedProject) {
      setError("Please select a project first");
      return;
    }
    
    if (selectedWorkers.length === 0) {
      setError("Please select at least one worker");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      
      
      const page = pdfDoc.addPage([800, 1100]);
      const { width, height } = page.getSize();
      
      
      if (logoImage) {
        try {
          const logo = await pdfDoc.embedPng(logoImage);
          const logoDims = logo.scale(0.5); 
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
      
      
      const projectName = projectType === 'external' 
        ? `External Project: ${selectedProject}` 
        : `Internal Project: ${selectedProject}`;
      
      page.drawText('Project ID', {
        x: 50,
        y: height - 170,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      page.drawText(selectedProject, {
        x: 150,
        y: height - 170,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      
      page.drawText('WORKERS ALLOCATION REQUEST', {
        x: 50,
        y: height - 220,
        size: 16,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      
      page.drawText('Date Requested', {
        x: 50,
        y: height - 250,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      page.drawText(new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }), {
        x: 150,
        y: height - 250,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      
      const workersHeaders = ['No.', 'Job Role', 'Employee ID', 'First Name', 'Last Name'];
      const workersWidths = [50, 200, 150, 150, 150];
      let startX = 50;
      let currentY = height - 300;
      
      
      let xPosition = startX;
      for (let i = 0; i < workersHeaders.length; i++) {
        page.drawText(workersHeaders[i], {
          x: xPosition,
          y: currentY,
          size: 12,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        xPosition += workersWidths[i];
      }
      
      
      page.drawLine({
        start: { x: startX, y: currentY - 10 },
        end: { x: startX + workersWidths.reduce((sum, width) => sum + width, 0), y: currentY - 10 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
      
      currentY -= 30;
      
      
      let workersPage = page;
      let workerCount = 0;
      
      for (let i = 0; i < selectedWorkers.length; i++) {
        const worker = selectedWorkers[i];
        
        
        if (currentY < 100 || workerCount >= 15) { 
          const newPage = pdfDoc.addPage([800, 1100]);
          workersPage = newPage;
          currentY = height - 100;
          workerCount = 0;
          
          
          newPage.drawText('WORKERS ALLOCATION REQUEST (Continued)', {
            x: 50,
            y: height - 50,
            size: 16,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
          });
          
          
          xPosition = startX;
          for (let i = 0; i < workersHeaders.length; i++) {
            newPage.drawText(workersHeaders[i], {
              x: xPosition,
              y: currentY,
              size: 12,
              font: timesRomanBoldFont,
              color: rgb(0, 0, 0),
            });
            xPosition += workersWidths[i];
          }
          
          
          newPage.drawLine({
            start: { x: startX, y: currentY - 10 },
            end: { x: startX + workersWidths.reduce((sum, width) => sum + width, 0), y: currentY - 10 },
            thickness: 1,
            color: rgb(0, 0, 0),
          });
          
          currentY -= 30;
        }
        
        
        const values = [
          (i + 1).toString(),
          worker.job_role || worker.position_title || '',
          worker.employee_id || '',
          worker.first_name || '',
          worker.last_name || ''
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
      
      
      workersPage.drawText('Notes:', {
        x: 50,
        y: currentY - 30,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      workersPage.drawText('This is a request for worker allocation. Please respond within 24 hours.', {
        x: 50,
        y: currentY - 50,
        size: 10,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      
      workersPage.drawText('Subject', {
        x: 50,
        y: 80,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      workersPage.drawText('Workers Allocation Request', {
        x: 150,
        y: 80,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      
      workersPage.drawText('Requested by', {
        x: 50,
        y: 60,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      workersPage.drawText('Project Management Team', {
        x: 150,
        y: 60,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      
      const pageCount = pdfDoc.getPageCount();
      for (let i = 0; i < pageCount; i++) {
        const page = pdfDoc.getPage(i);
        page.drawText(`Page ${i + 1} of ${pageCount}`, {
          x: width - 150,
          y: 30,
          size: 10,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        
        page.drawText('For Internal Use Only', {
          x: 50,
          y: 50,
          size: 10,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        page.drawText('This document is the property of Kinetiq and is intended for internal use only.', {
          x: 50,
          y: 30,
          size: 8,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
      }
      
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `Worker_Allocation_${selectedProject}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      setLoading(false);
    } catch (err) {
      console.error('Error generating workers form PDF:', err);
      setError('Error generating PDF: ' + err.message);
      setLoading(false);
    }
  };
  
  return (
    <div className="project-forms-container">
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      {Object.values(apiErrors).some(val => val) && (
        <div className="warning-banner">
          <p>Some data could not be loaded from the server. Using fallback data for demonstration.</p>
        </div>
      )}
      
      <div className="form-header">
        <h1>Project Forms</h1>
        <div className="form-type-selector">
          <label>Form Type:</label>
          <select 
            value={formType} 
            onChange={handleFormTypeChange}
            disabled={loading}
          >
            <option value="equipment">Equipment Availability</option>
            <option value="workers">Workers Allocation</option>
          </select>
        </div>
      </div>
      
      <div className="project-selection">
        <h2>Project Selection</h2>
        <div className="selection-row">
          <div className="selection-group">
            <label>Project Type:</label>
            <select 
              value={projectType} 
              onChange={handleProjectTypeChange}
              disabled={loading}
            >
              <option value="external">External Project</option>
              <option value="internal">Internal Project</option>
            </select>
          </div>
          
          <div className="selection-group">
            <label>Project:</label>
            <select 
              value={selectedProject} 
              onChange={handleProjectChange}
              disabled={loading}
            >
              <option value="">Select a project</option>
              {projectType === 'external' ? (
                externalProjects.length > 0 ? (
                  externalProjects.map(project => (
                    <option key={project.project_id} value={project.project_id}>
                      {project.project_id} {project.project_status ? `- ${project.project_status}` : ''}
                    </option>
                  ))
                ) : (
                  <option value="EXT001">EXT001 - Sample External Project</option>
                )
              ) : (
                internalProjects.length > 0 ? (
                  internalProjects.map(project => (
                    <option key={project.intrnl_project_id} value={project.intrnl_project_id}>
                      {project.intrnl_project_id} {project.intrnl_project_status ? `- ${project.intrnl_project_status}` : ''}
                    </option>
                  ))
                ) : (
                  <option value="INT001">INT001 - Sample Internal Project</option>
                )
              )}
            </select>
          </div>
        </div>
      </div>
      
      {formType === "equipment" ? (
        <div className="equipment-form">
          <h2>Equipment Availability Form</h2>
          
          <div className="search-section">
            <div className="search-row">
              <div className="search-group">
                <label>Search Equipment:</label>
                <input 
                  type="text" 
                  value={searchEquipment}
                  onChange={(e) => setSearchEquipment(e.target.value)}
                  placeholder="Search by name or description"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          
          <div className="equipment-selection">
            <div className="equipment-list">
              <h3>Available Equipment</h3>
              <div className="list-container">
                {filteredEquipment.length > 0 ? (
                  filteredEquipment.map(item => (
                    <div 
                      key={item.equipment_id} 
                      className={`equipment-item ${
                        selectedEquipment.some(e => e.equipment_id === item.equipment_id) ? 'selected' : ''
                      }`}
                      onClick={() => toggleEquipmentSelection(item)}
                    >
                      <div className="equipment-details">
                        <h4>{item.equipment_name}</h4>
                        <p>{item.description}</p>
                        <span className={`status ${item.availability_status.toLowerCase()}`}>
                          {item.availability_status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-items">No equipment found</p>
                )}
              </div>
            </div>
            
            <div className="selected-equipment">
              <h3>Selected Equipment</h3>
              <div className="selected-list">
                {selectedEquipment.length > 0 ? (
                  selectedEquipment.map(item => (
                    <div key={item.equipment_id} className="selected-item">
                      <div className="item-details">
                        <h4>{item.equipment_name}</h4>
                        <p>{item.description}</p>
                      </div>
                      <div className="item-actions">
                        <label>Quantity:</label>
                        <input 
                          type="number" 
                          min="1" 
                          value={item.quantity} 
                          onChange={(e) => handleEquipmentQuantityChange(item.equipment_id, e.target.value)}
                          disabled={loading}
                        />
                        <button 
                          onClick={() => toggleEquipmentSelection(item)}
                          disabled={loading}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-items">No equipment selected</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              className="generate-btn"
              onClick={generateEquipmentFormPDF}
              disabled={loading || !selectedProject || selectedEquipment.length === 0}
            >
              {loading ? "Generating..." : "Generate Equipment Request PDF"}
            </button>
          </div>
        </div>
      ) : (
        <div className="workers-form">
          <h2>Workers Allocation Form</h2>
          
          <div className="search-section">
            <div className="search-row">
              <div className="search-group">
                <label>Search Employees:</label>
                <input 
                  type="text" 
                  value={searchEmployee}
                  onChange={(e) => setSearchEmployee(e.target.value)}
                  placeholder="Search by name or ID"
                  disabled={loading}
                />
              </div>
              
              <div className="search-group">
                <label>Filter by Position:</label>
                <select 
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  disabled={loading}
                >
                  <option value="">All Positions</option>
                  {positions.map(position => (
                    <option key={position.position_id} value={position.position_id}>
                      {position.position_title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="workers-selection">
            <div className="workers-list">
              <h3>Available Employees</h3>
              <div className="list-container">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map(employee => (
                    <div 
                      key={employee.employee_id} 
                      className={`worker-item ${
                        selectedWorkers.some(w => w.employee_id === employee.employee_id) ? 'selected' : ''
                      }`}
                      onClick={() => toggleWorkerSelection(employee)}
                    >
                      <div className="worker-details">
                        <h4>{employee.first_name} {employee.last_name}</h4>
                        <p>ID: {employee.employee_id}</p>
                        <p>Position: {employee.position_title}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-items">No employees found</p>
                )}
              </div>
            </div>
            
            <div className="selected-workers">
              <h3>Selected Employees</h3>
              <div className="selected-list">
                {selectedWorkers.length > 0 ? (
                  selectedWorkers.map(worker => (
                    <div key={worker.employee_id} className="selected-item">
                      <div className="item-details">
                        <h4>{worker.first_name} {worker.last_name}</h4>
                        <p>ID: {worker.employee_id}</p>
                      </div>
                      <div className="item-actions">
                        <label>Job Role:</label>
                        <input 
                          type="text" 
                          value={worker.job_role} 
                          onChange={(e) => handleWorkerRoleChange(worker.employee_id, e.target.value)}
                          disabled={loading}
                        />
                        <button 
                          onClick={() => toggleWorkerSelection(worker)}
                          disabled={loading}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-items">No employees selected</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              className="generate-btn"
              onClick={generateWorkersFormPDF}
              disabled={loading || !selectedProject || selectedWorkers.length === 0}
            >
              {loading ? "Generating..." : "Generate Workers Allocation PDF"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectForms;