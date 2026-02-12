
"use client";

import { Header } from "@/components/header";
import { OrderHistory } from "@/components/order-history";
import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";

export default function MyOrdersPage() {
    const { language } = useSettings();
    const t = getDictionary(language);

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1">
                <section className="py-16 lg:py-24">
                    <div className="container">
                        <h1 className="text-3xl font-bold font-headline mb-8">{t.common.myOrdersTitle}</h1>
                        <Suspense fallback={<div>{t.common.loadingOrders}</div>}>
                            <OrderHistory />
                        </Suspense>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
