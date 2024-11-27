import { Controller } from "react-hook-form";
import { DropdownList } from "react-widgets";
import { FormGroup, Label } from "reactstrap";

const FormDropdown = ({ name, label, errors, control, rules, data, ...rest }) => {
    if (!control) return;
    const { required } = rules || {};
    const optionsWithEmpty = ['', ...(data || [])];
    return <FormGroup>
        <Label>{label}{required && <span className="required">*</span>}</Label>
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => <DropdownList {...rest} {...field} data={optionsWithEmpty} />}
        />
        {errors[name] && <span className="required">{errors[name]?.message}</span>}
    </FormGroup>
};

export default FormDropdown;