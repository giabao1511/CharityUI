"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heading } from "@/components/ui/typography";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth-context";
import { createOrganization } from "@/lib/services/organization.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  orgName: z.string().min(3, "Organization name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
  address: z.string(),
  description: z.string(),
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  avatar: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateOrganizationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgName: "",
      email: "",
      phoneNumber: "",
      address: "",
      description: "",
      website: "",
      avatar: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to create an organization");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare data according to API requirements
      const organizationData = {
        orgName: values.orgName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: values.address,
        description: values.description,
        website: values.website || undefined,
        avatar: values.avatar || undefined,
        banks: [], // Empty array as banks are optional for now
      };

      const result = await createOrganization(organizationData);

      console.log(result)

      toast.success("Organization created successfully!", {
        description:
          "Your organization has been created and is pending approval.",
      });

      // Redirect to organizations page or organization detail
      router.push(`/organizations/${result?.organization.orgId}`);
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.error("Failed to create organization", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <Heading level={1} className="flex items-center gap-3">
          <Building2 className="h-8 w-8" />
          Create Organization
        </Heading>
        <p className="text-muted-foreground mt-2">
          Fill in the information below to create your organization. Your
          organization will be reviewed before activation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
          <CardDescription>
            Provide accurate information about your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Organization Name */}
              <FormField
                control={form.control}
                name="orgName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter organization name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contact@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="0912345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter organization address"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your organization's mission and activities"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum 50 characters. Describe your organization's
                      purpose and goals.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website */}
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Organization"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
