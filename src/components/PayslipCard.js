import React from 'react';

const numberToWords = (num) => {
    if (num <= 0) return "Zero";
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convert = (n) => {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
        if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + convert(n % 100) : "");
        if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + convert(n % 1000) : "");
        if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + convert(n % 100000) : "");
        return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + convert(n % 10000000) : "");
    };
    return convert(num);
};

const PayslipCard = ({ data, onAddEarning, onAddDeduction, onUpdateItem, onUpdatePayInfo, targetRef, isDownloading }) => {
    // Calculate totals from data
    const earnings = data.earning || [];
    const deductions = data.deduction || [];

    const grossEarnings = earnings.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) || 0;
    const totalDeductions = deductions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) || 0;
    const netPay = Math.max(0, grossEarnings - totalDeductions);

    return (
        <div className="payslip-wrapper">
            <div className="payslip-container" ref={targetRef}>
                {/* Header Section */}
                <header className="payslip-header-simple">
                    <div className="header-flex-container">
                        <div className="logo-square-container">
                            <img 
                                src="/logo.png" 
                                alt="KaaiKani Logo" 
                                className="company-logo-img" 
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    if(e.target.nextSibling) {
                                        e.target.nextSibling.style.display = 'flex';
                                    }
                                }} 
                            />
                            <div className="logo-brand-bg" style={{ display: 'none' }}>
                                <span className="logo-inner-text">KaaiKani</span>
                                <div className="logo-pomegranate-dot"></div>
                            </div>
                        </div>
                        <div className="header-text-info">
                            <h1 className="header-company-title">KaaiKani</h1>
                            <p className="header-address-line">1st FLOOR, THANGAM HOUSING-II, NO.8B, Thirumalai Naicker St, EXT, Kovil Pappakudi,</p>
                        </div>
                    </div>
                </header>

                <div className="header-divider-line"></div>

                {/* Employee Details Section */}
                <table className="payslip-table employee-grid">
                    <tbody>
                        <tr>
                            <td className="label-cell">Name</td>
                            <td className="value-cell">{data.employee?.name}</td>
                            <td className="label-cell">PAN</td>
                            <td className="value-cell">{data.employee?.pan}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Employee Code</td>
                            <td className="value-cell">{data.employee?.employeeId}</td>
                            <td className="label-cell">Pay Date</td>
                            <td className="value-cell">
                                {isDownloading ? (
                                    <span>{data.payDate || ''}</span>
                                ) : (
                                    <input
                                        type="text"
                                        className="minimal-input"
                                        value={data.payDate || ''}
                                        onChange={(e) => onUpdatePayInfo('payDate', e.target.value)}
                                    />
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className="label-cell">Designation</td>
                            <td className="value-cell">{data.employee?.designation}</td>
                            <td className="label-cell">Pay Period</td>
                            <td className="value-cell">
                                {isDownloading ? (
                                    <span>{data.payPeriod || ''}</span>
                                ) : (
                                    <input
                                        type="text"
                                        className="minimal-input"
                                        value={data.payPeriod || ''}
                                        onChange={(e) => onUpdatePayInfo('payPeriod', e.target.value)}
                                    />
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className="label-cell">Location</td>
                            <td className="value-cell">{data.employee?.location}</td>
                            <td className="label-cell">Joining Date</td>
                            <td className="value-cell">{data.employee?.dateOfJoining ? new Date(data.employee.dateOfJoining).toLocaleDateString('en-GB') : '21/07/2025'}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Account Number</td>
                            <td className="value-cell">{data.employee?.accountNumber}</td>
                            <td className="label-cell">PF Number</td>
                            <td className="value-cell">{data.employee?.pfAccountNumber}</td>
                        </tr>
                        <tr>
                            <td className="label-cell"></td>
                            <td className="value-cell"></td>
                            <td className="label-cell">UAN Number</td>
                            <td className="value-cell">{data.employee?.pfUan}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Arrears Section */}
                <div className="section-header-dark arrears-bar">
                    <span>PAY DAYS: {data.paidDays || 30}</span>
                    <span>ATTENDANCE ARREAR DAYS: {data.attendanceArrearDays?.toFixed(2) || '0.00'}</span>
                    <span>INCREMENT ARREAR DAYS: {data.incrementArrearDays?.toFixed(2) || '0.00'}</span>
                </div>

                {/* Net Pay Section */}
                <table className="payslip-table net-pay-table" style={{ marginTop: '20px' }}>
                    <tbody>
                        <tr className="net-pay-highlight">
                            <td className="label-cell-large">NET PAY (INR)</td>
                            <td className="value-cell-large text-right">{netPay.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">NET PAY IN WORDS</td>
                            <td className="value-cell">{numberToWords(Math.round(netPay))} Only</td>
                        </tr>
                    </tbody>
                </table>

                {/* Earnings & Deductions */}
                <div className="earnings-deductions-grid">
                    <div className="half-width-table">
                        <div className="sub-header-dark">EARNINGS</div>
                        <table className="payslip-table compact">
                            <thead>
                                <tr>
                                    <th>COMPONENTS</th>
                                    <th className="text-right">AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {earnings.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            {isDownloading ? (
                                                <span>{item.title}</span>
                                            ) : (
                                                <input className="minimal-input" placeholder="Component Name" value={item.title} onChange={(e) => onUpdateItem('earning', idx, 'title', e.target.value)} />
                                            )}
                                        </td>
                                        <td className="text-right">
                                            {isDownloading ? (
                                                <span>{item.amount}</span>
                                            ) : (
                                                <input type="number" className="minimal-input text-right" placeholder="0" value={item.amount} onChange={(e) => onUpdateItem('earning', idx, 'amount', e.target.value)} />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="summary-row">
                                    <td>TOTAL EARNINGS</td>
                                    <td className="text-right">{grossEarnings.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                        {!isDownloading && (
                            <div className="btn-row">
                                <button className="add-btn-minimal" onClick={onAddEarning}>+ Add Earnings</button>
                            </div>
                        )}
                    </div>

                    <div className="half-width-table">
                        <div className="sub-header-dark">DEDUCTIONS</div>
                        <table className="payslip-table compact">
                            <thead>
                                <tr>
                                    <th>COMPONENTS</th>
                                    <th className="text-right">AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deductions.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            {isDownloading ? (
                                                <span>{item.title}</span>
                                            ) : (
                                                <input className="minimal-input" placeholder="Component Name" value={item.title} onChange={(e) => onUpdateItem('deduction', idx, 'title', e.target.value)} />
                                            )}
                                        </td>
                                        <td className="text-right">
                                            {isDownloading ? (
                                                <span>{item.amount}</span>
                                            ) : (
                                                <input type="number" className="minimal-input text-right" placeholder="0" value={item.amount} onChange={(e) => onUpdateItem('deduction', idx, 'amount', e.target.value)} />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="summary-row">
                                    <td>TOTAL DEDUCTIONS</td>
                                    <td className="text-right">{totalDeductions.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                        {!isDownloading && (
                            <div className="btn-row">
                                <button className="add-btn-minimal" onClick={onAddDeduction}>+ Add Deduction</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Removed Leave Balance Section */}

                <div className="divider-cut">
                    <span>✂ Cut Here ✂</span>
                </div>

                <div className="footer-legal">
                    <p>Note: This is a system generated payslip, does not require any signature.</p>
                </div>
            </div>
        </div>
    );
};

export default PayslipCard;
