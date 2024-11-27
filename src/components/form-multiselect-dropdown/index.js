import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Controller } from "react-hook-form";
import { Multiselect } from "react-widgets";
import { FormGroup, Label } from "reactstrap";

const FormMultiSelectDropdown = ({ name, label, errors, control, rules, ...rest }) => {
    if (!control) return;
    const { required } = rules || {};
    return <FormGroup>
        <Label>{label}{required && <span className="required">*</span>}</Label>
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) =>
                <div style={{ position: 'relative' }}>
                    <Multiselect {...rest} {...field} />
                    {(field.value || []).length > 0 && (
                        <button
                            onClick={() => field.onChange([])}
                            style={{
                                position: 'absolute',
                                right: '15px',
                                top: '7px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <FontAwesomeIcon icon={faTimesCircle} color="gray" />
                        </button>
                    )}
                </div>
            }
        />
        {errors[name] && <span className="required">{errors[name]?.message}</span>}
    </FormGroup>
};

export default FormMultiSelectDropdown;