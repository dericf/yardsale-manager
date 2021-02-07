import Link from "next/link";
import { ChangeEvent, useEffect, useRef } from "react";
import { Button, Form, Input } from "semantic-ui-react";
import useForm, { FormValues } from "../../hooks/useForm";
import { useYardsales } from "../../hooks/useYardsales";

export const YardSaleFilterForm = () => {
  const { filter, updateFilterText } = useYardsales();
  const ref = useRef();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateFilterText(e.target.value);
  };

  useEffect(() => {
    if (ref) ref.current.focus();
  }, []);

  return (
    <Form>
      <Form.Group inline className="mb0">
        <Link href="/yardsales/new" as="/yardsales/new">
          <Button>New</Button>
        </Link>
        <Form.Field width={8}>
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
