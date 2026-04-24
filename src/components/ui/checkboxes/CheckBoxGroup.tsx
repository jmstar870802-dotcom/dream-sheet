"use client";

import React, { useState } from "react";

interface Option {
  id: string;
  label: string;
}

interface CheckboxGroupProps {
  title?: string;
  options: Option[];
  onChange?: (selectedIds: string[]) => void;
}

const CheckboxGroup = ({ title, options, onChange }: CheckboxGroupProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleCheckboxChange = (id: string) => {
    const updatedSelected = selectedItems.includes(id)
      ? selectedItems.filter((item) => item !== id)
      : [...selectedItems, id];

    setSelectedItems(updatedSelected);
    if (onChange) onChange(updatedSelected);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {title && (
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">{title}</h3>
        </div>
      )}
      <div className="flex flex-col gap-4.5 p-6.5">
        {options.map((option) => (
          <label
            key={option.id}
            htmlFor={option.id}
            className="flex cursor-pointer select-none items-center font-medium"
          >
            <div className="relative">
              <input
                type="checkbox"
                id={option.id}
                className="sr-only"
                onChange={() => handleCheckboxChange(option.id)}
                checked={selectedItems.includes(option.id)}
              />
              {/* 체크박스 외관 */}
              <div
                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                  selectedItems.includes(option.id)
                    ? "border-primary bg-gray dark:bg-transparent"
                    : "border-stroke dark:border-strokedark"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-sm ${
                    selectedItems.includes(option.id) ? "bg-primary" : "opacity-0"
                  }`}
                ></span>
              </div>
            </div>
            <span className="text-black dark:text-white">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;