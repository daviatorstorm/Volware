import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import classes from './dashboard.module.scss'

import UserRoleEnum from '../../enums/UserRoleEnum';
import UserCard from "../../components/UserCard/UserCard";
import Button from "../../components/Button/Button";
import UserService from '../../services/UserService';
import StorageService from '../../services/StorageService';

function Dashboard() {
    const navigator = useNavigate();

    const [profile, setProfile] = useState({});
    const [userQr, setUserQr] = useState('');

    // const resetQR = () => {
    //     UserService.getMyQR().then((res) => {
    //         console.log(res);
    //         setUserQr(URL.createObjectURL(res.data));
    //     });
    // }

    // setTimeout(resetQR, 60000)

    useEffect(() => {
        // resetQR();
        UserService.getProfile().then(res => {
            StorageService.getBlob(res.data.profileImage).then(profileImage => {
                setProfile({
                    ...res.data,
                    profileImage: window.URL.createObjectURL(profileImage.data)
                });
            });
        });
    }, [])

    return (
        <div className={classes.dashboard}>
            <UserCard profile={profile} />

            {/* <div className={classes.dashboard__qrCode}>
                <img src={userQr} alt="qr" className="qrImage" />
            </div>

            <div className={classes.qrCodeActions} style={{ marginTop: '4px' }}>
                <img src="/Vector.svg" alt="SVG" style={{ marginRight: '17px' }} onClick={resetQR} />

                <Button text={'Сканувати QR'} onClick={() => navigator('/scanQR')} />
            </div> */}

            {
                (isInRole(UserRoleEnum.WarehouseAdmin) || isInRole(UserRoleEnum.Manager)) &&
                (
                    <>
                        <div className={classes.qrCodeActions} style={{ marginTop: '25px' }}>
                            <img src="/stuff.svg" alt="SVG" style={{ marginRight: '24px' }} onClick={() => navigator('/warehouse')} />
                            <div className={classes.qrCodeActions__divider} />
                            <img src="/users.svg" alt="SVG" style={{ marginLeft: '24px' }} onClick={() => navigator('/users')} />
                        </div>

                        <div className={classes.qrCodeActions} style={{ marginTop: '25px' }}>
                            <img src="/script.svg" alt="SVG" style={{ marginRight: '24px' }}
                                width="129" height="126" onClick={() => navigator('/actions')} />
                            <div className={classes.qrCodeActions__divider} />
                            <img src="/orders-icon.svg" alt="SVG" style={{ marginLeft: '24px' }}
                                width="129" height="126" onClick={() => navigator('/orders')} />
                        </div>
                    </>
                )
            }

            <div style={{ marginTop: '25px' }} />
            <Button color={'red'} text={'Вийти з профілю'} onClick={() => } />
        </div>
    );
}

export default Dashboard;
