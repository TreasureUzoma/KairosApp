"use client";

import Img from "@/components/Img";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { FaImage } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { MdCancel } from "react-icons/md";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type FormData = {
  title: string;
  description: string;
  project: string;
  github: string;
  imagesUrl: string[];
  imageFiles: File[] | null;
};

export default function CreateStreakForm() {
  const [formData, setFormData] = useState<FormData>({
    imagesUrl: [],
    imageFiles: null,
    title: "",
    github: "",
    project: "",
    description: "",
  });

  const router = useRouter();

  const goBack = () => router.back();

  const { imagesUrl, imageFiles, title, project, description, github } =
    formData;

  const isDisabled =
    (!title || !description || !github || !project) && imagesUrl.length < 1;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>
  ) => {
    const { value, files, name } = e.target;
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
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
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

    const fields = ["title", "project", "description", "github"];

    const isEmptyStrings = fields.some(
      (field) =>
        !formData[
          field as keyof Omit<FormData, "imageFiles" | "imagesUrl">
        ].trim()
    );

    if (isEmptyStrings) {
      console.log("Empty fields");
      return;
    }

    // handle submit
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="xsm:h-fit xsm:w-[500px] xsm:max-h-[calc(100%_-_50px)] flex h-full min-h-[300px] w-full flex-col gap-6 rounded-[10px]  bg-background p-5"
      >
        <div className="mb-3 flex justify-between">
          <h2 className="text-primary font-semibold">Create New Streak</h2>
          <ImCancelCircle onClick={goBack} cursor={"pointer"} fill="red" />
        </div>
        <div className="flex items-start gap-3">
          <Img
            src={"/guy.jpg"}
            className="size-10 shrink-0 object-cover rounded-full"
            alt="user"
          />
          <div className="grid h-fit w-full gap-5">
            <h2 className="text-primary text-sm font-semibold">DevText16</h2>
            <div className="grid gap-5 md:w-[calc(100%-200px)] w-full ">
              <input
                className="px-3 py-2 border outline-none rounded-[10px] focus:border-zinc-500"
                name="title"
                onChange={handleChange}
                type="text"
                value={title}
                placeholder="Enter Streak title"
              />
              <input
                className="px-3 py-2 border outline-none rounded-[10px] focus:border-zinc-500"
                name="github"
                onChange={handleChange}
                type="url"
                value={github}
                placeholder="Enter GitHub repo"
              />
              <input
                className="px-3 py-2 border outline-none rounded-[10px] focus:border-zinc-500"
                name="project"
                onChange={handleChange}
                type="url"
                value={project}
                placeholder="Enter project url"
              />
              <textarea
                onChange={handleChange}
                name="description"
                value={description}
                rows={5}
                className="focus:border-zinc-500 p-3 rounded-[10px] resize-none text-gray border outline-none"
                placeholder="Brief description"
              />
            </div>
          </div>
        </div>

        {imagesUrl.length > 0 && (
          <div className="no-scrollbar px-10 flex h-[250px] gap-5 overflow-x-scroll py-5">
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

          <Button
            type="submit"
            disabled={isDisabled}
            className={cn(
              "bg-primary h-fit rounded-full p-2 dark:text-zinc-800 px-5 text-white",
              isDisabled && "bg-primary/50 cursor-not-allowed"
            )}
          >
            Post
          </Button>
        </div>
      </form>
    </div>
  );
}
