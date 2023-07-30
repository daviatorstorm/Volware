import classes from './user-card.module.scss'

import TextField from "../TextField/TextField";
import { UserRoleEnumTranslate } from '../../enums/UserRoleEnum';

const UserCard = ({ profile }) => {
    const { firstName, lastName, thirdName, role, profileImage } = profile;

    return (
        <>
            <div className={classes.userCard}>
                <div className={classes.userCard__firstSection + 'col-1'}>
                    <div className={classes.userCard__avatar}>
                        <img src={profileImage} alt="avatar" />
                    </div>
                    <div style={{ marginTop: '11px' }}>{UserRoleEnumTranslate[role]}</div>
                </div>

                <div className='col-1'>
                    <div>
                        <TextField text={firstName} />
                    </div>
                    <div>
                        <TextField text={lastName} />
                    </div>
                    <div>
                        <TextField text={thirdName} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserCard;