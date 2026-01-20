"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  Button, 
  Input, 
  Badge, 
  Avatar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kaitif/ui";
import { Search, MoreVertical, Mail, Filter, UserPlus, Shield, ShieldCheck, X, RefreshCw, Loader2 } from "lucide-react";
import { User, getRoleBadgeVariant, getRoleDisplayName, getInvitableRoles } from "@kaitif/db";
import { 
  updateUserRoleAction, 
  createInviteAction, 
  cancelInviteAction, 
  resendInviteAction,
  getPendingInvitesAction,
  getCurrentUserRoleAction 
} from "@/app/actions";

interface UsersClientPageProps {
  users: User[];
  totalCount: number;
}

interface PendingInvite {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  createdAt: string;
  inviter?: { name: string; email: string };
}

export default function UsersClientPage({ users, totalCount }: UsersClientPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [roleFilter, setRoleFilter] = useState<string | null>(searchParams.get("role") || null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  
  // Role change dialog state
  const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [roleChangeReason, setRoleChangeReason] = useState("");
  
  // Invite dialog state
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"USER" | "ADMIN">("USER");
  const [inviteError, setInviteError] = useState("");
  
  // Load current user role and pending invites
  useEffect(() => {
    async function loadData() {
      const { role } = await getCurrentUserRoleAction();
      setCurrentUserRole(role);
      
      if (role === "ADMIN" || role === "SUPERADMIN") {
        const { invites } = await getPendingInvitesAction();
        setPendingInvites(invites as PendingInvite[]);
      }
    }
    loadData();
  }, []);

  const isSuperAdmin = currentUserRole === "SUPERADMIN";
  const invitableRoles = currentUserRole ? getInvitableRoles(currentUserRole) : [];

  // Debounce search update
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

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    
    startTransition(async () => {
      const result = await updateUserRoleAction(
        selectedUser.id,
        newRole as "USER" | "ADMIN",
        roleChangeReason || undefined
      );
      
      if (result.success) {
        setRoleChangeDialogOpen(false);
        setSelectedUser(null);
        setNewRole("");
        setRoleChangeReason("");
        router.refresh();
      } else {
        alert(result.error || "Failed to update role");
      }
    });
  };

  const handleInvite = async () => {
    if (!inviteEmail) {
      setInviteError("Email is required");
      return;
    }
    
    setInviteError("");
    
    startTransition(async () => {
      const result = await createInviteAction(inviteEmail, inviteRole);
      
      if (result.success) {
        setInviteDialogOpen(false);
        setInviteEmail("");
        setInviteRole("USER");
        // Refresh invites
        const { invites } = await getPendingInvitesAction();
        setPendingInvites(invites as PendingInvite[]);
      } else {
        setInviteError(result.error || "Failed to send invite");
      }
    });
  };

  const handleCancelInvite = async (inviteId: string) => {
    startTransition(async () => {
      const result = await cancelInviteAction(inviteId);
      if (result.success) {
        setPendingInvites(prev => prev.filter(i => i.id !== inviteId));
      }
    });
  };

  const handleResendInvite = async (inviteId: string) => {
    startTransition(async () => {
      await resendInviteAction(inviteId);
      const { invites } = await getPendingInvitesAction();
      setPendingInvites(invites as PendingInvite[]);
    });
  };

  const openRoleChangeDialog = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleChangeDialogOpen(true);
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
        
        {/* Invite User Dialog */}
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
              <DialogDescription>
                Send an invitation email to add a new user to Kaitif.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as "USER" | "ADMIN")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {invitableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {getRoleDisplayName(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#F5F5F0]/40">
                  {inviteRole === "ADMIN" 
                    ? "Admin users can access the admin dashboard."
                    : "Regular users can access the main app."}
                </p>
              </div>
              {inviteError && (
                <p className="text-sm text-red-500">{inviteError}</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Invite"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Pending Invites ({pendingInvites.length})
            </CardTitle>
            <CardDescription>
              These users have been invited but haven't accepted yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingInvites.map((invite) => (
                <div 
                  key={invite.id}
                  className="flex items-center justify-between p-3 rounded bg-[#F5F5F0]/5 border border-[#F5F5F0]/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#FFCC00]/20 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-[#FFCC00]" />
                    </div>
                    <div>
                      <div className="font-medium">{invite.email}</div>
                      <div className="text-xs text-[#F5F5F0]/40">
                        Expires {new Date(invite.expiresAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={invite.role === "ADMIN" ? "accent" : "secondary"}>
                      {invite.role}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleResendInvite(invite.id)}
                      disabled={isPending}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCancelInvite(invite.id)}
                      disabled={isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
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
                  <DropdownMenuItem onClick={() => handleRoleFilter("ADMIN")}>
                    Admins
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleFilter("SUPERADMIN")}>
                    Super Admins
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
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
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
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role === "SUPERADMIN" && <ShieldCheck className="h-3 w-3 mr-1" />}
                        {user.role === "ADMIN" && <Shield className="h-3 w-3 mr-1" />}
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="font-bold text-[#FFCC00]">Lvl {user.level}</div>
                      <div className="text-xs text-[#F5F5F0]/40">{user.xp.toLocaleString()} XP</div>
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
                          {isSuperAdmin && user.role !== "SUPERADMIN" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openRoleChangeDialog(user)}>
                                <Shield className="h-4 w-4 mr-2" />
                                Change Role
                              </DropdownMenuItem>
                            </>
                          )}
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

      {/* Role Change Dialog */}
      <Dialog open={roleChangeDialogOpen} onOpenChange={setRoleChangeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-3 bg-[#F5F5F0]/5 rounded">
              <Avatar name={selectedUser?.name || "User"} src={selectedUser?.avatarUrl} size="md" />
              <div>
                <div className="font-bold">{selectedUser?.name || "Unnamed User"}</div>
                <div className="text-sm text-[#F5F5F0]/60">{selectedUser?.email}</div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Current Role</Label>
              <Badge variant={getRoleBadgeVariant(selectedUser?.role || "USER")}>
                {getRoleDisplayName(selectedUser?.role || "USER")}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newRole">New Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Input
                id="reason"
                placeholder="Why are you changing this role?"
                value={roleChangeReason}
                onChange={(e) => setRoleChangeReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleChangeDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRoleChange} 
              disabled={isPending || newRole === selectedUser?.role}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
