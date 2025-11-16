"use client";

import { Badge } from "@/components/ui/badge";
import { Heading, BodyText } from "@/components/ui/typography";
import { MapPin, Mail, Phone, Globe, Users } from "lucide-react";
import type { Organization } from "@/types/organization";
import { OrgStatusNames } from "@/types/organization";

interface OrganizationHeaderProps {
  readonly organization: Organization;
}

export function OrganizationHeader({ organization }: OrganizationHeaderProps) {
  const statusName = organization.status?.statusName || OrgStatusNames[organization.statusId] || "Unknown";
  const isActive = organization.statusId === 2;

  return (
    <div className="space-y-6">
      {/* Avatar and Name */}
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex-shrink-0">
          {organization.avatar ? (
            <img
              src={organization.avatar}
              alt={organization.orgName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Users className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Heading level={1} className="mb-0">{organization.orgName}</Heading>
            <Badge variant={isActive ? "default" : "secondary"}>
              {statusName}
            </Badge>
          </div>

          {organization.description && (
            <BodyText size="lg" muted className="mt-2">
              {organization.description}
            </BodyText>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {organization.address && (
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-muted-foreground">{organization.address}</p>
            </div>
          </div>
        )}

        {organization.email && (
          <div className="flex items-start gap-2">
            <Mail className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <a
                href={`mailto:${organization.email}`}
                className="text-sm text-primary hover:underline"
              >
                {organization.email}
              </a>
            </div>
          </div>
        )}

        {organization.phoneNumber && (
          <div className="flex items-start gap-2">
            <Phone className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <a
                href={`tel:${organization.phoneNumber}`}
                className="text-sm text-primary hover:underline"
              >
                {organization.phoneNumber}
              </a>
            </div>
          </div>
        )}

        {organization.website && (
          <div className="flex items-start gap-2">
            <Globe className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Website</p>
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Visit Website
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
