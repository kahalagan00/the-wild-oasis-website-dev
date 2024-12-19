"use client";

import { useOptimistic } from "react";
import ReservationCard from "./ReservationCard";
import { deleteBooking } from "../_lib/actions";

//JMARDEBUG: Type issue, fix later
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ReservationList = ({ bookings }) => {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      //JMARDEBUG: Type issue, fix later
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return curBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  const handleDelete = async (bookingId: string) => {
    optimisticDelete(bookingId);
    await deleteBooking(bookingId);
  };

  return (
    <ul className="space-y-6">
      {/* //JMARDEBUG: Type issue, fix later */}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*// @ts-ignore */}
      {optimisticBookings.map((booking) => (
        //JMARDEBUG: Type issue, fix later
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <ReservationCard
          onDelete={handleDelete}
          booking={booking}
          key={booking.id}
        />
      ))}
    </ul>
  );
};

export default ReservationList;
