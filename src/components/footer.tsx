
"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";

export function Footer() {
  const { language } = useSettings();
  const t = getDictionary(language);

  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold text-foreground">
              {t.header.brand}
            </Link>
            <p className="mt-2 text-sm">
              {t.footer.tagline}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t.footer.company}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary">{t.footer.about}</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">{t.footer.privacy}</Link></li>
              <li><Link href="/support" className="hover:text-primary">{t.footer.support}</Link></li>
            </ul>
          </div>
          <div>
             <h3 className="font-semibold text-foreground">{t.footer.categories}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/new-parts" className="hover:text-primary">{t.header.newParts}</Link></li>
              <li><Link href="/used-parts" className="hover:text-primary">{t.header.usedParts}</Link></li>
              <li><Link href="/oem-parts" className="hover:text-primary">{t.header.oemParts}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t.footer.connect}</h3>
            <div className="flex mt-4 space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter / X</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {t.header.brand}. {t.footer.rightsReserved}</p>
        </div>
      </div>
    </footer>
  );
}
