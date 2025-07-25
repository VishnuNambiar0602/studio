// Edited

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { updatePart } from "@/lib/actions";
import type { Part } from "@/lib/types";
import { useParts } from "@/context/part-context";

const categories = ["new", "used", "oem"] as const;

// Schema for editing is slightly different, images are optional
const editPartFormSchema = z.object({
  name: z.string().min(3, "Part name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  partNumber: z.string().min(1, "Part number is required."),
  manufacturer: z.string().min(2, "Manufacturer is required."),
  quantity: z.coerce.number().int().positive("Quantity must be a positive number."),
  dateOfManufacture: z.date({
    required_error: "A date of manufacture is required.",
  }),
  price: z.coerce.number().positive("Price must be a positive number."),
  category: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one category.",
  }),
  // Images are optional on update, as they might not change them
  images: z
    .any()
    .optional()
});

type EditPartFormValues = z.infer<typeof editPartFormSchema>;

interface EditPartFormProps {
    part: Part;
    onUpdate: () => void;
}

export function EditPartForm({ part, onUpdate }: EditPartFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { updatePartInContext } = useParts();

  const form = useForm<EditPartFormValues>({
    resolver: zodResolver(editPartFormSchema),
    defaultValues: {
      name: part.name,
      description: part.description,
      partNumber: `SKU-${part.id.substring(0, 6)}`, // Mocking part number
      manufacturer: part.manufacturer,
      price: part.price,
      quantity: part.quantity,
      category: part.category,
      dateOfManufacture: new Date(), // Mocking date
    }
  });

  useEffect(() => {
    form.reset({
        name: part.name,
        description: part.description,
        partNumber: `SKU-${part.id.substring(0, 6)}`, // Mocking part number
        manufacturer: part.manufacturer,
        price: part.price,
        quantity: part.quantity,
        category: part.category,
        dateOfManufacture: new Date(), // Mocking date
    });
  }, [part, form]);

  async function onSubmit(data: EditPartFormValues) {
    setLoading(true);

    try {
        const updatedData: Part = {
            ...part,
            name: data.name,
            description: data.description,
            price: data.price,
            quantity: data.quantity,
            manufacturer: data.manufacturer,
            category: data.category as ('new' | 'used' | 'oem')[],
        };

        await updatePart(part.id, updatedData);
        updatePartInContext(updatedData); // Update client-side state
        
        toast({
            title: "Success!",
            description: "Part updated successfully.",
        });
        
        onUpdate(); // Close the dialog and trigger refresh

    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error",
            description: "Could not update the part. Please try again.",
        });
        console.error(error);
    } finally {
        setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="md:col-span-1">
              <FormLabel>Part Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Performance Air Filter" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="partNumber"
          render={({ field }) => (
            <FormItem className="md:col-span-1">
              <FormLabel>Part Number / SKU</FormLabel>
              <FormControl>
                <Input placeholder="e.g., PA-F-221" {...field} />
              </FormControl>
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
                <Textarea placeholder="Describe the part and its features..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufacturer</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Bosch, K&N, Denso" {...field} />
              </FormControl>
               <FormDescription>
                The company that manufactured the part.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfManufacture"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Manufacture</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1990-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price ($)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 75.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={() => (
            <FormItem className="space-y-3 md:col-span-2">
              <FormLabel>Part Category</FormLabel>
              <FormDescription>
                Select one or more categories that apply to the part.
              </FormDescription>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
                {categories.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="category"
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
                                  ? field.onChange([...(field.value || []), item])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {item === 'oem' ? 'OEM' : item} Part
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
        <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </div>
      </form>
    </Form>
  );
}
