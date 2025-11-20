import { Link } from "@/i18n/navigation";
import { Heart } from "lucide-react";
import { BodyText, Heading } from "@/components/ui/typography";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" fill="currentColor" aria-hidden="true" />
            <span className="text-xl font-bold">CharityHub</span>
          </Link>
            <BodyText size="sm" muted>
              Making a difference, one campaign at a time. Join thousands of people supporting causes that matter.
            </BodyText>
          </div>

          {/* Quick Links */}
          <div>
            <Heading level={3} className="mb-4 text-sm">Quick Links</Heading>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/campaigns" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Campaigns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <Heading level={3} className="mb-4 text-sm">Support</Heading>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Safety & Security
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <Heading level={3} className="mb-4 text-sm">Community</Heading>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CharityHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
