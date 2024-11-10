import React, { useEffect, useRef, useState } from 'react';
import ImageUploading from 'react-images-uploading';
import AvatarEditor from 'react-avatar-editor';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';


export default function UploadAndEditImage({ currentImage, setImage, setImageToUpload, imageBorderRadius, imageHeight, imageWidth }) {

    // console.log(currentImage)

    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const maxNumber = 1;
    const [show, setShow] = useState(false);
    const [rotate, setRotate] = useState(0);
    const [size, setSize] = useState(1.0);
    const [borderRadius, setBorderRadius] = useState(0);
    const editor = useRef(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onChange = (image) => {
        setImages(image);
    };

    const handleRotate = (event) => {
        setRotate(parseInt(event.target.value));
    };

    const handleSize = (event) => {
        setSize(parseFloat(event.target.value));
    };

    const handleBorderRadius = (event) => {
        setBorderRadius(parseInt(event.target.value));
    };

    const getImageUrl = async () => {
        const dataUrl = editor.current.getImage().toDataURL()
        const result = await fetch(dataUrl);
        const blob = await result.blob();

        return blob;
    }

    function resetHandler() {
        setRotate(0);
        setSize(1);
        setBorderRadius(0);
    }

    return (
        <>
            <Button variant="primary" onClick={() => { handleShow(); resetHandler(); !currentImage.includes("null") && setImages([{ "data_url": currentImage }]) }} className="btn-grad-circle" style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                height: "50px",
                width: "50px",
            }}>
                <i className="bi bi-pencil-fill h4"></i>
            </Button>

            <Modal show={show} onHide={handleClose} style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* image uploader */}
                    <ImageUploading
                        multiple
                        value={images}
                        onChange={onChange}
                        maxNumber={maxNumber}
                        dataURLKey="data_url"
                        // maxFileSize={800000} // max 800,000 B => 781.25 KB
                    >
                        {({
                            imageList,
                            onImageUpload,
                            // onImageRemoveAll,
                            onImageUpdate,
                            onImageRemove,
                            isDragging,
                            dragProps,
                        }) => (
                            <div className="upload__image-wrapper">
                                {images.length == 0 && <Button
                                    data-test="upload-image-button"
                                    className='w-100'
                                    style={{ height: "300px" }}
                                    variant={isDragging ? "secondary" : "outline-secondary"}
                                    onClick={onImageUpload}
                                    {...dragProps}
                                >
                                    Click or Drop here <i className="bi bi-card-image ms-2"></i>
                                </Button>}
                                {imageList.map((image, index) => (
                                    <div key={index} className="image-item">
                                        <div className="image-item__btn-wrapper w-100 d-flex justify-content-center mb-2">
                                            <Button variant="outline-primary" className='w-25 me-1 rounded-pill' onClick={() => onImageUpdate(index)}>Update</Button>
                                            <Button variant="outline-danger" className='w-25 rounded-pill' onClick={() => onImageRemove(index)}>Remove</Button>
                                        </div>
                                        <div>
                                            {/* image container/editer */}
                                            <AvatarEditor
                                                ref={editor}
                                                image={image['data_url']/* .split("/")[image['data_url'].split("/").length - 1].includes(".") ? image['data_url'] + "?t=" + Math.random() : image['data_url'] */}
                                                width={imageWidth}
                                                height={imageHeight}
                                                border={50}
                                                borderRadius={imageBorderRadius}
                                                scale={size}
                                                rotate={rotate}
                                            />
                                            <Form.Label className="mt-2">Rotate: {rotate}°</Form.Label>
                                            <Form.Range value={rotate} min="-180" max="180" step="1" onChange={handleRotate} /> {/* to edit image rotation */}
                                            <Form.Label>Size: {size}</Form.Label>
                                            <Form.Range value={size} min="0.6" max="10" step="0.1" onChange={handleSize} /> {/* to edit image size */}
                                            {/* <Form.Label>Border Radius: {borderRadius}</Form.Label>
                                            <Form.Range value={borderRadius} min="0" max="250" step="1" onChange={handleBorderRadius} /> */} {/* to edit image border raduis */}
                                            <Button onClick={resetHandler}>Reset</Button> {/* reset image edit */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ImageUploading>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>
                        Cancel <i className="bi bi-x"></i>
                    </Button>
                    <Button variant="outline-success" data-test="save-image-button" onClick={async () => {
                        if (editor.current) {

                            // console.log("uploading... ")
                            setLoading(true);

                            const blob = await getImageUrl();

                            const urlCreator = window.URL || window.webkitURL;
                            const imageUrl = urlCreator.createObjectURL(blob);
                            setImage(imageUrl); // get new image url

                            let reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = function () {
                                let base64data = reader.result;
                                setImageToUpload(base64data); // get new image data
                            }

                            // console.log("uploaded")
                            setLoading(false);

                            handleClose();
                        }
                    }}>
                        {loading && <Spinner animation="border" variant="success" size="sm" />} Save <i className="bi bi-check-all"></i>
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}