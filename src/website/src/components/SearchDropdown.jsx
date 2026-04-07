import React, { useMemo, useState } from "react";
import { useTowns } from "../api-hooks";
import { slugify } from "../utils";
import Select from "react-select";

const OPTIONS = [
  "Option One",
  "Option Two",
  "Option Three",
  "Another Example",
  "Something Else",
  "Sample Entry",
];

function SearchDropdown() {
  const { isLoading, isError, data } = useTowns();
  const townNames = useMemo(
    () =>
      data
        ? data
            .filter((town) => town.name && town.name != "Example Town")
            .map((town) => ({ value: town.name, label: town.name }))
        : [],
    [data],
  );
  const isDisabled = isLoading || isError;
  const [selected, setSelected] = useState(undefined);

  return (
    <div className="dropdown-container">
      <div className="dropdown">
        <Select
          classNamePrefix="select"
          placeholder="Select a municipality..."
          isDisabled={isDisabled}
          isLoading={isLoading}
          isClearable
          isSearchable
          name="municipality"
          options={townNames}
          onChange={(selectedOption) => {
            setSelected(selectedOption.value);
            console.log("slugified:", slugify(selectedOption.value));
          }}
        />
      </div>
      <a
        className="submit-button"
        disabled={isDisabled || !selected}
        href={selected ? `/${slugify(selected)}` : undefined}
      >
        Submit
      </a>
    </div>
  );
}

export default SearchDropdown;
