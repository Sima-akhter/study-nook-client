import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, Shield, Star, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "StudyNook - Premium Study Room Booking",
  description: "Book premium library study rooms with ease.",
};

async function getLatestRooms() {
  try {
    const res = await fetch("http://localhost:5000/rooms/latest", { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to fetch latest rooms:", error);
    return [];
  }
}

export default async function Home() {
  const latestRooms = await getLatestRooms();

  return (
    <div className="flex-1 w-full bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 border-b">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <Badge variant="outline" className="mb-6 mx-auto">
            Welcome to the Future of Study
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">
            Focus Better. <br />
            <span className="text-muted-foreground">Book Your Perfect Space.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Premium library study rooms designed for deep focus and collaborative excellence. No distractions, just results.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="w-full sm:w-auto h-12 px-8">
              <Link href="/rooms">Explore Rooms <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto h-12 px-8">
              <Link href="/add-room">List Your Room</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Rooms Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Latest Spaces</h2>
              <p className="text-muted-foreground">Discover our most recently added study rooms.</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/rooms">View all <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestRooms.map((room) => (
              <Card key={room._id} className="flex flex-col overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={room.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c"}
                    alt={room.roomName}
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                      ${room.hourlyRate}/hr
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl line-clamp-1">{room.roomName}</CardTitle>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground gap-3 mt-2">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Floor {room.floor}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Up to {room.capacity}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {room.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(room.amenities) && room.amenities.slice(0, 3).map((amenity) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {Array.isArray(room.amenities) && room.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{room.amenities.length - 3}</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 mt-auto border-t p-4">
                  <Button className="w-full" variant="secondary" asChild>
                    <Link href={`/rooms/${room._id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link href="/rooms">View all spaces</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why StudyNook */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose StudyNook?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide the perfect environment for students and professionals who need dedicated focus time without distractions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/30">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Booking</h3>
              <p className="text-muted-foreground">Instant confirmation and secure management of all your study sessions.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/30">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Amenities</h3>
              <p className="text-muted-foreground">Every room is equipped with high-speed Wi-Fi, power outlets, and comfortable seating.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/30">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quiet Guaranteed</h3>
              <p className="text-muted-foreground">Strict noise policies ensure you get the deep focus time you paid for.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h4 className="text-4xl font-bold tracking-tight">500+</h4>
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Rooms Listed</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl font-bold tracking-tight">10k+</h4>
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Happy Users</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl font-bold tracking-tight">50k+</h4>
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Hours Booked</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl font-bold tracking-tight">4.9</h4>
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Ready to enhance your productivity?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of users who have upgraded their study and work sessions with StudyNook.
          </p>
          <Button size="lg" asChild className="h-12 px-8">
            <Link href="/register">Create Free Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
