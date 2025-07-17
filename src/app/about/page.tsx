import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 py-16 lg:py-24">
        <div className="container max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Building2 className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="mt-4 text-3xl">About Us</CardTitle>
            </CardHeader>
            <CardContent className="mt-6 space-y-6 text-muted-foreground prose prose-lg max-w-none">
              <p>
                Welcome to Desert Drive Depot, your premier destination for high-quality automotive parts in the heart of the desert. Established in 2024, our mission is to provide car enthusiasts, mechanics, and everyday drivers with reliable, affordable, and accessible parts.
              </p>
              <p>
                Our innovative platform leverages cutting-edge AI to help you find the exact part you need, whether it's new, used, or OEM. We partner with a network of trusted local vendors to ensure a wide selection and fast availability.
              </p>
              <p>
                At Desert Drive Depot, we're more than just a marketplace; we're a community built on a passion for all things automotive. We are committed to customer satisfaction, quality assurance, and driving the future of the auto parts industry.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
