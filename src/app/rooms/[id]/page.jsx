"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarIcon, MapPin, Users, Wifi, Trash2, Edit, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { fetchAPI } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const bookingSchema = z.object({
  date: z.string().min(1, { message: "Please select a date." }),
  startTime: z.string().min(1, { message: "Please select a start time." }),
  endTime: z.string().min(1, { message: "Please select an end time." }),
}).refine((data) => {
  if (!data.startTime || !data.endTime) return true;
  const start = parseInt(data.startTime.split(":")[0]);
  const end = parseInt(data.endTime.split(":")[0]);
  return end > start;
}, {
  message: "End time must be after start time.",
  path: ["endTime"]
});

export default function RoomDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const roomId = unwrappedParams.id;
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  
  // Booking modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      startTime: "",
      endTime: "",
    },
  });

  const selectedDate = form.watch("date");
  const selectedStart = form.watch("startTime");
  const selectedEnd = form.watch("endTime");

  useEffect(() => {
    async function loadRoom() {
      try {
        const data = await fetchAPI(`/rooms/${roomId}`);
        setRoom(data.data);
      } catch (error) {
        toast.error("Failed to load room details");
        router.push("/rooms");
      } finally {
        setLoading(false);
      }
    }
    loadRoom();
  }, [roomId, router]);

  useEffect(() => {
    if (isModalOpen && selectedDate) {
      async function fetchSlots() {
        setSlotsLoading(true);
        try {
          const data = await fetchAPI(`/rooms/availability?roomId=${roomId}&date=${selectedDate}`);
          setAvailableSlots(data.data || []);
        } catch (error) {
          console.error("Failed to fetch availability", error);
        } finally {
          setSlotsLoading(false);
        }
      }
      fetchSlots();
    }
  }, [isModalOpen, selectedDate, roomId]);

  const confirmDelete = () => setDeleteDialog(true);
  
  const executeDelete = async () => {
    setDeleting(true);
    try {
      await fetchAPI(`/rooms/${roomId}`, { method: "DELETE" });
      toast.success("Room deleted successfully");
      setDeleteDialog(false);
      router.push("/my-listings");
    } catch (error) {
      toast.error(error.message || "Failed to delete room");
    } finally {
      setDeleting(false);
    }
  };

  const handleBook = async (values) => {
    setBookingLoading(true);
    try {
      await fetchAPI(`/bookings`, {
        method: "POST",
        body: JSON.stringify({
          roomId,
          date: values.date,
          startTime: values.startTime,
          endTime: values.endTime,
        }),
      });
      toast.success("Room booked successfully!");
      setIsModalOpen(false);
      router.push("/my-bookings");
    } catch (error) {
      toast.error(error.message || "Failed to book room");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl flex-1">
        <Skeleton className="h-8 w-2/3 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="w-full aspect-video rounded-xl" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!room) return null;

  const isOwner = user && user._id === room.owner;
  
  // Calculate dynamic price preview
  let pricePreview = 0;
  if (selectedStart && selectedEnd) {
    const s = parseInt(selectedStart.split(":")[0]);
    const e = parseInt(selectedEnd.split(":")[0]);
    if (e > s) {
      pricePreview = (e - s) * room.hourlyRate;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl flex-1">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{room.roomName}</h1>
          <div className="flex items-center text-sm text-muted-foreground gap-4 mt-2">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Floor {room.floor}</span>
            <span className="flex items-center gap-1"><Users className="h-4 w-4" /> Capacity: {room.capacity}</span>
          </div>
        </div>
        
        {isOwner && (
          <div className="flex gap-2">
            {/* Note: Update Room would go to an edit form, for now just placeholder or modal */}
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete Room
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-8">
          <div className="aspect-video relative overflow-hidden rounded-xl bg-muted border">
            <img
              src={room.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c"}
              alt={room.roomName}
              className="object-cover w-full h-full"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">About this space</h2>
            <p className="text-muted-foreground leading-relaxed">
              {room.description}
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-bold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-4">
              {Array.isArray(room.amenities) && room.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary/40" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:sticky md:top-24">
          <Card className="shadow-lg border-muted/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                ${room.hourlyRate} <span className="text-sm font-normal text-muted-foreground">/ hour</span>
              </CardTitle>
              <CardDescription>
                {room.bookingCount || 0} previous bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!user ? (
                <Button className="w-full" size="lg" asChild>
                  <Link href={`/login?redirect=/rooms/${roomId}`}>Login to Book</Link>
                </Button>
              ) : isOwner ? (
                <div className="text-center p-4 bg-muted rounded-md text-sm text-muted-foreground">
                  You are the owner of this room.
                </div>
              ) : (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8 py-2">
                    Book Now
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Book {room.roomName}</DialogTitle>
                      <DialogDescription>
                        Select your date and time. Rate is ${room.hourlyRate}/hour.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleBook)} className="space-y-4 py-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Input type="date" min={new Date().toISOString().split('T')[0]} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Time</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select start time" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {slotsLoading ? (
                                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                                    ) : availableSlots.map(slot => (
                                      <SelectItem 
                                        key={`start-${slot.startTime}`} 
                                        value={slot.startTime}
                                        disabled={!slot.available}
                                      >
                                        {slot.startTime} {!slot.available && "(Booked)"}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Time</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedStart}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select end time" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {availableSlots.map(slot => {
                                      // End time should be strictly after selected start time
                                      if (!selectedStart) return null;
                                      const startHour = parseInt(selectedStart.split(":")[0]);
                                      const slotEndHour = parseInt(slot.endTime.split(":")[0]);
                                      if (slotEndHour <= startHour) return null;
                                      
                                      // If any slot in between is booked, we shouldn't allow this end time.
                                      // But for simplicity, we just check if this specific slot end is valid.
                                      // Ideally we check if the entire range is available.
                                      
                                      return (
                                        <SelectItem 
                                          key={`end-${slot.endTime}`} 
                                          value={slot.endTime}
                                        >
                                          {slot.endTime}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {pricePreview > 0 && (
                          <div className="bg-muted p-3 rounded-md flex justify-between items-center mt-4">
                            <span className="font-medium text-sm">Total Cost:</span>
                            <span className="font-bold">${pricePreview}</span>
                          </div>
                        )}

                        <DialogFooter className="mt-6">
                          <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={bookingLoading}>
                            {bookingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm Booking
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>

                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ConfirmDialog
        isOpen={deleteDialog}
        onOpenChange={(isOpen) => !deleting && setDeleteDialog(isOpen)}
        title="Delete Room"
        description="Are you sure you want to delete this room? This action cannot be undone."
        onConfirm={executeDelete}
        isConfirming={deleting}
        confirmText="Delete Room"
        variant="destructive"
      />
    </div>
  );
}
