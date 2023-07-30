import React from 'react';

import { Html5Qrcode } from "html5-qrcode";

const qrcodeRegionId = "html5qr-code-full-region";

class QRCodeScanner extends React.Component {
    html5QrCode = null;

    render() {
        return (
            <div>
                <div id={qrcodeRegionId} />
            </div>
        )
    }

    componentWillUnmount() {
        this.html5QrCode?.stop().then((ignore) => {
            // QR Code scanning is stopped.
        }).catch((err) => {
            // Stop failed, handle it.
        });
    }

    componentDidMount() {
        console.log('current qr document directions', document.body.clientWidth / document.body.clientHeight);
        // Html5Qrcode.getCameras().then((cameras) => {


        // });

        console.log('before start');
        this.html5QrCode = new Html5Qrcode(qrcodeRegionId);
        this.html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,    // Optional, frame per seconds for qr code scanning
                qrbox: { width: 250, height: 250 },  // Optional, if you want bounded box UI
                aspectRatio: document.body.clientWidth / document.body.clientHeight,
                // innerWidth: document.body.clientWidth,
                // innerHeight: document.body.clientHeight
            },
            this.props.qrCodeSuccessCallback,
            (errorMessage) => {
                // alert(`ERROR: ${errorMessage}`)
                console.log(errorMessage);
            })
            .catch((err) => {
                alert(`ERROR: ${err}`)
            });
    }
};

export default QRCodeScanner;