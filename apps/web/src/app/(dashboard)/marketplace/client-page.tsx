"use client";

import { useState } from "react";
import { Card, CardContent, Button, Badge, Input, formatPrice, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Textarea, useToast } from "@kaitif/ui";
import { Search, Plus, Filter, ShoppingBag, Heart, Star, Store, Loader2 } from "lucide-react";
import { LISTING_CATEGORIES, CONDITION_LABELS, ListingWithRelations, Transaction } from "@kaitif/db";
import { useRouter } from "next/navigation";

type ListingCategory = keyof typeof LISTING_CATEGORIES;
type Condition = keyof typeof CONDITION_LABELS;

interface MarketplaceClientPageProps {
  listings: ListingWithRelations[];
  userStripeAccountId: string | null;
  userId: string;
}

export default function MarketplaceClientPage({
  listings,
  userStripeAccountId,
  userId,
}: MarketplaceClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ListingCategory | "ALL">("ALL");
  const [isListingOpen, setIsListingOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [listingForm, setListingForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "SKATEBOARD",
    condition: "GOOD",
    imageUrl: "",
  });

  const handleStartSelling = async () => {
    if (userStripeAccountId) {
      setIsListingOpen(true);
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({ title: "Error", description: "Could not start seller onboarding", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const priceInCents = Math.round(parseFloat(listingForm.price) * 100);
      
      const res = await fetch("/api/marketplace/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...listingForm,
          price: priceInCents,
          images: listingForm.imageUrl ? [listingForm.imageUrl] : [],
        }),
      });

      if (!res.ok) throw new Error("Failed to create listing");

      toast({ title: "Success", description: "Item listed for sale!" });
      setIsListingOpen(false);
      setListingForm({ title: "", description: "", price: "", category: "SKATEBOARD", condition: "GOOD", imageUrl: "" });
      router.refresh();
    } catch (error) {
      toast({ title: "Error", description: "Failed to create listing", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBuy = async (listingId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/checkout/listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({ 
          title: "Error", 
          description: error instanceof Error ? error.message : "Checkout failed", 
          variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesCategory = selectedCategory === "ALL" || listing.category === selectedCategory;
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
            <span className="text-[#FFCC00]">Marketplace</span>
          </h1>
          <p className="text-[#F5F5F0]/60">
            Buy and sell gear within the community.
          </p>
        </div>
        
        {userStripeAccountId ? (
             <Dialog open={isListingOpen} onOpenChange={setIsListingOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="h-5 w-5 mr-2" />
                        List Item
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>List Item for Sale</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateListing} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input 
                                id="title" 
                                value={listingForm.title} 
                                onChange={e => setListingForm({...listingForm, title: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input 
                                id="price" 
                                type="number" 
                                step="0.01"
                                value={listingForm.price} 
                                onChange={e => setListingForm({...listingForm, price: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select 
                                value={listingForm.category} 
                                onValueChange={v => setListingForm({...listingForm, category: v})}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(LISTING_CATEGORIES).map(([key, info]) => (
                                        <SelectItem key={key} value={key}>{info.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="condition">Condition</Label>
                            <Select 
                                value={listingForm.condition} 
                                onValueChange={v => setListingForm({...listingForm, condition: v})}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(CONDITION_LABELS).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input 
                                id="image" 
                                value={listingForm.imageUrl} 
                                onChange={e => setListingForm({...listingForm, imageUrl: e.target.value})} 
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea 
                                id="description" 
                                value={listingForm.description} 
                                onChange={e => setListingForm({...listingForm, description: e.target.value})} 
                                required 
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isProcessing}>
                            {isProcessing ? "Creating..." : "Create Listing"}
                        </Button>
                    </form>
                </DialogContent>
             </Dialog>
        ) : (
            <Button onClick={handleStartSelling} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Store className="h-4 w-4 mr-2" />}
                Start Selling
            </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#F5F5F0]/40" />
          <Input
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === "ALL" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory("ALL")}
          >
            All
          </Button>
          {(Object.keys(LISTING_CATEGORIES) as ListingCategory[]).map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {LISTING_CATEGORIES[category].label}
            </Button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="hover:border-[#FFCC00]/30 transition-colors overflow-hidden flex flex-col">
            <CardContent className="p-0 flex flex-col h-full">
              {/* Image placeholder */}
              <div className="aspect-square bg-gradient-to-br from-[#F5F5F0]/5 to-[#F5F5F0]/10 relative">
                {listing.images[0] ? (
                    <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                    <ShoppingBag className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-[#F5F5F0]/10" />
                )}
                
                <div className="absolute bottom-4 left-4">
                  <Badge>{LISTING_CATEGORIES[listing.category as ListingCategory].label}</Badge>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold uppercase tracking-wider line-clamp-1 flex-1">
                    {listing.title}
                  </h3>
                  <span className="text-xl font-bold text-[#FFCC00] ml-2">
                    {formatPrice(listing.price)}
                  </span>
                </div>

                <p className="text-sm text-[#F5F5F0]/60 line-clamp-2 mb-3 flex-1">
                  {listing.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">
                    {CONDITION_LABELS[listing.condition as Condition]}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-[#F5F5F0]/40">
                    <span>{listing.seller?.name || "Unknown"}</span>
                  </div>
                </div>

                {listing.sellerId !== userId && (
                    <Button className="w-full" onClick={() => handleBuy(listing.id)} disabled={isProcessing}>
                        {isProcessing ? "Processing..." : "Buy Now"}
                    </Button>
                )}
                {listing.sellerId === userId && (
                    <Button variant="outline" className="w-full" disabled>Your Listing</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingBag className="h-12 w-12 text-[#F5F5F0]/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold uppercase tracking-wider mb-2">No Listings Found</h3>
            <p className="text-[#F5F5F0]/60 mb-4">
              {searchQuery ? "Try adjusting your search or filters." : "Be the first to list something!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
