"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { fetchAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const AMENITIES_LIST = [
  "Whiteboard",
  "Projector",
  "Wi-Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning",
];

const editRoomSchema = z.object({
  roomName: z.string().min(2, { message: "Room name must be at least 2 characters." }),
  floor: z.coerce.number().min(0, { message: "Floor cannot be negative." }),
  capacity: z.coerce.number().min(1, { message: "Capacity must be at least 1." }),
  hourlyRate: z.coerce.number().min(1, { message: "Rate must be at least 1." }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  amenities: z.array(z.string()).min(1, { message: "Please select at least one amenity." }),
});

export default function EditRoomPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const roomId = resolvedParams.id;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const form = useForm({
    resolver: zodResolver(editRoomSchema),
    defaultValues: {
      roomName: "",
      floor: "",
      capacity: "",
      hourlyRate: "",
      imageUrl: "",
      description: "",
      amenities: [],
    },
  });

  useEffect(() => {
    async function getRoomDetails() {
      try {
        const data = await fetchAPI(`/rooms/${roomId}`);
        const room = data.data;
        if (room) {
          form.reset({
            roomName: room.roomName || "",
            floor: room.floor ?? "",
            capacity: room.capacity ?? "",
            hourlyRate: room.hourlyRate ?? "",
            imageUrl: room.imageUrl || "",
            description: room.description || "",
            amenities: Array.isArray(room.amenities) ? room.amenities : [],
          });
        }
      } catch (error) {
        toast.error("Failed to fetch room details.");
        router.push("/my-listings");
      } finally {
        setFetching(false);
      }
    }
    getRoomDetails();
  }, [roomId, form, router]);

  async function onSubmit(values) {
    setLoading(true);
    try {
      await fetchAPI(`/rooms/${roomId}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      });

      toast.success("Room updated successfully!");
      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to update room");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl flex-1">
        <Skeleton className="h-[600px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl flex-1">
      <Card className="shadow-lg border-muted/50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight">Edit Room</CardTitle>
          <CardDescription>
            Update the details for your study room listing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="roomName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Room Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Conference Room A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Floor Level</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Rate ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 15" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amenities"
                  render={() => (
                    <FormItem className="md:col-span-2">
                      <div className="mb-4">
                        <FormLabel className="text-base">Amenities</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {AMENITIES_LIST.map((item) => (
                          <FormField
                            key={item}
                            control={form.control}
                            name="amenities"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {item}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the space, natural light, noise levels, etc." 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4 border-t gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="px-8">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
