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
  setValues: (values: FormValues) => void,
  errors: FormErrors;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { target } = event;
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };


  const handleBlur = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { target } = event;
    const { name } = target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors });
  };

  const handleSubmit = (event: any) => {
    if (event) event.preventDefault();
    
    // Check if a validate function was passed
    let validateErrors: FormValues;
    if (validate) {
      validateErrors = validate();
    }
    // Check if any errors were triggered
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
    setValues,
    errors,
    handleChange,
    handleSubmit,
  } as UseFormReturn;
};

export default useForm;
