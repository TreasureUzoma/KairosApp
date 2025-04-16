// import { notFound } from "next/navigation";

import StreakApp from "./_components/StreakApp";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function DynamicStreakPage({ params }: Params) {
    const id = (await params).id

    console.log(id);
    

    // TODO: check if strak exists in db, else: 
    // if (!streakWithId){
    //     return notFound()
    // }

    return <StreakApp />

}
