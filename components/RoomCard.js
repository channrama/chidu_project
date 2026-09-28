export default function RoomCard({ room }) {
  return (
    <div className="room-card">
      <div className="room-card-header">
        <h3>
          {room.hostelName || 'Hostel'} - Room {room.roomNumber}
        </h3>
        <span className={`chip ${room.status === 'FULL' ? 'chip-danger' : 'chip-success'}`}>
          {room.status}
        </span>
      </div>
      <p>Block: {room.block}</p>
      <p>Floor: {room.floor}</p>
      <p>Capacity: {room.capacity}</p>
      <p>Available beds: {Math.max(room.capacity - room.occupants.length, 0)}</p>
      <p>Gender: {room.gender || 'Mixed'}</p>
    </div>
  );
}
