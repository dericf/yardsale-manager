import Link from "next/link";
import { ChangeEvent, useEffect, useRef } from "react";
import { Button, Dropdown, Form, Input, Select } from "semantic-ui-react";
import useForm, { FormValues } from "../../hooks/useForm";
import { useYardsales } from "../../hooks/useYardsales";
import { YardSaleSortBy } from "../../types/Context";
import { DropdownData, YardSaleSortByOptions } from "../../types/DropdownOptions";

export const YardSaleFilterForm = () => {
  const { filter, updateFilterText, setFilter } = useYardsales();
  const ref = useRef<Input>();
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFilter({
      searchText: e.target.value,
      sortBy: {
        key: e.target.innerText,
        text: e.target.innerText,
        value: e.target.value as YardSaleSortBy,
      },
    });

    // updateFilterText(e.target.value);
  };

  useEffect(() => {
    if (ref) ref.current.focus();
  }, []);

  return (
    <Form>
      <Form.Group inline className="mb0">
        <Link href="/yardsales/new" as="/yardsales/new">
          <Button color="blue" style={{marginTop: 16}}>New</Button>
        </Link>
        <Form.Field style={{marginTop: 16}}>
          <Input
            placeholder="Search"
            icon="search"
            focus
            iconPosition="left"
            value={filter.searchText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFilter({ ...filter, searchText: e.target.value });
            }}
            ref={ref}
          />
        </Form.Field>

        <Form.Field style={{marginTop: 16}}>
          <Dropdown
            closeOnChange
            icon="filter"
            floating
            labeled
            basic
            button
            name="sortBy"
            text="Sort"
            className="icon"
            onChange={async (e: React.SyntheticEvent, data: DropdownData) => {
              const target = e.target as HTMLSpanElement
              setFilter({
                ...filter,
                sortBy: {
                  key: target.innerText,
                  text: target.innerText,
                  value: data.value as YardSaleSortBy,
                },
              });
            }}
            options={YardSaleSortByOptions}
            value={filter.sortBy.value}
          />
        </Form.Field>
      </Form.Group>
    </Form>
  );
};
