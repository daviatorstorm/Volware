import React from 'react';

import UserService from '../services/UserService';

class ShowQR extends React.Component {
    state = {
        qrCode: null,
        loading: true,
        blob: null
    };

    componentDidMount() {
        UserService.getMyQR().then((response) => {
            this.setState({ qrCode: response.data, loading: false, blob: new Blob([response.data], { type: "image/png" }) });
        }).catch((err) => {
            console.error(err);
        });
    }

    render() {
        return (
            <div>
                <h1>Show QR</h1>
                <div className='qr-container'>
                    {
                        this.state.blob ?
                            <img src={URL.createObjectURL(this.state.blob)} alt="Not found" /> : null
                    }
                </div>
            </div>
        );
    }
};

export default ShowQR;