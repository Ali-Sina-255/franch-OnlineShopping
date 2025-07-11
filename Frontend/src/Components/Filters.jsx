// src/components/Filters.jsx
import React from "react";
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
  filterOptions, // New prop with dynamic options
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

      {/* Dynamic Filter Sections */}
      {filterOptions.brands.length > 0 && (
        <AccordionFilterSection
          title="Brands"
          options={filterOptions.brands}
          onFilterChange={onFilterChange}
          searchable={true}
        />
      )}
      {filterOptions.sizes.length > 0 && (
        <AccordionFilterSection
          title="Sizes"
          options={filterOptions.sizes}
          onFilterChange={onFilterChange}
        />
      )}
      {filterOptions.conditions.length > 0 && (
        <AccordionFilterSection
          title="Conditions"
          options={filterOptions.conditions}
          onFilterChange={onFilterChange}
        />
      )}
      {filterOptions.colors.length > 0 && (
        <AccordionFilterSection
          title="Colors"
          options={filterOptions.colors}
          onFilterChange={onFilterChange}
          searchable={true}
        />
      )}

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
