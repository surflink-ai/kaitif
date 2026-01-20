"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
} from "@kaitif/ui";
import { createClient } from "@/lib/supabase/client";
import { Loader2, UserPlus, AlertCircle, CheckCircle } from "lucide-react";

const acceptInviteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AcceptInviteForm = z.infer<typeof acceptInviteSchema>;

interface InviteData {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  status: string;
  inviter?: { name: string };
}

export default function InviteAcceptPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [success, setSuccess] = useState(false);
  
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInviteForm>({
    resolver: zodResolver(acceptInviteSchema),
  });

  // Fetch invite details
  useEffect(() => {
    async function fetchInvite() {
      try {
        const { data: inviteData, error } = await (supabase
          .from("user_invites") as any)
          .select(`
            id,
            email,
            role,
            expiresAt,
            status,
            inviter:users!user_invites_invitedBy_fkey(name)
          `)
          .eq("token", token)
          .single();

        const data = inviteData as InviteData | null;

        if (error || !data) {
          setError("Invalid or expired invitation link.");
          setIsLoading(false);
          return;
        }

        // Check if invite is still valid
        if (data.status !== "PENDING") {
          setError("This invitation has already been used or cancelled.");
          setIsLoading(false);
          return;
        }

        if (new Date(data.expiresAt) < new Date()) {
          setError("This invitation has expired.");
          setIsLoading(false);
          return;
        }

        setInvite(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching invite:", err);
        setError("Failed to load invitation.");
        setIsLoading(false);
      }
    }

    if (token) {
      fetchInvite();
    }
  }, [token, supabase]);

  const onSubmit = async (data: AcceptInviteForm) => {
    if (!invite) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Create the user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: invite.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error("Failed to create account");
      }

      // Create user in our users table with the invited role
      const { error: userError } = await (supabase
        .from("users") as any)
        .upsert({
          id: authData.user.id,
          email: invite.email,
          name: data.name,
          role: invite.role,
        });

      if (userError) {
        console.error("Error creating user record:", userError);
        // Don't fail - the auth user was created
      }

      // Mark invite as accepted
      const { error: inviteError } = await (supabase
        .from("user_invites") as any)
        .update({
          status: "ACCEPTED",
          acceptedAt: new Date().toISOString(),
        })
        .eq("id", invite.id);

      if (inviteError) {
        console.error("Error updating invite:", inviteError);
      }

      setSuccess(true);

      // Redirect after a short delay
      setTimeout(() => {
        if (invite.role === "ADMIN" || invite.role === "SUPERADMIN") {
          // Redirect to admin dashboard
          window.location.href = process.env.NEXT_PUBLIC_ADMIN_URL || "/";
        } else {
          router.push("/home");
        }
      }, 2000);
    } catch (err) {
      console.error("Error accepting invite:", err);
      setError(err instanceof Error ? err.message : "Failed to create account");
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#080808]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#FFCC00]" />
          <p className="text-[#F5F5F0]/60">Loading invitation...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#080808]">
        <div className="w-full max-w-md text-center">
          <Link href="/" className="block text-3xl font-bold tracking-wider text-[#FFCC00] mb-8">
            KAITIF
          </Link>
          <Card>
            <CardContent className="pt-6">
              <div className="h-16 w-16 bg-red-500/10 flex items-center justify-center mx-auto mb-6 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">
                Invalid Invitation
              </h2>
              <p className="text-[#F5F5F0]/60 mb-6">{error}</p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#080808]">
        <div className="w-full max-w-md text-center">
          <Link href="/" className="block text-3xl font-bold tracking-wider text-[#FFCC00] mb-8">
            KAITIF
          </Link>
          <Card>
            <CardContent className="pt-6">
              <div className="h-16 w-16 bg-green-500/10 flex items-center justify-center mx-auto mb-6 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">
                Welcome to Kaitif!
              </h2>
              <p className="text-[#F5F5F0]/60 mb-6">
                Your account has been created. Redirecting you now...
              </p>
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#FFCC00]" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#080808]">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center text-3xl font-bold tracking-wider text-[#FFCC00] mb-8">
          KAITIF
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-[#FFCC00]/10 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-6 h-6 text-[#FFCC00]" />
            </div>
            <CardTitle>You're Invited!</CardTitle>
            <CardDescription>
              {invite?.inviter?.name 
                ? `${invite.inviter.name} invited you to join Kaitif`
                : "You've been invited to join Kaitif"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Invite Details */}
            <div className="p-4 bg-[#F5F5F0]/5 rounded border border-[#F5F5F0]/10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#F5F5F0]/60">Email</span>
                <span className="text-sm font-medium">{invite?.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#F5F5F0]/60">Role</span>
                <Badge variant={invite?.role === "ADMIN" ? "accent" : "secondary"}>
                  {invite?.role}
                </Badge>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  error={!!errors.name}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  error={!!errors.password}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  error={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-[#F5F5F0]/60">
              Already have an account?{" "}
              <Link href="/login" className="text-[#FFCC00] hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
