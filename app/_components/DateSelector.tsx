"use client";

import { isWithinInterval } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useReservation } from "./ReservationContext";
import { differenceInDays, isPast, isSameDay } from "date-fns";

type Cabin = {
  id: string;
  name: string;
  max_capacity: number;
  regular_price: number;
  discount: number;
  image: string;
};

type Settings = {
  id: number;
  created_at: Date;
  min_booking_length: number;
  max_booking_length: number;
  max_guests_per_booking: number;
  breakfast_price: number;
};

type Range = {
  from: Date | undefined;
  to: Date | undefined;
};

function isAlreadyBooked(range: Range, datesArr: Date[]) {
  return (
    range.from &&
    range.to &&
    datesArr.some((date: Date) =>
      //JMARDEBUG: Type issue, fix later
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      isWithinInterval(date, { start: range.from, end: range.to })
    )
  );
}

function DateSelector({
  settings,
  cabin,
  bookedDates,
}: {
  settings: Settings;
  cabin: Cabin;
  bookedDates: Date[];
}) {
  const { range, setRange, resetRange } = useReservation();

  const displayRange = isAlreadyBooked(range, bookedDates) ? {} : range;

  const { regular_price: regularPrice, discount } = cabin;

  //JMARDEBUG: Type issue, fix later
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const numNights = differenceInDays(range.to, range.from);

  const cabinPrice = numNights * (regularPrice - discount);

  const {
    min_booking_length: minBookingLength,
    max_booking_length: maxBookingLength,
  } = settings;

  console.log(bookedDates);

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        onSelect={(range) => setRange(range as Range)}
        //JMARDEBUG: Type issue, fix later
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        selected={displayRange}
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        disabled={(curDate) =>
          isPast(curDate) ||
          bookedDates.some((date) => isSameDay(date, curDate))
        }
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range.from || range.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
