
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
import { Loader2, Sparkles, Upload, Camera } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useParts } from "@/context/part-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TakeSnap } from "./take-snap";

const FormSchema = z.object({
  partDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

export function AiPartSuggester() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const { parts } = useParts();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      partDescription: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema> | { partDescription: string }) => {
    if (!data.partDescription && !photoDataUri) {
        form.setError("partDescription", { type: "manual", message: "Please provide a description or an image." });
        return;
    }
    
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const availableParts = JSON.stringify(
        parts.map(({ id, name, description, price }) => ({ id, name, description, price }))
      );

      const response = await suggestParts({
        partDescription: data.partDescription || "The user has provided an image, please identify the part.",
        availableParts,
        photoDataUri: photoDataUri || undefined,
      });
      
      setResult(response.suggestedParts);
    } catch (e) {
      setError("An error occurred while suggesting parts. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-suggester" className="w-full py-16 lg:py-24 bg-accent/20">
      <div className="container">
        <Card className="max-w-3xl mx-auto shadow-lg border-2 border-primary/20">
          <CardHeader className="text-center p-8">
            <Sparkles className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-3xl font-bold font-headline mt-4">The Genie</CardTitle>
            <CardDescription className="text-md text-muted-foreground mt-2">
              Describe the part you need, or upload an image, and our AI will find the perfect match from our inventory.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
             <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="text">Describe Part</TabsTrigger>
                    <TabsTrigger value="image">Use Image</TabsTrigger>
                </TabsList>
                <TabsContent value="text">
                     <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="partDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Describe your part</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., 'A brake pad for a 2021 Lexus LX570, it should be OEM...'"
                                  className="resize-none"
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                For best results, include vehicle make, model, year, and any specific details. You can also use Arabic.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={loading} className="w-full" size="lg">
                          {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                          )}
                          Ask the Genie
                        </Button>
                      </form>
                    </Form>
                </TabsContent>
                 <TabsContent value="image">
                    <TakeSnap 
                        onGetSuggestion={onSubmit} 
                        setPhotoDataUri={setPhotoDataUri}
                        photoDataUri={photoDataUri}
                        loading={loading}
                    />
                </TabsContent>
            </Tabs>

            {result && (
              <div className="mt-8">
                <Alert>
                  <AlertTitle className="font-headline">Suggested Parts</AlertTitle>
                  <AlertDescription>
                    <pre className="whitespace-pre-wrap font-body text-sm">{result}</pre>
                  </AlertDescription>
                </Alert>
              </div>
            )}
             {error && (
              <div className="mt-8">
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
