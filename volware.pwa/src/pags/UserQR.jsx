import React from 'react';
import { useParams } from 'react-router-dom';

import UserRoleEnum from '../enums/UserRoleEnum';
import UserService from '../services/UserService';

function RouterParamsWrapper(props) {
    const params = useParams();

    return (<UserQR params={params} {...props} />);
}

class UserQR extends React.Component {
    state = {
        user: null,
        isError: null,
        errorMessage: null
    }

    componentDidMount() {
        UserService.getUserByQR(this.props.params.qr)
            .then((response) => {
                this.setState({ ...this.state, user: response.data })
            }).catch(err => {
                switch (err.response.status) {
                    case 404:
                        this.setState({
                            isError: true,
                            errorMessage: 'UserCard not found'
                        });
                        break;
                    case 400:
                        this.setState({
                            isError: true,
                            errorMessage: 'UserCard QR expired'
                        });
                        break;
                    default:
                        this.setState({
                            isError: true,
                            errorMessage: 'Error occured'
                        });
                        break;
                }
                if (err.response.status === 400) {

                }
                console.log(err);
            });
    }

    render() {
        return (
            <div>
                <h1>User info</h1>
                {
                    this.state.user &&
                    <table>
                        <tbody>
                            <tr>
                                <td>User name</td>
                                <td>{this.state.user.username}</td>
                            </tr>
                            <tr>
                                <td>First name</td>
                                <td>{this.state.user.firstName}</td>
                            </tr>
                            <tr>
                                <td>Last name</td>
                                <td>{this.state.user.lastName}</td>
                            </tr>
                            <tr>
                                <td>Role</td>
                                <td>{UserRoleEnum[this.state.user.role]}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{this.state.user.email}</td>
                            </tr>
                        </tbody>
                    </table>
                }
                {
                    this.state.errorMessage &&
                    <div className='error-message'>
                        QR do not exist
                    </div>
                }
            </div >
        );
    }
}

export default RouterParamsWrapper;