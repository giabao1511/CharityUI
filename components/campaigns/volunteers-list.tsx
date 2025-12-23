"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Heart } from "lucide-react";
import { Heading, BodyText } from "@/components/ui/typography";
import { Volunteer } from "@/types/fund";

interface VolunteersListProps {
  volunteers: Volunteer[];
}

export function VolunteersList({ volunteers }: VolunteersListProps) {
  if (volunteers.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BodyText muted>
            No volunteers yet. Be the first to volunteer for this campaign!
          </BodyText>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <Heading level={3}>Active Volunteers</Heading>
        <Badge variant="secondary">
          {volunteers.length}{" "}
          {volunteers.length === 1 ? "volunteer" : "volunteers"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {volunteers.map((volunteer) => (
          <Card
            key={volunteer.registrationId}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>

                {/* Volunteer info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <BodyText weight="semibold" className="truncate">
                      {`${volunteer.userInfo.firstName} ${volunteer.userInfo.lastName}`}
                    </BodyText>
                    <Heart className="h-4 w-4 text-red-500 fill-red-500 flex-shrink-0" />
                  </div>

                  {/* Skills */}
                  {volunteer.skills && volunteer.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {volunteer.skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {volunteer.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{volunteer.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Availability */}
                  {volunteer.availability && (
                    <BodyText size="sm" muted className="mb-2">
                      {volunteer.availability}
                    </BodyText>
                  )}

                  {/* Registered date */}
                  <BodyText size="sm" muted>
                    Joined{" "}
                    {new Date(volunteer.registeredAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </BodyText>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
