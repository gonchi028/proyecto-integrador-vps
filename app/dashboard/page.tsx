import { Metadata } from "next"

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
