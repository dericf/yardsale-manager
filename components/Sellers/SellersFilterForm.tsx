import Link from "next/link";
import { ChangeEvent, useEffect, useRef } from "react";
import { Button, Form, Input } from "semantic-ui-react";
import useForm, { FormValues } from "../../hooks/useForm";
import { useSellers } from "../../hooks/useSeller";
import { useYardsales } from "../../hooks/useYardsales";

export const SellersFilterForm = () => {
  const { filter, updateFilterText } = useSellers();
  const ref = useRef<HTMLInputElement>();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(filter.searchText);
    console.log(e.target.value);
    updateFilterText(e.target.value);
  };

  useEffect(() => {
    if (ref) ref.current.focus();
  }, []);

  return (
    <Form>
      <Form.Group inline className="mb0">
        <Link href="/sellers/new" as="/sellers/new">
          <Button>New</Button>
        </Link>
        <Form.Field>
          <Input
            placeholder="Search"
            icon="search"
            size="small"
            focus
            iconPosition="left"
            value={filter.searchText}
            onChange={handleChange}
            ref={ref}
          />
        </Form.Field>
      </Form.Group>
    </Form>
  );
};
