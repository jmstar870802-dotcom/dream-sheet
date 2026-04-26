"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

export default function Searchbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const title = searchParams.get("title");

  useEffect(() => {
    setSearch(title || "");
  }, [title]);

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onSubmit = () => {
    if (!search || title === search) return;
    router.push(`/search?title=${title}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <div className="flex gap-1">
      <div className="flex-1 min-w-0">
        <Input type="text" className="!h-10 mbe-1" id="title" name="title" onChange={onChangeSearch} onKeyDown={onKeyDown}/>
      </div>
      <Button size="sm" variant="primary" className="mbe-1 !h-10" buttonType="button">
           조회    
      </Button>
    </div>
  );
}