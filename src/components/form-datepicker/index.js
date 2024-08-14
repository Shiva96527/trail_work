import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { FormGroup, Label } from 'reactstrap';

const FormDatepicker = ({ name, label, errors, control, rules, data, ...rest }) => {
    if (!control) return;
    const { required } = rules || {};
    return (
        <FormGroup>
            <Label>{label}{required && <span className="required">*</span>}</Label><br />
            <Controller
                name={name}
                control={control}
                defaultValue={new Date()}
                render={({ field }) => (
                    <DatePicker
                        style={{ width: '100%' }}
                        selected={field.value}
                        {...rest}
                        onChange={(date) => field.onChange(date)}
                        className="form-control"
                    />
                )}
            />
            {errors[name] && <span className="required">{errors[name]?.message ? errors[name]?.message : `${label} is required`}</span>}
        </FormGroup>
    );
};

export default FormDatepicker;
