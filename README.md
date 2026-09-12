# Veyor demo

A minimal deal tracker for a real estate brokerage.

## What it does

- Sign up and log in, with sessions handled by Supabase auth
- Create a deal with property address, client name, and closing date
- Each user sees only their own deals
- Unauthenticated users cannot reach the dashboard

## Stack

Next.js 16 (App Router), React, TypeScript, Tailwind, Supabase (Postgres + auth).

## Data isolation

Access is enforced by row-level security in Postgres, not by filtering in application code.

The `deals` table has RLS enabled with a policy matching `auth.uid()` against the row's `user_id`. 
`using` controls which rows are visible on reads, and `with check` validates rows on write so a user cannot insert a deal owned by someone else.

The practical effect is that the dashboard query selects from `deals` with no user filter at all - Postgres returns only the rows that belong to the caller.
A missing `where` clause in application code cannot leak another user's data.

## Next steps

- Deal types, each carrying its own list of required forms
- Required forms attached automatically when a deal is created, and markable as received
- A completion count per deal, and a flag when a deal is within 14 days of closing with forms outstanding
- Editing and closing deals - right now they can only be created
- Document upload, e-signature, trust accounting