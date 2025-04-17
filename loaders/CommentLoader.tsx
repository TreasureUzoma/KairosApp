export default function CommentLoader() {
  return (
    <div className="divide-y divide-light-gray">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="flex gap-4 py-5">
          <div className="size-10 rounded-full bg-light-gray animate-pulse"></div>

          <div className="flex-1 space-y-2">
            <span className="bg-light-gray animate-pulse w-25 h-5 rounded-full"></span>

            <div className="grid gap-2 h-fit w-full">
              <p className="bg-light-gray animate-pulse h-5 w-full rounded-full"></p>
              <p className="bg-light-gray animate-pulse h-5 w-full rounded-full"></p>
            </div>

            <div className="text-gray-500 flex items-center gap-4 pt-1 text-sm">
              <span className="bg-light-gray animate-pulse w-25 rounded-full"></span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
