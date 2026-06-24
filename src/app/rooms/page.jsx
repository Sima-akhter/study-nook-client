/* eslint-disable react-hooks/static-components */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Filter, MapPin, Search, Users, X } from "lucide-react";
import { useDebounce } from "use-debounce";

import { fetchAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const AMENITIES_LIST = [
  "Whiteboard",
  "Projector",
  "Wi-Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning",
];

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters state
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [amenities, setAmenities] = useState([]);
  const [floor, setFloor] = useState("all");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    async function loadRooms() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (debouncedSearch) queryParams.append("search", debouncedSearch);
        if (amenities.length > 0) queryParams.append("amenities", amenities.join(","));
        if (floor !== "all") queryParams.append("floor", floor);
        if (sort) {
          queryParams.append("sort", sort);
          queryParams.append("order", order);
        }

        const data = await fetchAPI(`/rooms?${queryParams.toString()}`);
        setRooms(data.data || []);
        setTotal(data.pagination?.total || 0);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    }
    loadRooms();
  }, [debouncedSearch, amenities, floor, sort, order]);

  const toggleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setAmenities([]);
    setFloor("all");
    setSort("createdAt");
    setOrder("desc");
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Sort By</h3>
        <Select
          value={`${sort}-${order}`}
          onValueChange={(val) => {
            const [s, o] = val.split("-");
            setSort(s);
            setOrder(o);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="hourlyRate-asc">Price: Low to High</SelectItem>
            <SelectItem value="hourlyRate-desc">Price: High to Low</SelectItem>
            <SelectItem value="capacity-desc">Capacity: Highest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Floor</h3>
        <Select value={floor} onValueChange={setFloor}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Floors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Floors</SelectItem>
            <SelectItem value="1">1st Floor</SelectItem>
            <SelectItem value="2">2nd Floor</SelectItem>
            <SelectItem value="3">3rd Floor</SelectItem>
            <SelectItem value="4">4th Floor</SelectItem>
            <SelectItem value="5">5th Floor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Amenities</h3>
        <div className="space-y-2">
          {AMENITIES_LIST.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={`filter-${amenity}`}
                checked={amenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <Label htmlFor={`filter-${amenity}`} className="text-sm font-normal">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl flex-1 flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore Rooms</h1>
          <p className="text-muted-foreground mt-1">Find and book the perfect study space.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rooms..."
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Sheet>
            <SheetTrigger className="md:hidden shrink-0 inline-flex items-center justify-center rounded-md border border-input bg-background h-10 w-10 hover:bg-accent hover:text-accent-foreground outline-none cursor-pointer">
              <Filter className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="mb-6">
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Narrow down your search</SheetDescription>
              </SheetHeader>
              <FiltersContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block w-64 shrink-0 sticky top-24">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <FiltersContent />
            </CardContent>
          </Card>
        </div>

        {/* Room Grid */}
        <div className="flex-1 w-full">
          <div className="mb-4 text-sm text-muted-foreground font-medium">
            Showing {total} {total === 1 ? 'room' : 'rooms'}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl border-dashed bg-muted/30">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
              <p className="text-muted-foreground max-w-sm mb-6">
                We couldn&apos;t find any rooms matching your current filters. Try adjusting your search criteria.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Card key={room._id} className="flex flex-col overflow-hidden transition-all hover:shadow-md">
                  <div className="aspect-4/3 relative overflow-hidden bg-muted">
                    <img
                      src={room.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c"}
                      alt={room.roomName}
                      className="object-cover w-full h-full transition-transform hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur font-medium">
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
                        <Badge key={amenity} variant="outline" className="text-xs bg-muted/50">
                          {amenity}
                        </Badge>
                      ))}
                      {Array.isArray(room.amenities) && room.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-muted/50">+{room.amenities.length - 3}</Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 mt-auto border-t p-4">
                    <Button className="w-full" asChild>
                      <Link href={`/rooms/${room._id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}