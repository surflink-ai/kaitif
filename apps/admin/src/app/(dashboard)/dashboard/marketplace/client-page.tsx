"use client";

import { useTransition, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Button, 
  Input, 
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  useToast
} from "@kaitif/ui";
import { Search, ShoppingBag, Flag, AlertTriangle, ExternalLink } from "lucide-react";
import { removeListingAdminAction, updateReportStatusAction } from "@/app/actions";
import { ListingWithRelations } from "@kaitif/db";

interface MarketplaceClientPageProps {
  initialListings: ListingWithRelations[];
  initialReports: any[]; // Using any for now as report type is complex with joins
  stats: {
    activeListings: number;
    flaggedItems: number;
    volume: number;
    fees: number;
  };
}

export default function MarketplaceClientPage({ 
  initialListings,
  initialReports,
  stats
}: MarketplaceClientPageProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredListings = initialListings.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveListing = async (id: string) => {
    if (!confirm("Are you sure you want to remove this listing?")) return;

    startTransition(async () => {
      const result = await removeListingAdminAction(id);
      if (result.success) {
        toast({
          title: "Listing removed",
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

  const handleUpdateReport = async (id: string, status: "REVIEWED" | "DISMISSED") => {
    startTransition(async () => {
      const result = await updateReportStatusAction(id, status);
      if (result.success) {
        toast({
          title: `Report ${status.toLowerCase()}`,
          variant: "success",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Marketplace</h1>
          <p className="text-[#F5F5F0]/60">
            Moderate listings and manage reported items.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <ShoppingBag className="h-4 w-4 text-[#FFCC00]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeListings}</div>
            <p className="text-xs text-[#F5F5F0]/60">Total volume ${(stats.volume / 100).toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Items</CardTitle>
            <Flag className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.flaggedItems}</div>
            <p className="text-xs text-[#F5F5F0]/60">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
            <div className="h-4 w-4 text-[#00E6E6] font-bold">$</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.fees / 100).toFixed(2)}</div>
            <p className="text-xs text-[#F5F5F0]/60">Total earned</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="listings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="listings">All Listings</TabsTrigger>
          <TabsTrigger value="flagged">
            Flagged
            <Badge variant="destructive" className="ml-2">
              {initialReports.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Listings</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F5F5F0]/40" />
                  <Input 
                    placeholder="Search listings..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-[#F5F5F0]/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#F5F5F0]/10 bg-[#F5F5F0]/5">
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Item</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Category</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Seller</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Price</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Status</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-[#F5F5F0]/60">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredListings.map((item) => (
                      <tr key={item.id} className="border-b border-[#F5F5F0]/10 hover:bg-[#F5F5F0]/5 transition-colors">
                        <td className="p-4 align-middle font-bold">{item.title}</td>
                        <td className="p-4 align-middle">
                          <Badge variant="outline">{item.category}</Badge>
                        </td>
                        <td className="p-4 align-middle">{item.seller?.name || "Unknown"}</td>
                        <td className="p-4 align-middle font-mono">${(item.price / 100).toFixed(2)}</td>
                        <td className="p-4 align-middle">
                          <Badge variant={item.status === "ACTIVE" ? "success" : "secondary"}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveListing(item.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged">
          {initialReports.length === 0 ? (
             <div className="text-center py-12 text-[#F5F5F0]/40">
               No flagged items.
             </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {initialReports.map((report) => (
                <Card key={report.id} className="border-red-500/50">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="destructive">Reported</Badge>
                      <span className="text-xs text-[#F5F5F0]/40">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-lg mt-2">{report.listing.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-red-500/10 rounded-md border border-red-500/20">
                      <div className="flex items-center gap-2 text-red-500 font-bold mb-1">
                        <AlertTriangle className="h-4 w-4" />
                        {report.reason}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#F5F5F0]/60">Seller: <span className="text-[#F5F5F0] font-bold">{report.listing.seller?.name || "Unknown"}</span></span>
                      <span className="font-mono font-bold">${(report.listing.price / 100).toFixed(2)}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white border-red-500"
                        onClick={() => handleRemoveListing(report.listing.id)}
                        disabled={isPending}
                      >
                        Remove Listing
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="flex-1"
                        onClick={() => handleUpdateReport(report.id, "DISMISSED")}
                        disabled={isPending}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
