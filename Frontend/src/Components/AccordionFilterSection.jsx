// src/components/AccordionFilterSection.jsx
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const AccordionFilterSection = ({
  title,
  options,
  onFilterChange,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  return (
    <div className="border-b border-indigo-100 py-6">
      <h3 className="-my-3 flow-root">
        <button
          type="button"
          className="flex w-full items-center justify-between bg-white py-3 text-sm text-indigo-400 hover:text-indigo-600 transition-colors duration-150"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-medium text-indigo-900">{title}</span>
          <span className="ml-6 flex items-center">
            {isOpen ? (
              <Minus className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Plus className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
        </button>
      </h3>
      {isOpen && (
        <div className="pt-6">
          {searchable && (
            <input
              type="search"
              placeholder={`Search ${title}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-4 rounded-xl border border-indigo-200 bg-white py-2 px-3 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all duration-200"
            />
          )}
          
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {filteredOptions.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  id={`${title}-${option}`}
                  name={`${title}[]`}
                  type="checkbox"
                  onChange={() => onFilterChange(title, option)}
                  className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-200"
                />
                <label
                  htmlFor={`${title}-${option}`}
                  className="ml-3 text-sm text-indigo-800"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccordionFilterSection;
