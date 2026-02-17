// Edited

"use client";

import type { Part } from '@/lib/types';
import { ProductGrid } from './product-grid';
import { useSettings } from '@/context/settings-context';
import { getDictionary } from '@/lib/i18n';

export function ProductSection() {
    const { language } = useSettings();
    const t = getDictionary(language);
    
    return (
        <section className="py-16 lg:py-24">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.home.featuredInventory}</h2>
                    <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
                        {t.home.featuredDescription}
                    </p>
                </div>
                <ProductGrid />
            </div>
        </section>
    );
}
