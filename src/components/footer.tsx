
import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="text-xl font-bold text-foreground">
              GulfCarX
            </Link>
            <p className="mt-2 text-sm">
              Your source for high-quality auto parts in the desert region.
            </p>
          </div>
          <div className="md:col-span-1">
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/support" className="hover:text-primary">Support</Link></li>
            </ul>
          </div>
          <div className="md:col-span-1">
             <h3 className="font-semibold text-foreground">Part Categories</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/new-parts" className="hover:text-primary">New Parts</Link></li>
              <li><Link href="/used-parts" className="hover:text-primary">Used Parts</Link></li>
              <li><Link href="/oem-parts" className="hover:text-primary">OEM Parts</Link></li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h3 className="font-semibold text-foreground">Connect with Us</h3>
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
          <p>&copy; {new Date().getFullYear()} GulfCarX. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
