import classes from './actions.module.scss';
import { useNavigate } from 'react-router-dom';

const Actions = ({ backUrl, withAddBtn, addFunc, left, right }) => {
    const navigate = useNavigate();
    return (
        <div className={classes.actions}>
            {
                left || backUrl ?
                    <div className='action-left'>
                        {left}
                        {backUrl && <img src="/back-arrow.svg" alt="back-arrow" onClick={() => navigate(backUrl)} />}
                    </div> : ''
            }
            {
                right || withAddBtn ?
                    <div className='action-right'>
                        {right}
                        {withAddBtn && <img src="/add.svg" alt="add" onClick={addFunc} />}
                    </div> : ''
            }
        </div>
    );
}

export default Actions;
