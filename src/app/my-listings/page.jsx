"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, ExternalLink, MapPin } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/ConfirmDialog";

import { fetchAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, roomId: null });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchListings() {
      try {
        const data = await fetchAPI("/rooms/my-listings");
        setListings(data.data || []);
      } catch (error) {
        toast.error("Failed to load your listings.");
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  const confirmDelete = (roomId) => {
    setDeleteDialog({ isOpen: true, roomId });
  };

  const executeDelete = async () => {
    if (!deleteDialog.roomId) return;
    setIsDeleting(true);
    
    try {
      await fetchAPI(`/rooms/${deleteDialog.roomId}`, { method: "DELETE" });
      setListings((prev) => prev.filter((r) => r._id !== deleteDialog.roomId));
      toast.success("Listing deleted successfully.");
      setDeleteDialog({ isOpen: false, roomId: null });
    } catch (error) {
      toast.error(error.message || "Failed to delete listing.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl flex-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
          <p className="text-muted-foreground mt-1">Manage the study rooms you have listed.</p>
        </div>
        <Button asChild>
          <Link href="/add-room">
            <Plus className="mr-2 h-4 w-4" />
            Add New Room
          </Link>
        </Button>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              You haven&apos;t listed any study rooms yet. Start earning by listing your space.
            </p>
            <Button asChild variant="outline">
              <Link href="/add-room">List a Room</Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Room Details</TableHead>
                <TableHead>Rate/Hr</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((room) => (
                <TableRow key={room._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 bg-muted rounded-md overflow-hidden shrink-0 hidden sm:block">
                        <img 
                          src={room.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c"} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{room.roomName}</p>
                        <p className="text-xs text-muted-foreground">Floor {room.floor}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${room.hourlyRate}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">{room.capacity} people</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{room.bookingCount || 0} Bookings</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild title="View Details">
                        <Link href={`/rooms/${room._id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" title="Edit Listing" asChild>
                        <Link href={`/rooms/edit/${room._id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => confirmDelete(room._id)}
                        title="Delete Listing"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onOpenChange={(isOpen) => !isDeleting && setDeleteDialog(prev => ({ ...prev, isOpen }))}
        title="Delete Listing"
        description="Are you sure you want to delete this listing? This action cannot be undone."
        onConfirm={executeDelete}
        isConfirming={isDeleting}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
