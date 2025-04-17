import { notFound } from "next/navigation";

import { posts } from "@/app/dummy";
import StreakApp from "./_components/StreakApp";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function DynamicStreakPage({ params }: Params) {
  const id = (await params).id;

  const findStreak = posts.find((post) => post.id === id);

  if (!findStreak) {
    return notFound();
  }

  return <StreakApp streak={findStreak} />;
}
