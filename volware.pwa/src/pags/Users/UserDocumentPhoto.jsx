import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';

import Actions from '../../components/Actions/Actions';

let canNavigate = false;

function UserDocumentPhoto() {
    const location = useLocation();
    const navigate = useNavigate();

    const [state, setState] = useState({
        ...location.state,
        images: location.state?.images || [],
        showModal: false
    });

    const { videoEl, canvas, stream, showModal } = state;

    useEffect(() => {
        canNavigate = false;

        navigator.mediaDevices.getUserMedia({
            video: {
                minFrameRate: 10,
                facingMode: 'environment',
                aspectRatio: document.body.clientWidth / document.body.clientHeight
            },
            audio: false
        }).then((innerStream => {
            const localVideoEl = document.getElementById('camera');
            localVideoEl.srcObject = innerStream;

            setState({
                ...state,
                stream: innerStream,
                canvas: document.getElementById('canvas'),
                videoEl: localVideoEl
            });

            canNavigate = true;
        }));
    }, []);

    useEffect(() => {
        return () => {
            stopCamera();
        }
    }, [stream])

    const takePicture = () => {
        const context = canvas.getContext('2d');
        const width = videoEl.clientWidth, height = videoEl.clientHeight;

        canvas.width = width;
        canvas.height = height;
        context.drawImage(videoEl, 0, 0, width, height);

        canvas.toBlob(blob => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.width = 0;
            context.height = 0;

            setState({
                ...state,
                images: [...state.images, { blob, url: window.URL.createObjectURL(blob) }],
                showModal: true
            });
        });
    }

    const stopCamera = () => {
        if (stream) {
            for (const track of stream.getVideoTracks()) {
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

    const removeImage = (index) => {
        console.log(index);
        state.images.splice(index, 1)
        setState({
            ...state,
            images: state.images
        })
    }

    const handleSubmit = () => {
        stopCamera();

        navigate('/users/add/preview', {
            state: {
                ...state,
                videoEl: null,
                canvas: null,
                stream: null
            }
        });
    }

    return (
        <div className='main-container'>
            <Actions left={
                <img src="/back-arrow.svg" width="23px" height="22px" alt="add" onClick={() => canNavigate && navigate('/users/add/profile-photo', {
                    state: {
                        ...state,
                        videoEl: null,
                        canvas: null,
                        stream: null
                    }
                })} />
            } />

            <h2 className='text-center'>Фото документів</h2>

            <div className='flex col-1' style={{ width: '100%' }}>
                <div className='col-1'>
                    <video id='camera' autoPlay></video>
                </div>
            </div>

            <div className='flex col-1 col-center'>
                <img className='camera-shot-btn' src='/camera-lens.svg' alt='Not found' onClick={() => takePicture()} />
            </div>

            <canvas hidden id='canvas'></canvas>

            <ReactModal className="modal-content" isOpen={showModal} contentLabel="Order" portalClassName="order-modal">
                <div className='flex rows'>
                    {
                        state.images.map((img, index) => (
                            <div key={index} className='flex relative'>
                                <img className='delete-img-btn' src="/x-cross.svg" alt="not found" onClick={() => removeImage(index)} />
                                <img src={img.url} style={{ width: '100%' }} alt="not found" />
                            </div>
                        ))
                    }
                </div>
                <div className='form-control flex'>
                    <div className='col-left col-1 text-left'>
                        <div className='col-1 text-left'>
                            <img src="/yes.svg" alt="not found" onClick={() => handleSubmit()} />
                        </div>
                    </div>
                    <div className='col-1 text-right'>
                        <img src="/plus.svg" alt="not found" onClick={() => handleCloseModal()} />
                    </div>
                </div>
            </ReactModal>
        </div>
    );
}

export default UserDocumentPhoto;