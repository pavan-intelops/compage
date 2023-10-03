import "./TextInput.styles.scss";

import { TextInputProps } from "./TextInput.types";
const TextInput = (
  { id, errorMessage, label, register, ...rest }: TextInputProps,
) => {
  if (register) {
    return (
      <div className="input-container">
        <label htmlFor={id} className="input-label">{label}</label>
        <input id={id} {...rest} {...register} className="input-field" />
        {errorMessage && <p className="input-error">{errorMessage}</p>}
      </div>
    );
  } else {
    return (
      <div className="input-container">
        <label htmlFor={id} className="input-label">{label}</label>
        <input id={id} {...rest} className="input-field" />
      </div>
    );
  }
};

export default TextInput;
