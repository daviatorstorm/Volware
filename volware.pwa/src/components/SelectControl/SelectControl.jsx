import { components } from 'react-select';

const SelectControl = ({ children, ...props }) => (
    <components.Control className='react-select-control' {...props}>
        {children}
    </components.Control>
);

export default SelectControl;