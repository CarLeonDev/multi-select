import { useCallback, useEffect, useRef, useState } from "react";
import cn from "clsx";
import { Command as CommandPrimitive } from "cmdk";

import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { X } from "lucide-react";

export type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: Option[];
  value?: Option[];
  placeholder?: string;
  onChange: (selected: string[]) => void;
};

export const MultiSelect = ({
  options,
  value,
  placeholder = "typing to search...",
}: MultiSelectProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState<Option[]>(value || []);

  const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current?.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current?.contains(event.target as Node)
    ) {
      setOpen(false);
      inputRef.current.blur();
    }
  }, []);

  const handleItemSelect = useCallback(
    (value: string) => {
      const option = options.find((option) => option.label === value);

      if (!option) return;

      setSelected((selected) => [...selected, option]);
      setInputValue("");
      inputRef.current?.focus();
    },
    [options, selected]
  );

  const availableOptions = options.filter(
    (option) => !selected.some((selected) => selected.value === option.value)
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [open]);

  return (
    <Command
      ref={dropdownRef}
      className="overflow-visible bg-transparent text-left"
    >
      <div
        className={cn(
          "p-0.5 bg-white rounded border border-input focus-within:ring-3 ring-ring"
        )}
        onClick={() => inputRef?.current?.focus()}
      >
        <div className="relative flex flex-wrap gap-0.5">
          {selected.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-1 px-2 py-1 bg-accent text-sm rounded-xs"
            >
              <span>{option.label}</span>
              <X className="w-3 h-3 text-gray-500 cursor-pointer" />
            </div>
          ))}

          <CommandPrimitive.Input
            ref={inputRef}
            className={cn(
              "min-h-6 field-sizing-content max-w-full px-1 text-xs bg-transparent outline-none",
              {
                "px-2": selected.length === 0,
              }
            )}
            placeholder={selected.length !== 0 ? "" : placeholder}
            onValueChange={(value) => setInputValue(value)}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
          />
        </div>
      </div>

      <div className="relative">
        {open && (
          <div className="absolute top-2.5 z-10 w-full rounded border border-input shadow-md animate-in">
            <div className="absolute left-1/2 -top-2 transform -translate-x-1/2 translate-y-[1px] rotate-45 w-3 h-3 bg-popover border-input border-l border-t" />

            <CommandList className="rounded bg-popover text-popover-foreground">
              <>
                {inputValue.length > 0 &&
                  !options.some((option) => option.label === inputValue) && (
                    <CommandItem
                      className="flex justify-between px-4 rounded-none cursor-pointer data-[selected=true]:font-semibold"
                      value={inputValue}
                      data-selected="true"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <>
                        <span>{inputValue}</span>
                        <span className="text-gray-500">(new value)</span>
                      </>
                    </CommandItem>
                  )}

                {availableOptions.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      className="px-4 rounded-none cursor-pointer data-[selected=true]:font-semibold"
                      value={option.label}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={handleItemSelect}
                    >
                      {option.label}
                    </CommandItem>
                  );
                })}
              </>
            </CommandList>
          </div>
        )}
      </div>
    </Command>
  );
};
