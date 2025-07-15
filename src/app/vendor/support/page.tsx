
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy, Mail, Phone } from "lucide-react";

export default function VendorSupportPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Support</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              We're here to help. Reach out to us with any questions or issues.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-background rounded-lg border">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                    <h3 className="font-semibold">Email Support</h3>
                    <p className="text-sm text-muted-foreground">Get in touch via email for non-urgent matters.</p>
                    <a href="mailto:support@gulfcarx.com" className="text-sm text-primary font-medium hover:underline">
                        support@gulfcarx.com
                    </a>
                </div>
            </div>
             <div className="flex items-start space-x-4 p-4 bg-background rounded-lg border">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                    <h3 className="font-semibold">Phone Support</h3>
                    <p className="text-sm text-muted-foreground">Call us for immediate assistance during business hours (9am - 5pm GMT+4).</p>
                    <a href="tel:+96812345678" className="text-sm text-primary font-medium hover:underline">
                        +968 1234 5678
                    </a>
                </div>
            </div>
             <div className="flex items-start space-x-4 p-4 bg-background rounded-lg border">
                <LifeBuoy className="h-6 w-6 text-primary mt-1" />
                <div>
                    <h3 className="font-semibold">Help Center & FAQ</h3>
                    <p className="text-sm text-muted-foreground">Find answers to common questions in our comprehensive help center.</p>
                     <a href="#" className="text-sm text-primary font-medium hover:underline">
                        Visit Help Center
                    </a>
                </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
