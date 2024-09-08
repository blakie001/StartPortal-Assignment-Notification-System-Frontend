import React from 'react';

function SingleNotification({ message, read, onToggleRead }) {
    return (
        <div className="list-group-item d-flex justify-content-between align-items-center">
            <p className={`mb-0 ${read ? 'text-muted' : ''}`}>{message}</p>
            <button 
                className={`btn ${read ? 'btn-outline-secondary' : 'btn-outline-primary'}`} 
                onClick={!read ? onToggleRead : undefined}
                disabled={read} // Disabled the button if the notificatin is already read
            >
                {read ? 'Read' : 'Mark as read'}
            </button>
        </div>
    );
}

export default SingleNotification;
