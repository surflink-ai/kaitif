import { createClient } from "@/lib/supabase/server";
import { getAllUsers } from "@kaitif/db";
import UsersClientPage from "./client-page";
import { redirect } from "next/navigation";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; role?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const { users, count } = await getAllUsers(supabase, {
    page,
    limit: 20,
    search: resolvedSearchParams.search,
    role: resolvedSearchParams.role,
  });

  return (
    <UsersClientPage 
      users={users}
      totalCount={count}
    />
  );
}
