import Link from "next/link";
import { ArrowRight, BookOpen, Clock, ShieldCheck, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "StudyNook – About",
  description: "Learn more about StudyNook, our mission, and how our premium study room booking platform works.",
};

export default function AboutPage() {
  return (
    <div className="flex-1 w-full bg-background">
      {/* Hero Section */}
      <section className="relative py-24 border-b overflow-hidden bg-muted/20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Badge className="mb-4">About Us</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Redefining the <span className="text-muted-foreground">Study Experience</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            StudyNook is a premium library study room booking platform designed to provide students and professionals with distraction-free, high-quality focus spaces.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 border-b">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            In an increasingly noisy world, finding a quiet place to focus is a challenge. Our mission is to democratize access to premium study environments by seamlessly connecting individuals who need deep focus time with the best available library and private study rooms. We believe that your environment shapes your productivity.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/10 border-b">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Core Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to find, book, and manage your perfect study session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-2xl border shadow-sm flex gap-4">
              <div className="h-10 w-10 shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Room Listing</h3>
                <p className="text-muted-foreground">
                  Easily browse through hundreds of premium study rooms, filtering by amenities, capacity, and hourly rates to find exactly what you need.
                </p>
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl border shadow-sm flex gap-4">
              <div className="h-10 w-10 shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Smart Booking</h3>
                <p className="text-muted-foreground">
                  Our intelligent calendar system allows you to book rooms by the hour with instant confirmation and real-time availability updates.
                </p>
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl border shadow-sm flex gap-4">
              <div className="h-10 w-10 shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Conflict Prevention</h3>
                <p className="text-muted-foreground">
                  Never worry about double-bookings. Our strict validation engine ensures that overlapping time slots are mathematically impossible.
                </p>
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl border shadow-sm flex gap-4">
              <div className="h-10 w-10 shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Dashboard Management</h3>
                <p className="text-muted-foreground">
                  Manage your listings and upcoming reservations from a centralized, intuitive dashboard with one-click cancellation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 border-b">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started with StudyNook in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="relative">
              <div className="h-16 w-16 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4 z-10 relative">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">List or Browse</h4>
              <p className="text-sm text-muted-foreground">List your own space or browse available rooms.</p>
            </div>
            <div className="relative">
              <div className="h-16 w-16 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4 z-10 relative">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Select Time</h4>
              <p className="text-sm text-muted-foreground">Pick a date and a time slot that works for your schedule.</p>
            </div>
            <div className="relative">
              <div className="h-16 w-16 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4 z-10 relative">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Book Room</h4>
              <p className="text-sm text-muted-foreground">Confirm your reservation securely in seconds.</p>
            </div>
            <div className="relative">
              <div className="h-16 w-16 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4 z-10 relative">
                4
              </div>
              <h4 className="text-lg font-semibold mb-2">Focus</h4>
              <p className="text-sm text-muted-foreground">Arrive at your space and experience deep work.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Ready to find your perfect study space?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild className="h-12 px-8">
              <Link href="/rooms">Explore Rooms <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8">
              <Link href="/add-room">List Your Room</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Ensure Badge is properly imported inside the file or defined above.
import { Badge } from "@/components/ui/badge";
