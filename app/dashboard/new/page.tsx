import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function NewDealPage({
  searchParams,
}: PageProps<"/dashboard/new">) {
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  async function createDeal(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const property_address = formData.get("property_address")?.toString().trim();
    const client_name = formData.get("client_name")?.toString().trim();
    const closing_date = formData.get("closing_date")?.toString() || null;

    if (!property_address || !client_name) {
      redirect(
        "/dashboard/new?error=" +
          encodeURIComponent("Property address and client name are required"),
      );
    }

    const { error: insertError } = await supabase.from("deals").insert({
      property_address,
      client_name,
      closing_date,
      user_id: user.id,
    });

    if (insertError) {
      redirect("/dashboard/new?error=" + encodeURIComponent(insertError.message));
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <form action={createDeal} className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-xl font-semibold">New deal</h1>

        <input
          type="text"
          name="property_address"
          placeholder="Property address"
          required
          className="rounded border px-3 py-2"
        />

        <input
          type="text"
          name="client_name"
          placeholder="Client name"
          required
          className="rounded border px-3 py-2"
        />

        <input
          type="date"
          name="closing_date"
          className="rounded border px-3 py-2"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Create deal
        </button>

        <Link href="/dashboard" className="text-sm underline">
          Cancel
        </Link>
      </form>
    </div>
  );
}
