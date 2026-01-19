"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  DropdownMenuSeparator
} from "@kaitif/ui";
import { Search, MoreVertical, Ticket, Filter, Scan, Download } from "lucide-react";
import Link from "next/link";
import { PassWithRelations } from "@kaitif/db";

interface PassesClientPageProps {
  passes: PassWithRelations[];
  totalCount: number;
}

export default function PassesClientPage({ passes, totalCount }: PassesClientPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState<string | null>(searchParams.get("status") || null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set("search", searchQuery);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      router.push(`?${params.toString()}`);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, router, searchParams]);

  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
    const params = new URLSearchParams(searchParams.toString());
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const formatPrice = (cents: number | undefined) => {
    // If undefined or null, default to 0
    if (cents == null) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Passes</h1>
          <p className="text-[#F5F5F0]/60">
            Manage active passes and view purchase history.
          </p>
        </div>
        <Link href="/dashboard/scan">
          <Button size="lg" className="bg-[#00E6E6] text-[#080808] hover:bg-[#33EBEB] border-[#00E6E6]">
            <Scan className="h-5 w-5 mr-2" />
            Open Scanner
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder for summary cards, logic needs real aggregation which is heavy, 
            so we'll leave them static or hide for now to focus on the list */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Passes</CardTitle>
            <Ticket className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-[#F5F5F0]/60">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pass Management ({totalCount})</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F5F5F0]/40" />
                <Input 
                  placeholder="Search barcode..." 
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
                  <DropdownMenuItem onClick={() => handleStatusFilter(null)}>All Statuses</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter("ACTIVE")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter("EXPIRED")}>Expired</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter("CANCELLED")}>Cancelled</DropdownMenuItem>
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
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Barcode</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">User</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Type</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Expires</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-[#F5F5F0]/60">Price</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-[#F5F5F0]/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {passes.length === 0 ? (
                    <tr><td colSpan={7} className="p-4 text-center text-muted-foreground">No passes found</td></tr>
                ) : passes.map((pass) => (
                  <tr key={pass.id} className="border-b border-[#F5F5F0]/10 hover:bg-[#F5F5F0]/5 transition-colors">
                    <td className="p-4 align-middle font-mono text-[#FFCC00]">
                      {pass.barcodeId}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="font-bold">{pass.user?.name || "Unknown User"}</div>
                      <div className="text-xs text-[#F5F5F0]/60">{pass.user?.email}</div>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge variant="outline">{pass.type}</Badge>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge variant={
                        pass.status === "ACTIVE" ? "success" : 
                        pass.status === "EXPIRED" ? "secondary" : "destructive"
                      }>
                        {pass.status}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-[#F5F5F0]/60">
                      {new Date(pass.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle text-right">
                       {/* Pass model doesn't store price. We should probably calculate or store it.
                           For now, we'll omit or put a placeholder if it's not in the model.
                           I recall PassType constant has prices but Pass model doesn't have `price` field in schema.
                           Wait, mock data had price. Schema does NOT have price.
                           I'll assume standard price based on type.
                           Or just remove the price column for now to avoid confusion.
                           Actually, I'll remove the Price column for now.
                       */}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
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
