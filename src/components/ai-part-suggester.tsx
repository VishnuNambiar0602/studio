"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import { suggestParts } from "@/ai/flows/suggest-parts-from-request";
import { parts as availablePartsData } from "@/lib/data";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const FormSchema = z.object({
  partDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

export function AiPartSuggester() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      partDescription: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const availableParts = JSON.stringify(
        availablePartsData.map(({ id, name, description, price }) => ({ id, name, description, price }))
      );

      const response = await suggestParts({
        partDescription: data.partDescription,
        availableParts,
      });
      
      setResult(response.suggestedParts);
    } catch (e) {
      setError("An error occurred while suggesting parts. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full py-12 lg:py-20 bg-accent/40">
      <div className="container">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold font-headline">AI Part Suggester</CardTitle>
            <CardDescription className="text-md">
              Can't find what you're looking for? Describe the part you need, and our AI will find the best match.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="partDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Part Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'I need a brake pad for a 2018 Toyota Camry, it should be ceramic...'"
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Be as descriptive as possible for the best results.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Find My Part
                </Button>
              </form>
            </Form>

            {result && (
              <div className="mt-6">
                <Alert>
                  <AlertTitle className="font-headline">Suggested Parts</AlertTitle>
                  <AlertDescription>
                    <pre className="whitespace-pre-wrap font-body text-sm">{result}</pre>
                  </AlertDescription>
                </Alert>
              </div>
            )}
             {error && (
              <div className="mt-6">
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
