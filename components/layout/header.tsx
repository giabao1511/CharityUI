"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { NotificationDropdown } from "@/components/layout/notification-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Heart, LayoutDashboard, Menu, User, Wallet, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FriendRequestDropdown } from "./friend-request-dropdown copy";

export function Header() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  // Role types
  const roleType = {
    User: 1,
    Admin: 2,
    Organization: 3,
    MemberOfOrganization: 4,
  };

  // Check if user has Organization or MemberOfOrganization role
  const hasCreatorRole =
    user?.roles?.some(
      (userRole) =>
        userRole.role.roleId === roleType.Organization ||
        userRole.role.roleId === roleType.MemberOfOrganization
    ) ?? false;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Heart
            className="h-6 w-6 text-primary"
            fill="currentColor"
            aria-hidden="true"
          />
          <span className="text-xl font-bold">CharityHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center space-x-6"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/")
                ? "text-primary font-semibold"
                : "text-muted-foreground"
            )}
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/campaigns"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/campaigns")
                ? "text-primary font-semibold"
                : "text-muted-foreground"
            )}
          >
            {t("nav.campaigns")}
          </Link>
          <Link
            href="/organizations"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/organizations")
                ? "text-primary font-semibold"
                : "text-muted-foreground"
            )}
          >
            {t("nav.organizations")}
          </Link>
          <Link
            href="/contact"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/contact")
                ? "text-primary font-semibold"
                : "text-muted-foreground"
            )}
          >
            {t("nav.contact")}
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          {user && <FriendRequestDropdown />}
          {user && <NotificationDropdown />}
          {user ? (
            <UserMenu />
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth">
                <User className="h-4 w-4 mr-2" aria-hidden="true" />
                {t("nav.signIn")}
              </Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href="/campaigns">{t("nav.startFundraiser")}</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          {user && <NotificationDropdown />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav
            className="container py-4 space-y-4"
            aria-label="Mobile navigation"
          >
            <Link
              href="/"
              className={cn(
                "block px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md",
                isActive("/")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/campaigns"
              className={cn(
                "block px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md",
                isActive("/campaigns")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.campaigns")}
            </Link>
            <Link
              href="/organizations"
              className={cn(
                "block px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md",
                isActive("/organizations")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.organizations")}
            </Link>
            <Link
              href="/contact"
              className={cn(
                "block px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md",
                isActive("/contact")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.contact")}
            </Link>
            <Link
              href="/profile"
              className={cn(
                "block px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md",
                isActive("/profile")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.profile")}
            </Link>
            {user && (
              <Link
                href="/wallet"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md",
                  isActive("/wallet")
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Wallet className="h-4 w-4" />
                {t("nav.wallet")}
              </Link>
            )}
            {hasCreatorRole && (
              <Link
                href="/creator"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md",
                  isActive("/creator")
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4" />
                Creator
              </Link>
            )}
            <div className="pt-4 border-t space-y-2">
              {user ? (
                <div className="px-4">
                  <UserMenu />
                </div>
              ) : (
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <User className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t("nav.signIn")}
                  </Link>
                </Button>
              )}
              <Button asChild size="sm" className="w-full">
                <Link
                  href="/campaigns"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.startFundraiser")}
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
