/* eslint-disable */
"use client";
// import type { Metadata } from "next";
import { useParams } from "next/navigation";
// export const metadata: Metadata = {
//   title: "Post Title - Username - Kairos",
// };

export default function Page() {
  const params = useParams();
  const { id } = params;
  console.log(id);
  return (
    <>
      <h2>View actual post here {id}</h2>
    </>
  );
}
