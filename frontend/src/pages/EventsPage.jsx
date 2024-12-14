import React from 'react';

const EventsPage = () => {
  return (
    <div className="events-page-container">
      <div className="page-header">
        <h1>Campus Events</h1>
        <p>Discover and join exciting events happening around campus</p>
      </div>

      <div className="content-container">
        <div className="events-filters">
          {/* Add your filter buttons/dropdowns here */}
        </div>
        
        <div className="events-grid">
          {/* Your event cards here */}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
