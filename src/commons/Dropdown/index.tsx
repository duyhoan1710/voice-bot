import { useState } from "react";

export const Dropdown = ({
  value,
  options,
  onChange,
}: {
  value?: string;
  options: string[];
  onChange: (value: any) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setOpen((preValue) => !preValue)}
        >
          {value || options[0]}
          <svg
            className="-mr-1 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div
        className={`absolute right-0 top-[-80px] z-10 w-56 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
          !open && "hidden"
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        {options.map((value) => (
          <div
            className="text-gray-700 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
            key={value}
            onClick={() => {
              onChange(value);
              setOpen(false);
            }}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
};
