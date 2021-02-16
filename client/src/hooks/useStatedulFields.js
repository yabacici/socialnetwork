// keep track of input field changing
import { useState } from "react";

export function useStatefulFields() {
    const [values, setValues] = useState({});
    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };
    return [values, handleChange];
}
