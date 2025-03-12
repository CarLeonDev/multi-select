import { useCallback, useEffect, useRef, useState } from "react";
import cn from "clsx";
import { CommandEmpty, Command as CommandPrimitive } from "cmdk";

import { CommandItem, CommandList } from "@/components/ui/command";
import { Highlight } from "@/components/ui/highlight";
import { X } from "lucide-react";

export type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: Option[];
  value?: Option[];
  placeholder?: string;
  onChange: (selected: Option[]) => void;
};

const isMatchQuery = (text: string, query: string) => {
  return text.toLowerCase().trim().includes(query.toLowerCase().trim());
};

export const MultiSelect = ({
  options,
  value,
  placeholder = "typing to search...",
  onChange,
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

  const handleSelect = useCallback(
    (option: Option) => {
      const newOptions = [...selected, option];
      setSelected(newOptions);
      setInputValue("");
      onChange?.(newOptions);
      inputRef.current?.focus();
    },
    [onChange, selected]
  );

  const handleUnselect = useCallback(
    (value: string) => {
      const newOptions = selected.filter((option) => option.value !== value);
      setSelected(newOptions);
      onChange?.(newOptions);
    },
    [onChange, selected]
  );

  const availableOptions = options.filter(
    (option) =>
      !selected.some((selected) => selected.value === option.value) &&
      isMatchQuery(option.label, inputValue)
  );

  const optionAlreadySelected = selected.some(
    (option) =>
      option.label.toLowerCase().trim() === inputValue.toLowerCase().trim()
  );

  const shouldBeCreatedNewOption =
    inputValue.length > 0 &&
    !availableOptions.some((option) =>
      isMatchQuery(option.label, inputValue)
    ) &&
    !optionAlreadySelected;

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [handleClickOutside, open]);

  useEffect(() => {
    if (value) {
      setSelected(value);
    }
  }, [value]);

  return (
    <CommandPrimitive
      ref={dropdownRef}
      className="overflow-visible bg-transparent text-left"
      shouldFilter={false}
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
              <X
                className="w-3 h-3 text-gray-500 cursor-pointer"
                onClick={() => handleUnselect(option.value)}
              />
            </div>
          ))}

          <CommandPrimitive.Input
            ref={inputRef}
            className={cn(
              "min-h-7 flex-1 field-sizing-content max-w-full px-1 text-xs bg-transparent outline-none",
              {
                "px-2": selected.length === 0,
              }
            )}
            value={inputValue}
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
                <CommandEmpty className="px-4 py-2">
                  {inputValue.length === 0 ? (
                    "No options available"
                  ) : optionAlreadySelected ? (
                    <>
                      <span className="font-semibold">{inputValue.trim()}</span>{" "}
                      already selected
                    </>
                  ) : (
                    <>
                      No options available for{" "}
                      <span className="font-semibold">{inputValue.trim()}</span>
                    </>
                  )}
                </CommandEmpty>

                {shouldBeCreatedNewOption && (
                  <OptionItem
                    option={{ value: inputValue, label: inputValue }}
                    onSelect={handleSelect}
                  >
                    <div className="flex-1 flex justify-between">
                      <span>{inputValue}</span>
                      <span className="text-gray-500">(new value)</span>
                    </div>
                  </OptionItem>
                )}

                {availableOptions.map((option) => {
                  return (
                    <OptionItem
                      key={option.value}
                      option={option}
                      onSelect={handleSelect}
                    >
                      <Highlight search={inputValue}>{option.label}</Highlight>
                    </OptionItem>
                  );
                })}
              </>
            </CommandList>
          </div>
        )}
      </div>
    </CommandPrimitive>
  );
};

type OptionItemProps = {
  option: Option;
  onSelect: (option: Option) => void;
  children?: React.ReactNode;
};

export const OptionItem = ({ option, onSelect, children }: OptionItemProps) => {
  return (
    <CommandItem
      className="px-4 rounded-none cursor-pointer data-[selected=true]:font-semibold gap-0"
      value={option.label}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onSelect={() => onSelect(option)}
    >
      {children || option.label}
    </CommandItem>
  );
};
