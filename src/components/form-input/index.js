import { Controller } from "react-hook-form";
import { FormGroup, Input, Label } from "reactstrap";

const FormInput = ({ name, label, errors, control, rules, ...rest }) => {
    if (!control) return;
    const { required } = rules || {};
    return <FormGroup>
        <Label>{label}{required && <span className="required">*</span>}</Label>
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => <Input {...rest} {...field} />}
        />
        {errors[name] && <span className="required">{`${label} is required`}</span>}
    </FormGroup>
};

export default FormInput;