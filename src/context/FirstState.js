import React, { useState } from "react"; // Import React
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FirstContext from "./firstContext";
import {toast} from "react-toastify"

// Update component name to start with an uppercase letter
const FirstState = (props) => {
    const [message, setMessage] = useState(""); // Change setmessage to setMessage
    const [title, setTitle] = useState("");
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    const modalFunction = () => (
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showModal} // Set the modal visibility based on state
        onHide={() => setShowModal(false)} // Close modal when onHide is called
        >
            {console.log("I am called")}
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div dangerouslySetInnerHTML={{ __html: message }} />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => setShowModal(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    );

    // Trigger modal display
    const handleShowModal = () => {
        console.log(" I am called")
        // setTitle("Example Title");
        // setMessage("Example Message");
        setShowModal(true);
    };


    const calltoast = (message, typee) => {
        // Use square brackets to access dynamic object property
        toast[typee](message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });
      };

      
    return (
        
        <FirstContext.Provider value={{setMessage, setTitle, handleShowModal,modalFunction,calltoast}}>
            {props.children}
        </FirstContext.Provider>
    );
}

export default FirstState;
