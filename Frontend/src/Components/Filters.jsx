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
  filterOptions,
}) => {
  const hasActiveFilters =
    Object.keys(activeFilters).length > 0 ||
    priceRange[0] > minPrice ||
    priceRange[1] < maxPrice;

  const filterSections = [
    {
      key: "brands",
      title: "Brands",
      searchable: true,
      condition: filterOptions.brands.length > 0,
      defaultOpen: false,
    },
    {
      key: "sizes",
      title: "Sizes",
      searchable: false,
      condition: filterOptions.sizes.length > 0,
      defaultOpen: false,
    },
    {
      key: "conditions",
      title: "Conditions",
      searchable: false,
      condition: filterOptions.conditions.length > 0,
      defaultOpen: false,
    },
    {
      key: "colors",
      title: "Colors",
      searchable: true,
      condition: filterOptions.colors.length > 0,
      defaultOpen: false,
    },
  ];

  return (
    <aside className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 self-start shadow-sm lg:sticky  top-4">
      {/* Changed from sticky to lg:sticky */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="w-full text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-150 flex items-center justify-center"
          >
            Reset All Filters
          </button>
        )}

        <PriceSlider
          min={minPrice}
          max={maxPrice}
          values={priceRange}
          onChange={setPriceRange}
        />

        <div className="space-y-4">
          {filterSections.map(
            ({ key, title, searchable, condition, defaultOpen }) =>
              condition && (
                <AccordionFilterSection
                  key={key}
                  title={title}
                  options={filterOptions[key]}
                  onFilterChange={onFilterChange}
                  searchable={searchable}
                  defaultOpen={defaultOpen}
                />
              )
          )}
        </div>
      </div>
    </aside>
  );
};

export default Filters;
