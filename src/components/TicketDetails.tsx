import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';

const TicketDetails = () => {
  const location = useLocation();
  const { ticketId, resolutionTime, category, description, solution } = location.state || {};

  const saveAsImage = () => {
    const element = document.getElementById('ticket-details');
    html2canvas(element).then((canvas) => {
      const link = document.createElement('a');
      link.download = `ticket-${ticketId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  useEffect(() => {
    if (!ticketId) {
      alert('No ticket details available.');
    }
  }, [ticketId]);

  return (
    <div className="ticket-details" id="ticket-details">
      <h2>Ticket Details</h2>
      {ticketId ? (
        <div>
          <p><strong>Ticket ID:</strong> {ticketId}</p>
          <p><strong>Category:</strong> {category}</p>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Suggested Solution:</strong> {solution || "No solution available yet."}</p>
          <p><strong>Estimated Resolution Time:</strong> {resolutionTime} hours</p>
          <button onClick={saveAsImage}>Save as Image</button>
        </div>
      ) : (
        <p>No details available for this ticket.</p>
      )}
    </div>
  );
};

export default TicketDetails;
