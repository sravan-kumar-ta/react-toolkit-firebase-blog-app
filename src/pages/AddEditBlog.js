import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTextArea,
  MDBValidation,
  MDBValidationItem,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import { toast } from "react-toastify";

const initalState = {
  title: "",
  description: "",
};

const AddEditBlog = () => {
  const [data, setData] = useState(initalState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);

  const { title, description } = data;

  useEffect(() => {
    const updaloadFIle = () => {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + " % done.");
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            toast.info("Image uploaded successfully.");
            setData((prev) => ({ ...prev, imgURL: downloadURL }));
          });
        }
      );
    };
    file && updaloadFIle();
  }, [file]);

  const handleChange = (e) => {};

  return (
    <div
      style={{
        margin: "auto",
        padding: "15px",
        maxWidth: "450px",
        alignContent: "center",
        marginTop: "120px",
      }}
      className="container"
    >
      <MDBCard alignment="center">
        <h4 className="fw-bold mt-3">Create Blog</h4>
        <MDBCardBody>
          <MDBValidation className="row g-3" noValidate>
            <MDBValidationItem
              className="col-md-12"
              feedback="Please provide title"
              invalid
            >
              <MDBInput
                label="Title"
                type="text"
                value={title}
                name="title"
                onChange={handleChange}
                className="form-control"
                required
              />
            </MDBValidationItem>
            <MDBValidationItem
              className="col-md-12"
              feedback="Please provide description"
              invalid
            >
              <MDBTextArea
                label="Description"
                type="text"
                rows={4}
                value={description}
                name="description"
                onChange={handleChange}
                className="form-control"
                required
              />
            </MDBValidationItem>
            <div className="col-md-12">
              <MDBInput
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <div className="col-12">
              <MDBBtn
                style={{ width: "50%" }}
                disabled={progress !== null && progress < 100}
              >
                Submit
              </MDBBtn>
            </div>
          </MDBValidation>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default AddEditBlog;
