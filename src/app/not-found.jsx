import Link from "next/link";
import { BookOpen, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <BookOpen className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-6xl font-extrabold tracking-tight mb-4">404</h1>
      <h2 className="text-2xl font-bold tracking-tight mb-2">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Oops! We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps never existed.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button asChild size="lg">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button variant="outline" asChild size="lg">
          <Link href="/rooms">
            <Search className="mr-2 h-4 w-4" />
            Explore Rooms
          </Link>
        </Button>
      </div>
    </div>
  );
}
