"use client";

import React, { useState } from "react";

interface CheckboxProps {
  id: string;
  label: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Checkbox = ({ id, label, defaultChecked = false, onChange }: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    if (onChange) onChange(newState);
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="flex cursor-pointer select-none items-center text-sm font-medium text-black dark:text-white"
      >
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            className="sr-only"
            checked={isChecked}
            onChange={handleToggle}
          />
          <div
            className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
              isChecked
                ? "border-primary bg-gray dark:bg-transparent"
                : "border-stroke dark:border-strokedark"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-sm ${
                isChecked ? "bg-primary" : "opacity-0"
              }`}
            >
              {/* V자 모양 SVG를 넣고 싶다면 이 자리에 삽입 */}
              <svg
                className={`fill-current ${isChecked ? "block" : "hidden"}`}
                width="10"
                height="7"
                viewBox="0 0 10 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.70685 0.292893C10.0974 0.683417 10.0974 1.31658 9.70685 1.70711L4.70685 6.70711C4.31633 7.09763 3.68316 7.09763 3.29264 6.70711L0.29264 3.70711C-0.0978844 3.31658 -0.0978844 2.68342 0.29264 2.29289C0.683164 1.90237 1.31633 1.90237 1.70685 2.29289L4.00005 4.5861L8.29264 0.292893C8.68316 -0.0976311 9.31633 -0.0976311 9.70685 0.292893Z"
                  fill="white"
                />
              </svg>
            </span>
          </div>
        </div>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;