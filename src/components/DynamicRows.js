import React, { useState, useEffect } from 'react';

const DynamicRows = ({ title, activeClass, items, onTotalChange }) => {
    // 6. Use useState to store an array of row objects.
    // Initialize with existing items or an empty row.
    const [rows, setRows] = useState(
        items && items.length > 0
            ? items
            : [{ title: '', amount: '' }]
    );

    // Sync total to parent whenever rows change
    useEffect(() => {
        const total = rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
        if (onTotalChange) {
            onTotalChange(total);
        }
    }, [rows, onTotalChange]);

    // 4. Inputs: Title -> text input, Amount -> number input
    const handleTitleChange = (index, value) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], title: value };
        setRows(newRows);
    };

    const handleAmountChange = (index, value) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], amount: value };
        setRows(newRows);
    };

    // 3. When the user clicks the "Add" button on a row:
    // A new row should appear directly below the current row with empty input fields.
    const handleRowAdd = (index) => {
        const newRows = [...rows];
        // 7. Unlimited rows can be added.
        newRows.splice(index + 1, 0, { title: '', amount: '' });
        setRows(newRows);
    };

    // Calculate current footer total
    const currentTotal = rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);

    // Using inline styles to force a grid layout within the existing Flex CSS structure
    // This honors requirement 10: "UI must stay consistent ... no new CSS changes."
    const rowStructureStyle = {
        alignItems: 'center',
        display: 'grid',
        gridTemplateColumns: '1fr 100px 70px',
        gap: '10px'
    };

    return (
        <div className={`table-pane ${activeClass || ''}`}>
            {/* 1. Columns should be: Title | Amount | Action */}
            <div className="table-header" style={rowStructureStyle}>
                <span>{title}</span>
                <span>AMOUNT</span>
                <span style={{ textAlign: 'center' }} data-html2canvas-ignore="true">ACTION</span>
            </div>

            <div className="table-body">
                {rows.map((row, index) => (
                    <div className="table-row" key={index} style={rowStructureStyle}>
                        {/* 2. Title input field */}
                        <input
                            type="text"
                            placeholder="Title"
                            value={row.title}
                            onChange={(e) => handleTitleChange(index, e.target.value)}
                            style={{ width: '100%', padding: '0.4rem', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '0.85rem' }}
                        />
                        {/* 2. Amount input field */}
                        <input
                            type="number"
                            placeholder="Amount"
                            value={row.amount}
                            onChange={(e) => handleAmountChange(index, e.target.value)}
                            style={{ width: '100%', padding: '0.4rem', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '0.85rem' }}
                        />
                        {/* 2. An "Add" button */}
                        <button
                            className="btn btn-outline-success"
                            onClick={() => handleRowAdd(index)}
                            data-html2canvas-ignore="true"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', width: '100%' }}
                        >
                            Add
                        </button>
                    </div>
                ))}
            </div>

            <div className="table-footer" style={rowStructureStyle}>
                <span>{title === 'EARNINGS' ? 'Gross Earnings' : 'Total Deductions'}</span>
                <span>Rs. {currentTotal.toFixed(2)}</span>
                <span data-html2canvas-ignore="true"></span>
            </div>
        </div>
    );
};

export default DynamicRows;
