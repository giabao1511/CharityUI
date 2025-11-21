"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/typography";
import { Building2, Users, LayoutDashboard } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const quickLinks = [
    {
      title: "Organizations",
      description: "Create and manage platform organizations",
      href: "/admin/organizations",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Users",
      description: "Manage user accounts and permissions",
      href: "/admin/users",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Heading level={1} gutterBottom>
          Admin Dashboard
        </Heading>
        <p className="text-muted-foreground">
          Manage organizations, users, and platform settings
        </p>
      </div>

      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Welcome to Admin Panel</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Use the navigation on the left or quick links below to get started
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 ${link.bgColor} rounded-lg`}>
                          <Icon className={`h-6 w-6 ${link.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{link.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {link.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Manage {link.title}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Information */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Building2 className="h-4 w-4 mt-0.5 text-blue-600" />
              <div>
                <p className="font-medium">Organizations Management</p>
                <p className="text-muted-foreground">
                  Create new organizations, view all registered organizations, and manage their information
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 mt-0.5 text-green-600" />
              <div>
                <p className="font-medium">User Management</p>
                <p className="text-muted-foreground">
                  View all users, update user roles, edit user information, and manage user access
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
