import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useLocation, useNavigate } from 'react-router-dom';
import Actions from '../../components/Actions/Actions';

let canNavigate = false;

function UserProfilePhoto() {
    const location = useLocation();
    const navigate = useNavigate();

    const [state, setState] = useState({
        ...location.state,
        showModal: false
    });

    const { stream, canvas, videoEl, showModal } = state;

    useEffect(() => {
        canNavigate = false;

        navigator.mediaDevices.getUserMedia({
            video: {
                minFrameRate: 10,
                facingMode: 'environment',
                aspectRatio: document.body.clientWidth / document.body.clientHeight,

                // width: document.body.clientWidth,
                // height: document.body.clientHeight

            },
            audio: false
        }).then(((innerStream) => {
            // console.log(innerStream);
            if (innerStream) {
                const [track] = innerStream.getVideoTracks();
                const videoEl = document.getElementById('camera');
                // videoEl.setAttribute('width', document.body.clientWidth);
                // videoEl.setAttribute('height', document.body.clientHeight);
                videoEl.srcObject = innerStream;
                const settings = track.getSettings();
                track.applyConstraints({
                    advanced: [{
                        // resizeMode: 'crop-and-scale',
                        //'aspectRatio': document.body.clientWidth / document.body.clientHeight
                    }]
                });
                console.log(settings);
                // console.log('zoom' in newLocal);
                // console.log(track);


                setState({
                    ...state,
                    stream: innerStream,
                    videoEl, canvas: document.getElementById('canvas'),
                    showModal: state.profilePhotoUrl ? true : false,
                    settings: settings,
                    capabilities: track.getCapabilities && track.getCapabilities()
                });

                canNavigate = true;
            }
        }));
    }, []);

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, [stream])

    const takePicture = () => {
        const context = canvas.getContext('2d');
        const width = videoEl.clientWidth, height = videoEl.clientHeight;

        canvas.width = width;
        canvas.height = height;
        context.drawImage(videoEl, 0, 0, width, height);

        canvas.toBlob((blob) => {
            if (blob) {
                const localState = {
                    ...state,
                    profilePhoto: blob,
                    profilePhotoUrl: window.URL.createObjectURL(blob),
                    showModal: true
                };
                setState(localState);
            }
        });
    }

    const handleSubmit = () => {
        const localState = {
            ...state,
            videoEl: null,
            canvas: null,
            stream: null,
            showModal: null
        };
        setState(localState);

        stopCamera();

        navigate('/users/add/document-photo', {
            state: localState
        });
    }

    const stopCamera = () => {
        if (stream) {
            for (const track of state.stream.getVideoTracks()) {
                track.stop();
            }
            videoEl.srcObject = null;
        }
    }

    const handleCloseModal = () => {
        setState({
            ...state,
            showModal: false
        })
    }

    return (
        <div className='main-container'>
            <Actions left={
                <img src="/back-arrow.svg" width="23px" height="22px" alt="add" onClick={() => canNavigate && navigate('/users/add', {
                    state: {
                        ...state,
                        videoEl: null,
                        canvas: null,
                        stream: null,
                        showModal: null
                    }
                })} />
            } />

            <h2 className='text-center'>Фото профілю</h2>

            <p>{document.body.clientWidth}x{document.body.clientHeight}</p>
            <p>{document.body.clientWidth / document.body.clientHeight}</p>
            <p>{videoEl?.clientWidth}x{videoEl?.clientHeight}</p>
            {/* <p>{stream?.getVideoTracks()[0].getSettings().resizeMode}</p>
            <p>{JSON.stringify(state?.settings)}</p> */}
            {/* <p>{JSON.stringify(state?.capabilities)}</p> */}

            {/* <div className='flex col-1' style={{ width: '100%' }}>
                <div className='col-1 camera-container'>
                    <video id='camera' autoPlay></video>
                </div>
            </div> */}

            <div className='flex col-1' style={{ width: '100%' }}>
                <div className='col-1'>
                    <video id='camera' autoPlay muted playsInline></video>
                </div>
            </div>

            <div className='flex col-1 col-center'>
                <img className='camera-shot-btn' src='/camera-lens.svg' alt='Not found' onClick={() => takePicture()} />
            </div>

            <canvas hidden id='canvas'></canvas>

            <ReactModal className="modal-content" isOpen={showModal} contentLabel="Order" portalClassName="order-modal">
                <div className='flex'>
                    <img src={state.profilePhotoUrl} style={{ width: '100%' }} alt="not found" />
                </div>
                <div className='flex'>
                    <div className='col-1 text-left'>
                        <img src="/yes.svg" alt="not found" onClick={() => handleSubmit()} />
                    </div>
                    <div className='col-1 text-right'>
                        <img src="/no.svg" alt="not found" onClick={() => handleCloseModal()} />
                    </div>
                </div>
            </ReactModal>
        </div>
    );
}

export default UserProfilePhoto;