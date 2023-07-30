import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import classes from './users.module.scss'

import UserList from '../UserList/UserList';
import UserService from '../../../services/UserService';
import Actions from '../../../components/Actions/Actions';
import { debounce } from '../../../helpers/utils';
import SearchInput from '../../../components/SearchInput/SearchInput';

const debounceSearch = debounce((callback) => {
    callback();
}, 1000);

const Users = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        users: []
    });

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = (q) => {
        UserService.getUsers(q).then((response) => {
            setState({
                ...state,
                users: response.data
            });
        });
    }

    const searchTermChanged = (el) => {
        setState({ ...state, searchTerm: el });
        debounceSearch(() => {
            getUsers(el);
        });
    };

    const addUser = () => {
        navigate('/users/add');
    }

    const handleClick = (user) => {
        navigate(`/users/${user.id}`, { state: { backUrl: '/users' } });
    }

    return (
        <div className={classes.users}>
            <Actions backUrl={'/'} withAddBtn={true} addFunc={addUser} />

            <SearchInput callback={searchTermChanged} />

            <h2>Користувачі</h2>

            <div style={{ marginTop: '30px' }} />
            <UserList onClick={user => handleClick(user)} users={state.users} />
        </div>
    );
}

export default Users;
