"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar, MapPin, Search } from "lucide-react";
import { toast } from "sonner";

import { useSession } from "@/lib/auth-client";
import { fetchAPI } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [summary, setSummary] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [summaryData, recentData] = await Promise.all([
          fetchAPI("/dashboard/summary"),
          fetchAPI("/dashboard/recent-bookings"),
        ]);
        setSummary(summaryData.data);
        setRecentBookings(recentData.data);
      } catch (error) {
        toast.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    }
    
    if (!isPending && user) {
      loadDashboardData();
    } else if (!isPending && !user) {
      setLoading(false);
    }
  }, [user, isPending]);

  if (isPending || loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl flex-1 space-y-8">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center flex-1 text-center">
        <h2 className="text-2xl font-bold mb-4">Please login to view your profile</h2>
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl flex-1 space-y-8">
      {/* User Info Card */}
      <Card className="overflow-hidden shadow-sm">
        <div className="h-24 bg-muted border-b"></div>
        <CardContent className="p-6 relative">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start -mt-12">
            <Avatar className="h-24 w-24 border-4 border-background bg-background shadow-sm">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-3xl">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left mt-2 sm:mt-10">
              <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rooms Listed</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {summary?.totalRoomsOwned || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Bookings</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {summary?.totalBookingsMade || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Confirmed</CardDescription>
            <CardTitle className="text-3xl font-bold text-primary">
              {summary?.totalConfirmedBookings || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Cancelled</CardDescription>
            <CardTitle className="text-3xl font-bold text-muted-foreground">
              {summary?.totalCancelledBookings || 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-8">
        <Card className="shadow-sm">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your latest study room reservations.</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/my-bookings">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentBookings.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-medium">No recent bookings</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/rooms">Explore available rooms</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {recentBookings.map((booking) => {
                  const room = booking.room;
                  return (
                    <div key={booking._id} className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors hover:bg-muted/10">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{room?.roomName || "Unknown Room"}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {booking.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> Floor {room?.floor}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                        <Badge variant={booking.status === "cancelled" ? "destructive" : "secondary"}>
                          {booking.status}
                        </Badge>
                        <span className="text-sm font-medium">{booking.startTime} - {booking.endTime}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}