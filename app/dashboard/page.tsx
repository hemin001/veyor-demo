import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <p>Logged in as {user.email}</p>
      <Link href="/dashboard/new" className="underline">
        New deal
      </Link>
      <form action={signOut}>
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Sign out
        </button>
      </form>
    </div>
  );
}
