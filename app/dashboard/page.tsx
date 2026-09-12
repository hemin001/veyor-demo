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

    // No user filter here: RLS on the deals table restricts rows to auth.uid().
  const { data: deals } = await supabase
    .from("deals")
    .select("id, property_address, client_name, closing_date, status");

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-8 max-w-2xl mx-auto w-full">
      <p>Logged in as {user.email}</p>
      <Link href="/dashboard/new" className="underline">
        New deal
      </Link>

      {deals && deals.length > 0 ? (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="border-b p-2">Property address</th>
              <th className="border-b p-2">Client name</th>
              <th className="border-b p-2">Closing date</th>
              <th className="border-b p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id}>
                <td className="border-b p-2">{deal.property_address}</td>
                <td className="border-b p-2">{deal.client_name}</td>
                <td className="border-b p-2">{deal.closing_date ?? "—"}</td>
                <td className="border-b p-2">{deal.status ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No deals yet.</p>
      )}

      <form action={signOut}>
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Sign out
        </button>
      </form>
    </div>
  );
}
