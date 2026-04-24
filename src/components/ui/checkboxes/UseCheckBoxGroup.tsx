import React, { ReactNode, useState } from "react";
import { Check } from "lucide-react";


interface dataInfo {
  id: string;
  label: string;
}

const Data: dataInfo[] = [];

interface UseCheckBoxPors {
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  data : dataInfo[];
  onChange?: (masterKey : string,selectedIds: string[]) => void;
  groupKey? : string
}

const UseCheckBoxGroup: React.FC<UseCheckBoxPors> = ({
  size = "md",
  variant = "primary",
  data,
  onChange,
  groupKey =""
}) => {
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toggleCheck = (key: string, id: string) => {
    const updatedSelected = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];

    setSelectedIds(updatedSelected);
    if (onChange) onChange(key ,updatedSelected);
  };
  
  return (
    <div className="w-full p-1">
      {/* 칩 컨테이너 */}
      <div className="flex flex-wrap gap-2.5">
        {data.map((checkInfo) => {
          const isSelected = selectedIds.includes(checkInfo.id);
          
          return (
            <button
              key={checkInfo.id}
              type="button"
              onClick={() => toggleCheck(groupKey, checkInfo.id)}
              className={`
                group flex items-center justify-center gap-2 px-5 py-2.5 
                rounded-full border transition-all duration-200 text-sm font-medium
                ${
                  isSelected
                    ? "bg-brand-500 border text-white shadow-md" 
                    : "bg-gray-200 dark:bg-white/10 border-transparent text-black dark:text-white hover:border-primary/50"
                }
              `}
            >
              {/* 체크 아이콘 (선택 시에만 노출) */}
              {isSelected && (
                <Check 
                  size={16} 
                  strokeWidth={3} 
                  className="animate-in zoom-in duration-200" 
                />
              )}
              
              <span>{checkInfo.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UseCheckBoxGroup;