"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export const updateGuest = async (formData: FormData) => {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in");
  }

  const nationalID = formData.get("national_id");
  const nationality = formData.get("nationality");

  if (typeof nationalID !== "string") {
    throw new Error("National ID is missing or invalid.");
  }

  if (typeof nationality !== "string") {
    throw new Error("Nationality is missing or invalid.");
  }

  const [nationalityValue, countryFlag] = nationality.split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error("Please provide a valid national ID.");
  }

  const updateData = {
    nationality: nationalityValue,
    country_flag: countryFlag,
    national_id: nationalID,
  };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) {
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
};

export const deleteReservation = async (bookingId: string) => {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in");
  }

  // Make sure only user that owns the booking can delete it
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(bookingId)) {
    throw new Error("You are not allowed to delete this booking");
  }

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
};

export const updateBooking = async (formData: FormData) => {
  // 1) Authentication
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in");
  }

  // 2) Authorization
  const bookingId = Number(formData.get("bookingId"));
  // Make sure only user that owns the booking can delete it
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(bookingId)) {
    throw new Error("You are not allowed to update this booking");
  }

  // 3) Building update data
  const updateData = {
    num_guests: Number(formData.get("numGuests")),
    observations: formData.get("observations")?.slice(0, 1000),
  };

  // 4) Mutation
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  //  5) Error handling
  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  // 6) Revalidation (Should always happen before redirecting)
  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  // 7) Redirecting
  redirect("/account/reservations");
};

export const signInAction = async () => {
  await signIn("google", { redirectTo: "/account" });
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/" });
};
