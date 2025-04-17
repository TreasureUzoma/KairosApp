const StreakLoader = () => (
  <div className=" divide-y divide-light-gray/50">
    {[...Array(10)].map((_, index) => (
      <StreakLoaderCard key={index} />
    ))}
  </div>
);

const StreakLoaderCard = () => {
  return (
    <div className=" p-4 mb-9 py-7.5">
      <div className="flex gap-3">
        <div className=" size-12 animate-pulse bg-light-gray rounded-full"></div>

        <div className="flex-1 grid gap-5">
          <div className="flex items-center gap-5">
            <span className="mr-1 bg-light-gray h-5 w-25 rounded-full animate-pulse"></span>
            <span className=" bg-light-gray h-5 w-25 rounded-full animate-pulse"></span>
          </div>

          <div className="grid gap-2 h-fit">
            <p className=" bg-light-gray h-5 w-full rounded-full animate-pulse"></p>
            <p className=" bg-light-gray h-5 w-full rounded-full animate-pulse"></p>
            <p className=" bg-light-gray h-5 w-full rounded-full animate-pulse"></p>
          </div>

          <div className="object-cover rounded-[10px] w-full sm:h-125 h-100 animate-pulse bg-light-gray"></div>
        </div>
      </div>
    </div>
  );
};

export default StreakLoader;
