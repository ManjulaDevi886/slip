import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, onSave, title }) => {
    const [itemTitle, setItemTitle] = useState('');
    const [itemAmount, setItemAmount] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (itemTitle && itemAmount) {
            onSave({ title: itemTitle, amount: parseFloat(itemAmount) });
            setItemTitle('');
            setItemAmount('');
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{title}</h3>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        value={itemTitle}
                        onChange={e => setItemTitle(e.target.value)}
                        placeholder="e.g. Travel Allowance"
                    />
                </div>
                <div className="form-group">
                    <label>Amount (Rs.)</label>
                    <input
                        type="number"
                        value={itemAmount}
                        onChange={e => setItemAmount(e.target.value)}
                        placeholder="e.g. 1500"
                        min="0"
                    />
                </div>
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
