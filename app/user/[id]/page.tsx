import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Username + Profile - Kairos",
}

export default async function Page () {
  return (
    <>
      <h2>Users profile here</h2>
      <p>Show projects</p>
    </>
    )
}