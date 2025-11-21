"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Building2, Plus, Edit } from "lucide-react";
import {
  getAdminOrganizations,
  createOrganization,
  updateOrganization,
  type AdminOrganization,
  type CreateOrganizationData,
} from "@/lib/services/admin.service";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const STATUS_MAP = {
  1: { label: "Pending", variant: "default" as const, color: "text-yellow-600" },
  2: { label: "Approved", variant: "default" as const, color: "text-green-600" },
  3: { label: "Rejected", variant: "destructive" as const, color: "text-red-600" },
};

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<AdminOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<AdminOrganization | null>(null);

  const limit = 10;

  const [formData, setFormData] = useState<CreateOrganizationData>({
    orgName: "",
    email: "",
    phoneNumber: "",
    address: "",
    description: "",
    website: "",
    avatar: "",
    banks: [
      {
        bankName: "",
        accountNumber: "",
        accountHolder: "",
        branch: "",
      },
    ],
  });

  const loadOrganizations = async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page,
        limit,
      };

      if (search) params.search = search;

      const data = await getAdminOrganizations(params);
      setOrganizations(data.organizations);
      setTotal(data.total);
    } catch (err) {
      console.error("Error loading organizations:", err);
      setError(err instanceof Error ? err.message : "Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations(1);
    setCurrentPage(1);
  }, [search]);

  const handleEdit = (org: AdminOrganization) => {
    setSelectedOrg(org);
    setFormData({
      orgName: org.orgName,
      email: org.email || "",
      phoneNumber: org.phoneNumber || "",
      address: org.address || "",
      description: org.description || "",
      website: org.website || "",
      avatar: org.avatar || "",
      banks: org.banks && org.banks.length > 0 ? org.banks : [
        {
          bankName: "",
          accountNumber: "",
          accountHolder: "",
          branch: "",
        },
      ],
    });
    setEditDialogOpen(true);
  };

  const handleCreate = async () => {
    try {
      setCreating(true);
      await createOrganization(formData);
      toast.success("Organization created successfully");
      setCreateDialogOpen(false);
      // Reset form
      setFormData({
        orgName: "",
        email: "",
        phoneNumber: "",
        address: "",
        description: "",
        website: "",
        avatar: "",
        banks: [
          {
            bankName: "",
            accountNumber: "",
            accountHolder: "",
            branch: "",
          },
        ],
      });
      loadOrganizations();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create organization");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedOrg) return;

    try {
      setCreating(true);
      await updateOrganization(selectedOrg.orgId, formData);
      toast.success("Organization updated successfully");
      setEditDialogOpen(false);
      loadOrganizations();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update organization");
    } finally {
      setCreating(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1} gutterBottom>
            Organizations
          </Heading>
          <p className="text-muted-foreground">
            Manage platform organizations
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
              <DialogDescription>
                Add a new organization to the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Organization Name *</Label>
                <Input
                  value={formData.orgName}
                  onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                  placeholder="Enter organization name"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="info@organization.org"
                />
              </div>
              <div>
                <Label>Phone Number *</Label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="0123456789"
                />
              </div>
              <div>
                <Label>Address *</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter full address"
                />
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter organization description"
                  rows={4}
                />
              </div>
              <div>
                <Label>Website</Label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.org"
                />
              </div>
              <div>
                <Label>Avatar URL</Label>
                <Input
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label>Bank Information *</Label>
                <div className="space-y-2 border p-4 rounded-lg">
                  <Input
                    value={formData.banks[0].bankName}
                    onChange={(e) => setFormData({
                      ...formData,
                      banks: [{ ...formData.banks[0], bankName: e.target.value }]
                    })}
                    placeholder="Bank Name"
                  />
                  <Input
                    value={formData.banks[0].accountNumber}
                    onChange={(e) => setFormData({
                      ...formData,
                      banks: [{ ...formData.banks[0], accountNumber: e.target.value }]
                    })}
                    placeholder="Account Number"
                  />
                  <Input
                    value={formData.banks[0].accountHolder}
                    onChange={(e) => setFormData({
                      ...formData,
                      banks: [{ ...formData.banks[0], accountHolder: e.target.value }]
                    })}
                    placeholder="Account Holder Name"
                  />
                  <Input
                    value={formData.banks[0].branch}
                    onChange={(e) => setFormData({
                      ...formData,
                      banks: [{ ...formData.banks[0], branch: e.target.value }]
                    })}
                    placeholder="Branch (optional)"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={creating}>
                  {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Organization
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
            <DialogDescription>
              Update organization information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Organization Name *</Label>
              <Input
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                placeholder="Enter organization name"
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@organization.org"
              />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="0123456789"
              />
            </div>
            <div>
              <Label>Address *</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter full address"
              />
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter organization description"
                rows={4}
              />
            </div>
            <div>
              <Label>Website</Label>
              <Input
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.org"
              />
            </div>
            <div>
              <Label>Avatar URL</Label>
              <Input
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label>Bank Information *</Label>
              <div className="space-y-2 border p-4 rounded-lg">
                <Input
                  value={formData.banks[0].bankName}
                  onChange={(e) => setFormData({
                    ...formData,
                    banks: [{ ...formData.banks[0], bankName: e.target.value }]
                  })}
                  placeholder="Bank Name"
                />
                <Input
                  value={formData.banks[0].accountNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    banks: [{ ...formData.banks[0], accountNumber: e.target.value }]
                  })}
                  placeholder="Account Number"
                />
                <Input
                  value={formData.banks[0].accountHolder}
                  onChange={(e) => setFormData({
                    ...formData,
                    banks: [{ ...formData.banks[0], accountHolder: e.target.value }]
                  })}
                  placeholder="Account Holder Name"
                />
                <Input
                  value={formData.banks[0].branch}
                  onChange={(e) => setFormData({
                    ...formData,
                    banks: [{ ...formData.banks[0], branch: e.target.value }]
                  })}
                  placeholder="Branch (optional)"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={creating}>
                {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Organization
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search organizations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Organizations Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Organizations List</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{total} total</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : organizations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No organizations found</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => {
                      const status = STATUS_MAP[org.statusId as keyof typeof STATUS_MAP];

                      return (
                        <TableRow key={org.orgId}>
                          <TableCell className="font-medium">{org.orgId}</TableCell>
                          <TableCell className="font-semibold">{org.orgName}</TableCell>
                          <TableCell>{org.email || "-"}</TableCell>
                          <TableCell>{org.phoneNumber || "-"}</TableCell>
                          <TableCell>
                            {org.website ? (
                              <a
                                href={org.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Visit
                              </a>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={status?.variant || "default"} className={status?.color}>
                              {status?.label || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(org.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(org)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * limit + 1} to{" "}
                    {Math.min(currentPage * limit, total)} of {total} organizations
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newPage = currentPage - 1;
                        setCurrentPage(newPage);
                        loadOrganizations(newPage);
                      }}
                      disabled={currentPage === 1 || loading}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newPage = currentPage + 1;
                        setCurrentPage(newPage);
                        loadOrganizations(newPage);
                      }}
                      disabled={currentPage === totalPages || loading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
