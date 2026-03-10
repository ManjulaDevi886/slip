import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ employees, selectedEmployeeId, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedEmployee = employees.find(emp => emp.employeeId === selectedEmployeeId);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredEmployees = employees.filter(emp => {
        const name = emp.name || "";
        const id = emp.employeeId || "";
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            id.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const displayValue = isOpen ? searchTerm : (selectedEmployee ? `${selectedEmployee.name} (${selectedEmployee.employeeId})` : "");

    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <div className="searchable-dropdown">
                <input
                    type="text"
                    className="employee-dropdown"
                    placeholder="Search by name or ID..."
                    autoComplete="off"
                    value={displayValue}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                        setSearchTerm("");
                    }}
                />

                {isOpen && (
                    <div className="dropdown-list-container">
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map(emp => (
                                <div
                                    key={emp.employeeId}
                                    className={`dropdown-item ${emp.employeeId === selectedEmployeeId ? 'selected' : ''}`}
                                    onClick={() => {
                                        onSelect(emp.employeeId);
                                        setSearchTerm("");
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="emp-info">
                                        <span className="emp-name">{emp.name}</span>
                                        <span className="emp-id">{emp.employeeId}</span>
                                    </div>
                                    <div className="emp-dept">{emp.designation}</div>
                                </div>
                            ))
                        ) : (
                            <div className="dropdown-no-results">No employees found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dropdown;
