import { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import "./Gallery.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Modal from "../modal/Modal";
import { toast } from "react-toastify";
import closeIcon from "./../../assets/close.svg";
import { Link } from "react-router-dom";

export default function Gallery({ images, user, fetchImages }) {
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [showDeletePicModal, setShowDeletePicModal] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => user !== null);
  const [currImgId, setCurrImgId] = useState("");
  const [inputTypePassword, setInputTypePassword] = useState(true);
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

  const handleImageLoad = () => {
    console.log("fully loaded");
    setImgLoading(false);
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
          "https://my-unsplash-backend-tau.vercel.app/api/v1/images",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchImages();
        toast.success(data.message);
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message;
        toast.error(errorMsg);
      } finally {
        setShowDeletePicModal(false);
        setLoading(false);
      }
    },
  });

  return (
    <>
      <main className="gallery-wrapper">
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter="2.85rem">
            {images.map((el, idx) => {
              return (
                <div className="frame" key={idx}>
                  {imgLoading && <Skeleton height={500} />}
                  <img
                    style={{ display: loading ? "none" : "block" }}
                    src={el.url}
                    onLoad={handleImageLoad}
                    alt={el.description}
                  />
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
          </Masonry>
        </ResponsiveMasonry>
        {showDeletePicModal && (
          <Modal>
            <div className="modal-backshadow"></div>
            <section className="delete-photo-modal">
              <a onClick={() => setShowDeletePicModal(false)}>
                <img className="close-icon" src={closeIcon} alt="close icon" />
              </a>
              {!isUserLoggedIn ? (
                <h3 className="modal-header mb-0">
                  Please <Link to="/login">login</Link> to delete your images.
                </h3>
              ) : (
                <>
                  <h3 className="modal-header">Are you sure?</h3>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="password"></label>
                      <div className="position-relative">
                        <input
                          className="form-control"
                          id="password"
                          type={inputTypePassword ? "password" : "text"}
                          placeholder="******************"
                          {...formik.getFieldProps("password")}
                        />
                        <a
                          className="toggle-password"
                          onClick={() => {
                            setInputTypePassword(() => !inputTypePassword);
                          }}
                        >
                          {inputTypePassword ? "Show" : "Hide"}
                        </a>
                      </div>
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
