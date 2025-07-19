// Edited
import { CartView } from "@/components/cart-view";
import { Header } from "@/components/header";

export default function CartPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-16 lg:py-24">
          <div className="container">
            <CartView />
          </div>
        </section>
      </main>
    </div>
  );
}
