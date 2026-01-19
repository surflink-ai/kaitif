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
  Avatar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@kaitif/ui";
import { Search, MoreVertical, Mail, Filter } from "lucide-react";
import { User } from "@kaitif/db";

interface UsersClientPageProps {
  users: User[];
  totalCount: number;
}

export default function UsersClientPage({ users, totalCount }: UsersClientPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [roleFilter, setRoleFilter] = useState<string | null>(searchParams.get("role") || null);

  // Debounce search update
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set("search", searchQuery);
      } else {
        params.delete("search");
      }
      
      // Reset page on search change
      params.set("page", "1");
      
      router.push(`?${params.toString()}`);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, router, searchParams]);

  const handleRoleFilter = (role: string | null) => {
    setRoleFilter(role);
    const params = new URLSearchParams(searchParams.toString());
    if (role) {
      params.set("role", role);
    } else {
      params.delete("role");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Users</h1>
          <p className="text-[#F5F5F0]/60">
            Manage user accounts, roles, and permissions.
          </p>
        </div>
        <Button>
          <Mail className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users ({totalCount})</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F5F5F0]/40" />
                <Input 
                  placeholder="Search users..." 
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
                  <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleRoleFilter(null)}>
                    All Roles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleFilter("USER")}>
                    Users
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleFilter("STAFF")}>
                    Staff
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleFilter("ADMIN")}>
                    Admins
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
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Role</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Level</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Joined</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-[#F5F5F0]/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                    <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">No users found</td></tr>
                ) : users.map((user) => (
                  <tr key={user.id} className="border-b border-[#F5F5F0]/10 hover:bg-[#F5F5F0]/5 transition-colors">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name || "User"} src={user.avatarUrl} size="sm" />
                        <div>
                          <div className="font-bold">{user.name || "Unnamed User"}</div>
                          <div className="text-xs text-[#F5F5F0]/60">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge variant={
                        user.role === "ADMIN" ? "destructive" : 
                        user.role === "STAFF" ? "accent" : "secondary"
                      }>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="font-bold text-[#FFCC00]">Lvl {user.level}</div>
                      <div className="text-xs text-[#F5F5F0]/40">{user.xp} XP</div>
                    </td>
                    <td className="p-4 align-middle text-[#F5F5F0]/60">
                      {new Date(user.createdAt).toLocaleDateString()}
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
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
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
