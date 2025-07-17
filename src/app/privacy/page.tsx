import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 py-16 lg:py-24">
        <div className="container max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
                <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
                <CardTitle className="mt-4 text-3xl">Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="mt-6 space-y-4 text-muted-foreground prose max-w-none">
                <p>This is a placeholder for your privacy policy. In a real application, you would detail how you collect, use, and protect your users' data.</p>
                
                <h3 className="font-semibold text-foreground pt-4">Information We Collect</h3>
                <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact customer support. This may include your name, email address, shipping address, and payment information.</p>
                
                <h3 className="font-semibold text-foreground pt-4">How We Use Information</h3>
                <p>We use the information we collect to process transactions, provide customer service, improve our services, and communicate with you about products, services, and promotions.</p>

                <h3 className="font-semibold text-foreground pt-4">Data Security</h3>
                <p>We implement a variety of security measures to maintain the safety of your personal information. All payment transactions are processed through a gateway provider and are not stored or processed on our servers.</p>

                 <h3 className="font-semibold text-foreground pt-4">Your Consent</h3>
                <p>By using our site, you consent to our web site privacy policy.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
