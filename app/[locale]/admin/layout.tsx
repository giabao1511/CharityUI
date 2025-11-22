"use client";

import { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useAdminCheck } from "@/lib/hooks/useAdminCheck";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, LayoutDashboard, Building2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { checking, isAdmin } = useAdminCheck();
  const pathname = usePathname();
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");

  const adminNav = [
    {
      title: t("dashboard.title"),
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: t("organizations.title"),
      href: "/admin/organizations",
      icon: Building2,
    },
    {
      title: t("users.title"),
      href: "/admin/users",
      icon: Users,
    },
  ];

  // Show loading state while checking admin status
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                {tCommon("loading")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not admin, useAdminCheck hook will redirect
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
        <div className="flex h-full flex-col gap-2">
          {/* Admin Header */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <LayoutDashboard className="h-6 w-6" />
              <span>{t("dashboard.welcome")}</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              ← {tCommon("back")}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64">
        <div className="container py-8">{children}</div>
      </main>
    </div>
  );
}
