import classes from './button.module.scss';
import classNames from "classnames";

const Button = ({text, color, onClick}) => {
    const classOther = classNames(
        classes.button,
        {
            [classes[`button_${color}`]]: color
        },
    );

    return (
        <button
            className={classOther}
            onClick={onClick}
        >
            {text}
        </button>
    )
}

export default Button;