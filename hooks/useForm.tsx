import { useState, useEffect, useRef } from "react";
import { useAlert } from "./useAlert";

export interface FormValues {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}

export interface UseFormReturn {
  values: FormValues;
  errors: FormErrors;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: any) => void;
}

export interface UseFormParams {
  initialValues: FormValues;
  onSubmit: (values: FormValues, errors: FormErrors) => void;
  validate?: () => FormErrors;
}

const useForm = ({ initialValues, onSubmit, validate }: UseFormParams) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({});
  const [onSubmitting, setOnSubmitting] = useState<boolean>(false);
  const [onBlur, setOnBlur] = useState<boolean>(false);

  const { sendError, sendAlert } = useAlert();

  const formRendered = useRef(true);

  useEffect(() => {
    if (formRendered.current) {
      setValues(initialValues);
      setErrors({});
      setTouched({});
      setOnSubmitting(false);
      setOnBlur(false);
    }
    formRendered.current = false;
  }, [initialValues]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const { name, value } = target;
    // event.persist();
    setValues({ ...values, [name]: value });
    // console.log("Changing...");
    // console.log(name, value);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const { name } = target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors });
  };

  const handleSubmit = (event: any) => {
    if (event) event.preventDefault();

    let validateErrors;
    if (validate) {
      validateErrors = validate();
    }
    if (validateErrors && Object.keys(validateErrors).length !== 0) {
      setErrors({ ...validateErrors });
			for (const err of Object.values(validateErrors)) {
				sendError(err);
			}
    } else {
      onSubmit(values, errors);
    }
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  } as UseFormReturn;
};

export default useForm;
