import TextField from "../../../components/TextField/TextField";
import ListItem from "../../../components/ListItem/ListItem";
import { UserRoleEnumTranslate } from "../../../enums/UserRoleEnum";

const UserList = ({ users, onClick }) => {
    return (
        <>
            {
                users.map(user => {
                    return (
                        <div key={user.id} onClick={() => onClick(user)}>
                            <TextField text={
                                <ListItem left={`${user.firstName} ${user.lastName}`} right={UserRoleEnumTranslate[user.role]} />
                            } />
                        </div>
                    )
                })
            }
        </>
    );
}

export default UserList;
