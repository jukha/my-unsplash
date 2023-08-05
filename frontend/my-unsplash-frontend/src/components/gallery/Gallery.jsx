import { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import "./Gallery.css";
import Modal from "../modal/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import closeIcon from "./../../assets/close.svg";

export default function Gallery({ images, user, fetchImages }) {
  const [loading, setLoading] = useState(false);
  const [showDeletePicModal, setShowDeletePicModal] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => user !== null);
  const [currImgId, setCurrImgId] = useState("");
  useEffect(() => {
    document.addEventListener("keydown", handleEscKey);
    setIsUserLoggedIn(user !== null);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [user]);
  const handleEscKey = (event) => {
    if (event.key === "Escape") {
      setShowDeletePicModal(false);
    }
  };
  const validate = (values) => {
    const errors = {};

    if (!values.password) {
      errors.password = "Required";
    }

    return errors;
  };
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      const formData = { ...values, imageId: currImgId };
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.post(
          "http://localhost:5000/api/v1/images",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(data);
        setShowDeletePicModal(false);
        fetchImages();
        toast.success(data.message);
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message;
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <ToastContainer />
      <main className="gallery-wrapper">
        {images.map((el, idx) => {
          0;
          return (
            <div className="frame" key={idx}>
              <img src={el.url} alt={el.description} />
              <p className="img-description">{el.description}</p>
              <a
                className="btn btn--danger-outline"
                onClick={() => {
                  setShowDeletePicModal(true);
                  setCurrImgId(el._id);
                }}
              >
                delete
              </a>
            </div>
          );
        })}
        {showDeletePicModal && (
          <Modal>
            <div className="modal-backshadow"></div>
            <section className="delete-photo-modal">
              <a onClick={() => setShowDeletePicModal(false)}>
                <img className="close-icon" src={closeIcon} alt="close icon" />
              </a>
              {!isUserLoggedIn ? (
                <h3 className="modal-header mb-0">
                  Please <a href="/login">login</a> to delete your images.
                </h3>
              ) : (
                <>
                  <h3 className="modal-header">Are you sure?</h3>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="password"></label>
                      <input
                        className="form-control"
                        id="password"
                        type="password"
                        placeholder="******************"
                        {...formik.getFieldProps("password")}
                      />
                      {formik.touched.password && formik.errors.password ? (
                      <div className="error">{formik.errors.password}</div>
                    ) : null}
                    </div>
                    <div className="form-btns">
                      <a
                        className="btn--cancel"
                        onClick={() => setShowDeletePicModal(false)}
                      >
                        Cancel
                      </a>
                      <button className="btn btn--danger btn-with-loader">
                        Delete
                        {loading && <span className="loader"></span>}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </section>
          </Modal>
        )}
      </main>
    </>
  );
}
