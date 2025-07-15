
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download } from "lucide-react";
import { getVendorBookings, completeBooking } from "@/lib/actions";
import type { Booking } from "@/lib/types";
import { useTransition } from "react";

export function VendorTaskTable() {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [isPending, startTransition] = useTransition();

  React.useEffect(() => {
    const fetchBookings = async () => {
      const data = await getVendorBookings();
      setBookings(data);
    };
    fetchBookings();
  }, []);

  const handleComplete = (bookingId: string) => {
    startTransition(async () => {
      await completeBooking(bookingId);
      // Refresh the list
      const data = await getVendorBookings();
      setBookings(data);
    });
  };

  const downloadCSV = () => {
    const headers = ["Booking ID", "Part Name", "Customer", "Booking Date", "Cost", "Status"];
    const rows = bookings.map(b => [
      b.id,
      b.partName,
      b.userName,
      new Date(b.bookingDate).toLocaleDateString(),
      `$${b.cost.toFixed(2)}`,
      b.status
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "bookings_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Customer Bookings</CardTitle>
                <CardDescription>
                Manage and track all requested part viewings.
                </CardDescription>
            </div>
            <Button onClick={downloadCSV} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download CSV
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Part Name</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Booking Date</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.partName}</TableCell>
                  <TableCell>{booking.userName}</TableCell>
                  <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                  <TableCell>${booking.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={booking.status === 'Pending' ? 'destructive' : 'secondary'}>
                        {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {booking.status === 'Pending' && (
                        <Button 
                            size="sm" 
                            onClick={() => handleComplete(booking.id)}
                            disabled={isPending}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Complete
                        </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
