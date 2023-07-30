import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';

import UserRoleEnum, { UserRoleEnumTranslate } from '../../enums/UserRoleEnum';
import Actions from '../../components/Actions/Actions';
import TextInput from '../../components/TextInput/TextInput';
import SelectControl from '../../components/SelectControl/SelectControl';

function UserAdd() {
    const location = useLocation();
    const navigate = useNavigate();

    const [state, setState] = useState(location.state || {
        firstName: '',
        lastName: '',
        thirdName: '',
        email: '',
        city: '',
        phoneNumber: '',
        role: UserRoleEnum.None,
        selectedRole: { value: UserRoleEnum.None, label: UserRoleEnumTranslate[UserRoleEnum.None] },
        profilePhoto: null,
        images: null,
        selectInvalid: false
    });

    const validationObject = {
        firstName: useRef(null),
        lastName: useRef(null),
        thirdName: useRef(null),
        email: useRef(null),
        city: useRef(null),
        phoneNumber: useRef(null),
        profilePhoto: useRef(null),
        documentPhotos: useRef(null),
        profilePhotoBtn: useRef(null),
        documentPhotosBtn: useRef(null)
    }

    const options = [
        { value: UserRoleEnum.None, label: UserRoleEnumTranslate[UserRoleEnum.None] },
        // TODO: Until accesses work
        // { value: UserRoleEnum.Manager, label: UserRoleEnumTranslate[UserRoleEnum.Manager] },
        { value: UserRoleEnum.Volenteer, label: UserRoleEnumTranslate[UserRoleEnum.Volenteer] }
    ];

    const handleRoleSelect = (select) => {
        setState({
            ...state,
            selectedRole: select,
            role: select.value
        });
    }

    const inputChangeHandler = (el, propertyName) => {
        setState({
            ...state,
            [propertyName]: el.target.value
        });
    }

    const fileChangeHandle = (el, prop) => {
        const files = el.target.files;

        switch (prop) {
            case 'profilePhoto':
                setState({
                    ...state,
                    profilePhoto: files[0],
                    profilePhotoUrl: window.URL.createObjectURL(files[0]),
                });
                break;
            case 'documentPhotos':
                const images = [];
                for (let i = 0; i < el.target.files.length; i++) {
                    const file = el.target.files[i];
                    images.push({ blob: file, url: window.URL.createObjectURL(file) });
                }
                setState({
                    ...state,
                    images
                });
                break;
            default:
                toast.error('Wrong input');
                break;
        }
    }

    const fileButtonClickHandle = (ref) => {
        if (ref.current.click) {
            ref.current.click();
        }
    }

    const validate = () => {
        let isValid = true;
        for (const iterator of ['firstName', 'lastName', 'thirdName', 'email', 'city', 'phoneNumber']) {
            if (!state[iterator]) {
                validationObject[iterator].current.classList.add('invalid-input');

                isValid = false;
            } else {
                validationObject[iterator].current.classList.remove('invalid-input');
            }
        }

        if (state.role === UserRoleEnum.None) {
            setState({
                ...state,
                selectInvalid: true
            });
            isValid = false;
        }

        if (!state.profilePhoto) {
            validationObject.profilePhotoBtn.current.classList.add('invalid-input');
            isValid = false;
        } else {
            validationObject.profilePhotoBtn.current.classList.remove('invalid-input');
        }

        if (!state.images) {
            validationObject.documentPhotosBtn.current.classList.add('invalid-input');
            isValid = false;
        } else {
            validationObject.documentPhotosBtn.current.classList.remove('invalid-input');
        }

        return isValid;
    }

    const handleSubmit = () => {
        if (validate()) {
            navigate('/users/add/preview', {
                replace: false,
                state
            });
        }
    }

    const { firstName, lastName, thirdName, email, city, phoneNumber, selectedRole } = state;

    return (
        <div className="main-container">
            <Actions backUrl={location.state?.backUrl || '/users'} />

            <h2>Новий користувач</h2>

            <div className='col-1'>
                <form onSubmit={handleSubmit}>
                    <div className='form-control'>
                        <TextInput type='text' name="firstName" placeholder='Імя'
                            value={firstName} onChange={(el) => inputChangeHandler(el, 'firstName')}
                            ref={validationObject.firstName} />
                    </div>
                    <div className='form-control'>
                        <TextInput type='text' name="lastName" placeholder='Прізвище'
                            value={lastName} onChange={(el) => inputChangeHandler(el, 'lastName')}
                            ref={validationObject.lastName} />
                    </div>
                    <div className='form-control'>
                        <TextInput type='text' name="thirdName" placeholder='По-батькові'
                            value={thirdName} onChange={(el) => inputChangeHandler(el, 'thirdName')}
                            ref={validationObject.thirdName} />
                    </div>
                    <div className='form-control'>
                        <TextInput type='text' name="email" placeholder='Ел. пошта'
                            value={email} onChange={(el) => inputChangeHandler(el, 'email')}
                            ref={validationObject.email} />
                    </div>
                    <div className='form-control'>
                        <TextInput type='text' name="city" placeholder='Місто'
                            value={city} onChange={(el) => inputChangeHandler(el, 'city')}
                            ref={validationObject.city} />
                    </div>
                    <div className='form-control'>
                        <TextInput type='text' name="phoneNumber" placeholder='Мобільний телефон'
                            value={phoneNumber} onChange={(el) => inputChangeHandler(el, 'phoneNumber')}
                            ref={validationObject.phoneNumber} />
                    </div>
                    <div className='form-control'>
                        <Select
                            className='react-select'
                            value={selectedRole}
                            options={options}
                            onChange={handleRoleSelect}
                            name='role'
                            placeholder='Роль'
                            components={{ Control: SelectControl }}
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    'borderColor': state.selectInvalid ?
                                        'red' : 'initial'
                                })
                            }} />
                    </div>

                    <div className='form-control'>
                        <input hidden type="file" onChange={el => fileChangeHandle(el, 'profilePhoto')} ref={validationObject.profilePhoto} />
                        <button type='button' className='btn' onClick={el => fileButtonClickHandle(validationObject.profilePhoto)} ref={validationObject.profilePhotoBtn}>
                            Виберіть фото профілю
                        </button>
                    </div>

                    <div className='form-control'>
                        <input hidden multiple type="file" onChange={el => fileChangeHandle(el, 'documentPhotos')} ref={validationObject.documentPhotos} />
                        <button type='button' className='btn' onClick={el => fileButtonClickHandle(validationObject.documentPhotos)} ref={validationObject.documentPhotosBtn}>
                            Виберіть фото документів
                        </button>
                    </div>


                    <div className='form-control flex'>
                        <div className='col-right col-1 text-right'>
                            <button type='button' className='btn' onClick={() => handleSubmit()}>Далі</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserAdd;