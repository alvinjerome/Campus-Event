// frontend/src/components/events/EventActions.jsx
import React from 'react';
import Button from '../common/Button';
import { FiEdit, FiTrash2, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const EventActions = ({ event, onEdit, onDelete, onRSVP }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isOrganizer = event.organizer?._id === user?.id;

  return (
    <div className="flex flex-wrap gap-3">
      {(isAdmin || isOrganizer) && (
        <>
          <Button
            variant="outline"
            icon={<FiEdit />}
            onClick={onEdit}
            size="small"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            icon={<FiTrash2 />}
            onClick={onDelete}
            size="small"
          >
            Delete
          </Button>
        </>
      )}
      <Button
        variant="primary"
        icon={<FiCalendar />}
        onClick={onRSVP}
        size="small"
      >
        RSVP
      </Button>
    </div>
  );
};

export default EventActions;