import Link from "next/link";
import { ChangeEvent, useEffect, useRef } from "react";
import { Button, Dropdown, Form, Input } from "semantic-ui-react";
import useForm, { FormValues } from "../../hooks/useForm";
import { useSellers } from "../../hooks/useSeller";
import { useYardsales } from "../../hooks/useYardsales";
import { SellerSortBy } from "../../types/Context";
import { SellersSortByOptions } from "../../types/DropdownOptions";

export const SellersFilterForm = () => {
  const { filter, setFilter, updateFilterText } = useSellers();
  const ref = useRef<HTMLInputElement>();
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFilter({
      searchText: e.target.value,
      sortBy: {
        key: e.target.innerText,
        text: e.target.innerText,
        value: e.target.value as SellerSortBy,
      },
    });
  };

  useEffect(() => {
    if (ref) ref.current.focus();
  }, []);

  return (
    <Form>
      <Form.Group inline className="mb0">
        <Link href="/sellers/new" as="/sellers/new">
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
            onChange={async (e: React.SyntheticEvent, data: object) => {
              setFilter({
                ...filter,
                sortBy: {
                  key: e.target.innerText,
                  text: e.target.innerText,
                  value: data.value as SellerSortBy,
                },
              });
            }}
            options={SellersSortByOptions}
            value={filter.sortBy.value}
          />
        </Form.Field>
      </Form.Group>
    </Form>
  );
};
