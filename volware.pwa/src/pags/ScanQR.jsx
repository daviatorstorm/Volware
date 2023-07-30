import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Actions from '../components/Actions/Actions';
import UserService from '../services/UserService';

import QRCodeScanner from '../helpers/QRCodeScanner';

function ScanQR() {
    const navigate = useNavigate();
    const [state, setState] = useState({
        bestChance: {},
        iterator: 0
    });

    useEffect(() => {
        setState({
            ...state,
            bestChance: null,
            iterator: 0
        });
    }, []);

    const onNewScanResult = (decodedText) => {
        if (state.iterator >= 5) {
            getUserByQR(decodedText);
        }

        ++state.iterator;

        if (!state.bestChance[decodedText]) {
            state.bestChance[decodedText] = 0;
        }

        setState({
            ...state
        });
    }

    const getUserByQR = (userQR) => {
        UserService.getUserByQR(userQR)
            .then((response) => {
                navigate('/users/add/preview', { state: { ...response.data, backUrl: '/scanQR' } });
            }).catch(err => {
                switch (err.response.status) {
                    case 404:
                        setState({
                            isError: true,
                            errorMessage: 'UserCard not found'
                        });
                        break;
                    case 400:
                        setState({
                            isError: true,
                            errorMessage: 'UserCard QR expired'
                        });
                        break;
                    default:
                        setState({
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

    return (
        <div className='main-container'>
            <Actions backUrl={'/'} />

            <div className='col-1'>
                <h2>Scan QR</h2>

                <div id="camera">
                    <QRCodeScanner
                        qrCodeSuccessCallback={(d) => onNewScanResult(d)} />
                </div>

            </div>
        </div>
    );
}

export default ScanQR;