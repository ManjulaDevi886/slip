import React, { useEffect, useState, useRef } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getEmployees } from "./api";
import Dropdown from "./components/Dropdown";
import PayslipCard from "./components/PayslipCard";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState("AVS");
  const [isDownloading, setIsDownloading] = useState(false);

  const payslipRef = useRef(null);

  useEffect(() => {
    fetchData(selectedCompany);
  }, [selectedCompany]);

  const fetchData = (company) => {
    setIsLoading(true);
    getEmployees(company)
      .then((data) => {
        setEmployees(data || []);
        setIsLoading(false);
        setError(""); // Clear error on success
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message || "Employee data not found");
        setEmployees([]);
        setIsLoading(false);
      });
  };

  const handleSelectEmployee = (empId) => {
    const employee = employees.find(emp => emp.employeeId === empId);
    if (employee) {
      // Create a default payslip structure for the selected employee
      const newPayslip = {
        employee: {
          ...employee,
          company: selectedCompany, // Keep company context
          department: employee.department || 'Operations',
          location: employee.location || 'Madurai',
          pan: employee.pan || 'ABCDE1234F',
          accountNumber: employee.accountNumber || '1234567890',
          pfAccountNumber: employee.pfAccountNumber || 'TN/MAS/12345/000/0001234',
          pfUan: employee.pfUan || '101234567890'
        },
        earning: [],
        deduction: [],
        payPeriod: 'December 2025',
        payDate: new Date().toISOString().split('T')[0],
        paidDays: 30,
        attendanceArrearDays: 0.0,
        incrementArrearDays: 0.0,
        leaveBalance: [
          { type: 'Sick Leave', opening: 2.0, availed: 0.0, closing: 2.0 },
          { type: 'Casual Leave', opening: 1.0, availed: 0.0, closing: 1.0 },
          { type: 'Earned Leave', opening: 1.0, availed: 0.0, closing: 1.0 }
        ]
      };
      setSelectedPayslip(newPayslip);
    }
  };

  const handleAddEarning = () => {
    setSelectedPayslip(prev => ({
      ...prev,
      earning: [...(prev.earning || []), { title: "", amount: 0, isNew: true }]
    }));
  };

  const handleAddDeduction = () => {
    setSelectedPayslip(prev => ({
      ...prev,
      deduction: [...(prev.deduction || []), { title: "", amount: 0, isNew: true }]
    }));
  };

  const handleUpdateItem = (type, index, field, value) => {
    setSelectedPayslip(prev => {
      const updated = { ...prev };
      const list = [...(updated[type] || [])];
      list[index] = { ...list[index], [field]: value };
      updated[type] = list;
      return updated;
    });
  };

  const handleUpdatePayInfo = (field, value) => {
    setSelectedPayslip(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDownloadPdf = async () => {
    if (!payslipRef.current) return;
    
    setIsDownloading(true);
    // Give React time to re-render the DOM without input elements
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      const element = payslipRef.current;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Payslip_${selectedPayslip.employee?.employeeId || 'download'}.pdf`);
    } catch (err) {
      console.error("Error generating PDF", err);
      alert("Failed to generate PDF.");
    } finally {
      setIsDownloading(false);
    }
  };


  const employeesList = employees;

  if (error) return <div className="full-center loading-state"><h2>{error}</h2></div>;
  if (isLoading) return <div className="full-center loading-state"><div className="spinner"></div><h2>Loading employee data...</h2></div>;
  if (employees.length === 0 && !isLoading) return <div className="full-center loading-state"><h2>No employee records available</h2></div>;

  return (
    <div className="admin-layout">
      <nav className="navbar">
        <div className="nav-brand">HR Payroll System</div>
      </nav>

      <main className="main-content">
        <div className="dashboard-view">
          <div className="control-panel card-ui">
            <div className="filter-row" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="dropdown-row" style={{ display: 'flex', gap: '2rem', width: '100%', alignItems: 'flex-end' }}>
                <div className="dropdown-container" style={{ flex: 1 }}>
                  <label className="dropdown-label">Select Company:</label>
                  <div className="select-wrapper">
                    <select
                      className="employee-dropdown"
                      value={selectedCompany}
                      onChange={(e) => {
                        const newCompany = e.target.value;
                        setSelectedCompany(newCompany);
                        setSelectedPayslip(null); // Clear selected employee when company changes
                      }}
                    >
                      <option value="AVS">AVS</option>
                      <option value="kaaikani">Kaaikani</option>
                    </select>
                  </div>
                </div>

                <div className="dropdown-container" style={{ flex: 1 }}>
                  <label className="dropdown-label">Select Employee:</label>
                  <Dropdown
                    employees={employeesList}
                    selectedEmployeeId={selectedPayslip?.employee?.employeeId}
                    onSelect={(empId) => {
                      handleSelectEmployee(empId);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {selectedPayslip ? (
            <div className="payslip-display-area">
              <PayslipCard
                data={selectedPayslip}
                onAddEarning={handleAddEarning}
                onAddDeduction={handleAddDeduction}
                onUpdateItem={handleUpdateItem}
                onUpdatePayInfo={handleUpdatePayInfo}
                targetRef={payslipRef}
                isDownloading={isDownloading}
              />

              <div className="download-section card-ui text-center">
                <button className="btn btn-primary btn-lg" onClick={handleDownloadPdf}>
                  Download Payslip
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <h3>No Employee Selected</h3>
              <p>Please select an employee from the dropdown to view and manage their payslip.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="footer-box">
        <p>&copy; Kaikani</p>
      </footer>
    </div>
  );
}

export default App;