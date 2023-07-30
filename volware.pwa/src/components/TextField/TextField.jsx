import classes from './text-field.module.scss';

const TextField = ({ text }) => {
    return (
        <div className={classes.textField}>{text}</div>
    )
}

export default TextField;