import ReservationCard from "@/app/_components/ReservationCard";

export const metadata = {
  title: "Reservations",
};

type Booking = {
  id: string;
  guest_id: string;
  start_date: Date;
  end_date: Date;
  num_nights: number;
  total_price: number;
  num_guests: number;
  status: boolean;
  created_at: Date;
  cabins: { name: string; image: string };
};

const Page: React.FC = () => {
  // CHANGE
  const bookings: Booking[] = [];

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
        <ul className="space-y-6">
          {bookings.map((booking) => (
            <ReservationCard booking={booking} key={booking.id} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
