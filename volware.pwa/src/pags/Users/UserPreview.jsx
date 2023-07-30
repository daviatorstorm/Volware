import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ReactImageGallery from 'react-image-gallery';

import './UserPreview.css';

import UserService from '../../services/UserService';
import StorageService from '../../services/StorageService';
import { UserRoleEnumTranslate } from '../../enums/UserRoleEnum';
import Actions from '../../components/Actions/Actions';

function UserPreview() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const [state, setState] = useState({
        ...location.state
    });

    const handleSubmit = (user) => {
        UserService.addUser(user);
    }

    const { firstName, lastName, thirdName, email, city, profilePhotoUrl, images,
        phoneNumber, profilePhoto, role } = state;

    useEffect(() => {
        if (params['id']) {
            UserService.getById(params['id']).then((res) => {
                const { firstName, lastName, username, email, documentImages,
                    profileImage, role } = res.data;

                const promises = [];
                documentImages.forEach((item) => {
                    promises.push(StorageService.getBlob(item).then(res => {
                        return { blob: res.data, url: window.URL.createObjectURL(res.data) }
                    }))
                });
                promises.push(StorageService.getBlob(profileImage).then(res => {
                    return { blob: res.data, url: window.URL.createObjectURL(res.data) }
                }));

                Promise.all(promises).then((values) => {
                    const images = [];
                    for (let index = 0; index < values.length - 1; index++) {
                        images.push(values[index]);
                    }
                    setState({
                        firstName, lastName, username, email, role, images,
                        profilePhotoUrl: values[values.length - 1].url
                    });
                });
            });
        }
    }, []);

    return (
        <div className='main-container'>
            {
                params['id'] ?
                    <Actions left={
                        <img src="/back-arrow.svg" width="23px" height="22px" alt="add" onClick={() => navigate(location.state?.backUrl || '/users')} />
                    } />
                    :
                    <Actions left={
                        // <img src="/back-arrow.svg" width="23px" height="22px" alt="add" onClick={
                        //     () => navigate(location.state?.backUrl || '/users/add/document-photo', { state })} />
                        <img src="/back-arrow.svg" width="23px" height="22px" alt="add" onClick={
                            () => navigate(location.state?.backUrl || '/users/add', { state })} />
                    } right={
                        <img src="/check-mark.svg" width="23px" height="22px" alt="add" onClick={() => handleSubmit({
                            firstName, lastName, thirdName, email, city, images, phoneNumber, profilePhoto, role
                        })} />
                    } />
            }

            <div className='flex'>
                <div className='col-1'>
                    <img style={{ width: '100%' }} src={profilePhotoUrl} alt='Not found' />
                </div>
                <div className='col-1'>
                    <p>{firstName}</p>
                    <p>{lastName}</p>
                    <p>{thirdName}</p>
                    <p>{city}</p>
                    <p>{email}</p>
                    <p>{phoneNumber}</p>
                </div>
            </div>

            <div className='flex'>
                <div className='col-1'>
                    <p>{UserRoleEnumTranslate[role]}</p>
                </div>
            </div>

            <div className='flex col-1'>
                <ReactImageGallery items={(images || []).map(img => { return { original: img.url } })} />
            </div>
        </div>
    );
}

export default UserPreview;