// Edited

import { CheckoutForm } from "@/components/checkout-form";
import { Header } from "@/components/header";

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 py-16 lg:py-24">
        <div className="container">
           <CheckoutForm />
        </div>
      </main>
    </div>
  );
}
