import { createClient } from "@/lib/supabase/server";
import { getAllPasses } from "@kaitif/db";
import PassesClientPage from "./client-page";
import { redirect } from "next/navigation";

export default async function PassesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const { passes, count } = await getAllPasses(supabase, {
    page,
    limit: 20,
    search: resolvedSearchParams.search,
    status: resolvedSearchParams.status,
  });

  return (
    <PassesClientPage 
      passes={passes}
      totalCount={count}
    />
  );
}
