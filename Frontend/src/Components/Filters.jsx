// src/components/Filters.jsx
import React from "react";
import { filters } from "../data/products";
import AccordionFilterSection from "./AccordionFilterSection";
import PriceSlider from "./PriceSlider";

const Filters = ({
  onFilterChange,
  priceRange,
  setPriceRange,
  minPrice,
  maxPrice,
  resetFilters,
  activeFilters,
}) => {
  const hasActiveFilters =
    Object.keys(activeFilters).length > 0 ||
    priceRange[0] > minPrice ||
    priceRange[1] < maxPrice;

  return (
    <aside className="lg:col-span-1 bg-gradient-to-b from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 self-start shadow-sm">
      <h2 className="sr-only">Filters</h2>

      {hasActiveFilters && (
        <div className="pb-4 border-b border-indigo-100">
          <button
            type="button"
            onClick={resetFilters}
            className="w-full text-sm font-medium text-center text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
          >
            Reset All Filters
          </button>
        </div>
      )}

      <AccordionFilterSection
        title="Categories"
        options={filters.categories}
        onFilterChange={onFilterChange}
      />
      <AccordionFilterSection
        title="Brands"
        options={filters.brands}
        onFilterChange={onFilterChange}
        searchable={true}
      />
      <AccordionFilterSection
        title="Sizes"
        options={filters.sizes}
        onFilterChange={onFilterChange}
      />
      <AccordionFilterSection
        title="Conditions"
        options={filters.conditions}
        onFilterChange={onFilterChange}
      />
      <AccordionFilterSection
        title="Colors"
        options={filters.colors}
        onFilterChange={onFilterChange}
        searchable={true}
      />

      <PriceSlider
        min={minPrice}
        max={maxPrice}
        values={priceRange}
        onChange={setPriceRange}
      />
    </aside>
  );
};

export default Filters;
