import { forwardRef } from "react";

import './TextInput.scss';

const TextInput = forwardRef((props, ref) => (
    <>
        <input className='input' type={props.type} name={props.name} placeholder={props.placeholder}
            value={props.value} onChange={(el) => props.onChange(el, props.name)} ref={ref} />
    </>
));

export default TextInput;