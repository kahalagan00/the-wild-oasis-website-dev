import ReservationList from "@/app/_components/ReservationList";
import { auth } from "@/app/_lib/auth";
import { getBookings } from "@/app/_lib/data-service";

export const metadata = {
  title: "Reservations",
};

// type Booking = {
//   id: string;
//   guest_id: number;
//   start_date: Date;
//   end_date: Date;
//   num_nights: number;
//   total_price: number;
//   num_guests: number;
//   status: boolean;
//   created_at: Date;
//   cabins: { name: string; image: string };
// };

const Page: React.FC = async () => {
  // CHANGE
  const session = await auth();
  const bookings = await getBookings(session?.user.guestId);

  return (
    <div>
      {bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{" "}
          <a className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </a>
        </p>
      ) : (
        <ReservationList bookings={bookings} />
      )}
    </div>
  );
};

export default Page;
