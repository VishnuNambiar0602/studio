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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParts } from "@/context/part-context";
import { createPart } from "@/lib/actions";

const addPartFormSchema = z.object({
  name: z.string().min(3, "Part name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  partNumber: z.string().min(1, "Part number is required."),
  quantity: z.coerce.number().int().positive("Quantity must be a positive number."),
  companyName: z.string().min(2, "Company name is required."),
  dateOfManufacture: z.date({
    required_error: "A date of manufacture is required.",
  }),
  price: z.coerce.number().positive("Price must be a positive number."),
  category: z.enum(["new", "used", "oem"], {
    required_error: "You need to select a part category.",
  }),
  image: z
    .any()
    .refine((files) => files?.length === 1, "Image is required.")
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (files) => ["image/jpeg", "image/png", "image/webp"].includes(files?.[0]?.type),
      "Only .jpg, .png, and .webp formats are supported."
    ),
});

type AddPartFormValues = z.infer<typeof addPartFormSchema>;

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export function AddPartForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { addPart } = useParts(); 

  const form = useForm<AddPartFormValues>({
    resolver: zodResolver(addPartFormSchema),
    defaultValues: {
      name: "",
      description: "",
      partNumber: "",
      companyName: "",
      price: 0,
      quantity: 1,
    }
  });

  const fileRef = form.register("image");

  async function onSubmit(data: AddPartFormValues) {
    setLoading(true);

    try {
        const imageUrl = await fileToDataUrl(data.image[0]);

        const newPartData = {
            name: data.name,
            description: data.description,
            price: data.price,
            imageUrl: imageUrl,
            inStock: data.quantity > 0,
            vendorAddress: data.companyName,
            category: data.category,
        };

        addPart({
            id: `temp-${Date.now()}`,
            ...newPartData,
            isVisibleForSale: true
        });

        await createPart(newPartData);
        
        toast({
            title: "Success!",
            description: "Part added successfully! It is now visible to customers.",
        });

        form.reset();

    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error",
            description: "Could not add the part. Please try again.",
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
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., AutoParts Inc." {...field} />
              </FormControl>
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
          render={({ field }) => (
            <FormItem className="space-y-3 md:col-span-2">
              <FormLabel>Part Category</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="new" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      New Part
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="used" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Used Part
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="oem" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      OEM Part
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Part Image</FormLabel>
              <FormControl>
                <Input type="file" accept="image/png, image/jpeg, image/webp" {...fileRef} />
              </FormControl>
               <FormDescription>
                Upload a clear image of the part (PNG, JPG, or WEBP, max 5MB).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Part
            </Button>
        </div>
      </form>
    </Form>
  );
}
