"use client";

import { useState, useTransition } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Button, 
  Input, 
  Badge, 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Textarea,
  useToast
} from "@kaitif/ui";
import { Search, MoreVertical, FileText, Filter, Download, AlertTriangle } from "lucide-react";
import { createWaiverVersionAction } from "@/app/actions";

interface WaiversClientPageProps {
  initialWaivers: any[]; // Using any for simplicity with complex relations
  stats: {
    total: number;
    active: number;
    expiringSoon: number;
  };
}

export default function WaiversClientPage({ 
  initialWaivers,
  stats
}: WaiversClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [waiverContent, setWaiverContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const filteredWaivers = initialWaivers.filter((waiver) => {
    const matchesSearch = 
      (waiver.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (waiver.user?.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? waiver.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleCreateVersion = async () => {
    startTransition(async () => {
      const result = await createWaiverVersionAction(waiverContent);
      if (result.success) {
        setIsCreateOpen(false);
        setWaiverContent("");
        toast({
          title: "Waiver updated",
          description: "New waiver version is now active.",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Waivers</h1>
          <p className="text-[#F5F5F0]/60">
            Manage liability waivers and view signed documents.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Update Waiver Version
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Waiver Agreement</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Textarea 
                placeholder="Enter new waiver legal text..." 
                className="min-h-[300px]"
                value={waiverContent}
                onChange={(e) => setWaiverContent(e.target.value)}
              />
              <p className="text-xs text-[#F5F5F0]/40 mt-2">
                Creating a new version will require all users to re-sign upon next login.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateVersion} disabled={isPending || !waiverContent}>
                Publish New Version
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Waivers</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-[#F5F5F0]/60">Currently valid</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringSoon}</div>
            <p className="text-xs text-[#F5F5F0]/60">Within 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Signed</CardTitle>
            <FileText className="h-4 w-4 text-[#00E6E6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-[#F5F5F0]/60">Historical total</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Signed Waivers</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F5F5F0]/40" />
                <Input 
                  placeholder="Search waivers..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("ACTIVE")}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("EXPIRED")}>
                    Expired
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#F5F5F0]/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F5F5F0]/10 bg-[#F5F5F0]/5">
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">User</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Version</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Guardian</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Signed</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Expires</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-[#F5F5F0]/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWaivers.map((waiver) => (
                  <tr key={waiver.id} className="border-b border-[#F5F5F0]/10 hover:bg-[#F5F5F0]/5 transition-colors">
                    <td className="p-4 align-middle">
                      <div className="font-bold">{waiver.user?.name || "Unknown"}</div>
                      <div className="text-xs text-[#F5F5F0]/60">{waiver.user?.email}</div>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge variant="outline">v{waiver.waiverVersion?.version}</Badge>
                    </td>
                    <td className="p-4 align-middle text-[#F5F5F0]/60">
                      {waiver.guardianName || "-"}
                    </td>
                    <td className="p-4 align-middle">
                      <Badge variant={waiver.status === "ACTIVE" ? "success" : "destructive"}>
                        {waiver.status}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-[#F5F5F0]/60">
                      {new Date(waiver.signedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle text-[#F5F5F0]/60">
                      {new Date(waiver.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Document</DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
