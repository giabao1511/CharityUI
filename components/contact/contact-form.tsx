"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("contact.form");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock form submission
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Missing Required Fields", {
        description:
          "Please fill in all required fields (Name, Email, and Message).",
      });
      return;
    }

    toast.success(t("success"), {
      description: t("successDesc"),
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>{t("sendUsaMessage")}</CardTitle>
        <CardDescription>{t("fillOut")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {t("name")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder={t("namePlaceholder")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                aria-required="true"
                aria-invalid={!formData.name && "true"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                {t("email")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                aria-required="true"
                aria-invalid={!formData.email && "true"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">{t("subject")}</Label>
            <Input
              id="subject"
              placeholder={t("subjectPlaceholder")}
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">
              {t("message")} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder={t("messagePlaceholder")}
              rows={6}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              aria-required="true"
              aria-invalid={!formData.message && "true"}
            />
          </div>

          <Button type="submit" size="lg">
            {t("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
