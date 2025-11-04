import { Metadata } from "next"

// Force dynamic rendering for all dashboard pages
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata : Metadata = {
  title: "Dashboard - Terrasse",
  description: "Bienvenido al dashboar del Terrasse!",
}

export default function DashboardPage() {
  return (
    <>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </>
  )
}
