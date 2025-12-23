"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrganizationListItem } from "@/types/organization";
import { Building2, Edit, Eye, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OrganizationsTableProps {
  readonly organizations: OrganizationListItem[];
}

export function OrganizationsTable({ organizations }: OrganizationsTableProps) {
  const formatDate = (dateString: string | Date): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (organizations.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-semibold">No Organizations Found</p>
        <p className="text-sm text-muted-foreground mt-2">
          You haven&apos;t created any organizations yet
        </p>
        <Link href="/creator/organizations/new">
          <Button className="mt-4">Create Organization</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((org) => (
            <TableRow key={org.orgId}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  {org.avatar ? (
                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                      <Image
                        src={org.avatar}
                        alt={org.orgName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{org.orgName}</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {org.orgId}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {org.address || "N/A"}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="default">Active</Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">{formatDate(org.createdAt)}</div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/organizations/${org.orgId}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/creator/organizations/${org.orgId}/edit`}>
                    <Button size="sm" variant="default">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
