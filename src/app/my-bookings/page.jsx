"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Calendar as CalendarIcon, Clock, MapPin, XCircle } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { fetchAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialog, setCancelDialog] = useState({ isOpen: false, bookingId: null });
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await fetchAPI("/bookings/my-bookings");
        setBookings(data.data || []);
      } catch (error) {
        toast.error("Failed to load your bookings.");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const confirmCancel = (bookingId) => {
    setCancelDialog({ isOpen: true, bookingId });
  };

  const executeCancel = async () => {
    if (!cancelDialog.bookingId) return;
    setIsCancelling(true);
    
    try {
      await fetchAPI(`/bookings/${cancelDialog.bookingId}/cancel`, { method: "PUT" });
      setBookings((prev) => 
        prev.map(b => b._id === cancelDialog.bookingId ? { ...b, status: 'Cancelled' } : b)
      );
      toast.success("Booking cancelled successfully.");
      setCancelDialog({ isOpen: false, bookingId: null });
    } catch (error) {
      toast.error(error.message || "Failed to cancel booking.");
    } finally {
      setIsCancelling(false);
    }
  };

  const isCancellable = (booking) => {
    if (booking.status === 'Cancelled') return false;
    
    // Check if the booking date is in the past
    const bookingDate = new Date(`${booking.date}T${booking.startTime}`);
    return bookingDate > new Date();
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl flex-1">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground mt-1">View and manage your upcoming and past study sessions.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl border-dashed bg-muted/30">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <CalendarIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            You haven't booked any study rooms yet. Find the perfect space to focus.
          </p>
          <Button asChild>
            <Link href="/rooms">Explore Rooms</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => {
            const room = booking.room;
            const cancellable = isCancellable(booking);
            
            return (
              <Card key={booking._id} className={`flex flex-col overflow-hidden ${booking.status === 'Cancelled' ? 'opacity-70' : ''}`}>
                <CardHeader className="pb-4 border-b bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{room?.roomName || "Deleted Room"}</CardTitle>
                      {room && (
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" /> Floor {room.floor}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant={booking.status === 'Cancelled' ? "destructive" : "secondary"}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 flex-1">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Date</p>
                        <p className="text-muted-foreground">{booking.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Time</p>
                        <p className="text-muted-foreground">{booking.startTime} - {booking.endTime}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 p-6 flex gap-3">
                  {room && (
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/rooms/${room._id}`}>View Room</Link>
                    </Button>
                  )}
                  {cancellable && (
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => confirmCancel(booking._id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={cancelDialog.isOpen}
        onOpenChange={(isOpen) => !isCancelling && setCancelDialog(prev => ({ ...prev, isOpen }))}
        title="Cancel Booking"
        description="Are you sure you want to cancel this booking? This action cannot be undone."
        onConfirm={executeCancel}
        isConfirming={isCancelling}
        confirmText="Cancel Booking"
        variant="destructive"
      />
    </div>
  );
}
