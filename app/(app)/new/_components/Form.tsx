"use client";

import Img from "@/components/Img";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { FaImage } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { MdCancel } from "react-icons/md";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";

type FormData = {
  imagesUrl: string[];
  imageFiles: File[] | null;
};

export default function CreateStreakForm() {
  const [formData, setFormData] = useState<FormData>({
    imagesUrl: [],
    imageFiles: null,
  });
  const [text, setText] = useState("");

  const router = useRouter();

  const goBack = () => router.back();

  const { imagesUrl, imageFiles } = formData;

  const isDisabled = !text.trim() && imagesUrl.length < 1;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>
  ) => {
    const { value, files } = e.target;
    const maxFileSize = 2.5 * 1024 * 1024;

    if (files && files.length) {
      const fileLists = Array.from(files);
      const remainingSlots = 4 - imagesUrl.length;

      for (let i = 0; i < Math.min(fileLists.length, remainingSlots); i++) {
        const file = fileLists[i];

        if (file.size > maxFileSize) {
          //   showToast({
          //     message: "File size is greater than 2MB",
          //     variants: "error",
          //   });
          continue;
        }

        setFormData((prev) => ({
          ...prev,
          imagesUrl: [...prev.imagesUrl, URL.createObjectURL(file)],
          imageFiles: prev.imageFiles ? [...prev.imageFiles, file] : [file],
        }));
      }
    } else {
      setText(value);
    }
  };

  function removeImage(idx: number) {
    const removeImageUrl = imagesUrl.filter((_, index) => index !== idx);
    const removeImageFile = imageFiles!.filter((_, index) => index !== idx);

    setFormData((prev) => {
      return {
        ...prev,
        imageFiles: removeImageFile,
        imagesUrl: removeImageUrl,
      };
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // handle submit
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="xsm:h-fit xsm:w-[500px] xsm:max-h-[calc(100%_-_50px)] flex h-full min-h-[300px] w-full flex-col gap-6 rounded-[10px] bg-white p-5"
      >
        <div className="mb-3 flex justify-between">
          <h2 className="text-primary font-semibold">Create New Streak</h2>
          <ImCancelCircle onClick={goBack} cursor={"pointer"} fill="red" />
        </div>
        <div className="flex items-start gap-3">
          <Img src={"/guy.jpg"} className="size-10 rounded-full" alt="user" />
          <div className="grid h-fit w-full gap-5">
            <h2 className="text-primary text-sm font-semibold">DevText16</h2>
            <TextareaAutosize
              onChange={handleChange}
              name="text"
              value={text}
              className="border-gray focus:border-accent resize-none text-gray border-b outline-none"
              placeholder="What's trending?"
              minRows={2}
              maxRows={7}
            />
          </div>
        </div>

        {imagesUrl.length > 0 && (
          <div className="no-scrollbar flex h-[250px] gap-5 overflow-x-scroll py-5">
            {imagesUrl.map((image, index) => (
              <picture
                key={index}
                className="animate-in zoom-in relative w-[200px] shrink-0"
              >
                <Img
                  src={image}
                  className="h-full w-full rounded-[10px] object-cover"
                  alt={`img-${index}`}
                />
                <div className="absolute -top-2.5 -right-2.5 rounded-full bg-red-500 p-1">
                  <MdCancel
                    onClick={() => removeImage(index)}
                    cursor={"pointer"}
                    className="size-5"
                    fill="white"
                  />
                </div>
              </picture>
            ))}
          </div>
        )}

        <div className="xsm:mt-auto flex items-center justify-between gap-5">
          <label id="file" htmlFor="user_images" className="group w-fit">
            <input
              onChange={handleChange}
              type="file"
              disabled={imageFiles?.length === 4}
              name="imageFiles"
              multiple
              className="hidden"
              id="user_images"
            />
            <FaImage className="fill-gray group-hover:fill-zinc-950 size-5 cursor-pointer" />
          </label>

          <button
            type="submit"
            disabled={isDisabled}
            className={cn(
              "bg-primary h-fit rounded-full p-2 px-5 text-white",
              isDisabled && "bg-primary/50 cursor-not-allowed"
            )}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
