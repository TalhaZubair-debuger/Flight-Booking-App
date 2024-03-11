import React from "react";

const Seat = React.memo(({ seat, handleAddSeatsToBooking, selectedSeats }) => {
  
  return (
    <div
      onClick={
        seat.bookingStatus === true
          ? null
          : () => handleAddSeatsToBooking(seat._id)
      }
      className={`seat ${
        seat.bookingStatus === true
          ? "disable-and-orange"
          : selectedSeats.includes(seat._id)
          ? "blue"
          : null
      }`}
      key={seat._id}
    >
      {seat.seatNumber}
    </div>
  );
});

export default Seat;
