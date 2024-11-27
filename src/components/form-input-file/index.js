import { Controller } from "react-hook-form";
import { FormGroup, Input, Label } from "reactstrap";

const FormInputFile = ({ name, label, errors, control, onChange, rules, ...rest }) => {
    if (!control) return null; // Return null instead of an empty string
    const { required } = rules || {};
    return (
        <FormGroup>
            <Label>{label}{required && <span className="required">*</span>}</Label>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) => (
                    <Input
                        type="file"
                        {...rest}
                        onChange={(e) => {
                            field.onChange(e.target.files[0]); // Update the field value with the selected file
                            onChange(e, name, name);
                        }}
                    />
                )}
            />
            {errors[name] && <span className="required">{`${label} is required`}</span>}
        </FormGroup>
    );
};

export default FormInputFile;
