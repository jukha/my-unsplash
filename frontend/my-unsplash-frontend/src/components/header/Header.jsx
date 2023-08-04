import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import userIcon from "./../../assets/user-solid.svg";
import searchIcon from "./../../assets/search-icon.svg";
import logoutIcon from "./../../assets/logout.svg";
import Modal from "../modal/Modal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Header({ user, fetchImages }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => user !== null);

  const validate = (values) => {
    const errors = {};

    if (!values.label) {
      errors.label = "Required";
    }

    if (!values.url) {
      errors.url = "Required";
    } else if (!/^(http|https):\/\/[^ "]+$/.test(values.url)) {
      errors.url = "URL not valid.";
    }

    if (!values.description) {
      errors.description = "Required";
    }

    return errors;
  };
  const formik = useFormik({
    initialValues: {
      url: "",
      label: "",
      description: "",
    },
    validate,
    onSubmit: async (values) => {
      console.log("form-values", values);
      setLoading(true);
      const formData = { ...values, owner: user._id };
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
        setShowAddModal(false);
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

  useEffect(() => {
    document.addEventListener("keydown", handleEscKey);
    setIsUserLoggedIn(user !== null);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [user]);
  const handleEscKey = (event) => {
    if (event.key === "Escape") {
      setShowAddModal(false);
      setShowUserMenu(false);
    }
  };

  const navigate = useNavigate(null);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsUserLoggedIn(false);
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <>
      <header>
        <ToastContainer />
        <div className="logo">
          <img src={userIcon} />
          <div>
            <h3>My Unsplash</h3>
            <p>devchallenges.io</p>
          </div>
        </div>
        <div className="form-group">
          <img src={searchIcon} alt="search icon" />
          <input
            type="text"
            placeholder="Search by label"
            className="form-control"
          />
        </div>
        <a className="btn btn--success" onClick={() => setShowAddModal(true)}>
          Add a photo
        </a>
        {!isUserLoggedIn ? (
          <a className="btn btn--login" href="/login">
            Login
          </a>
        ) : (
          <div className="isLoggedInMenu">
            <a
              className="avatar-no-pic"
              onClick={() => setShowUserMenu((showUserMenu) => !showUserMenu)}
            >{`${user?.name?.charAt(0).toUpperCase()}${user?.name
              ?.charAt(1)
              .toUpperCase()}`}</a>
            {showUserMenu && (
              <ul className="list">
                <li>
                  <a className="list__link" onClick={logout}>
                    <img src={logoutIcon} alt="logout icon" />
                    Logout
                  </a>
                </li>
              </ul>
            )}
          </div>
        )}
      </header>
      {showAddModal && (
        <Modal>
          <div className="modal-backshadow"></div>
          <section className="add-photo-modal">
            {isUserLoggedIn ? (
              <>
                <h3 className="modal-header">Add a new photo</h3>
                <form onSubmit={formik.handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="label" className="form-label">
                      Label
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="label"
                      {...formik.getFieldProps("label")}
                    />
                    {formik.touched.label && formik.errors.label ? (
                      <div className="error">{formik.errors.label}</div>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="description"
                      {...formik.getFieldProps("description")}
                    />
                    {formik.touched.description && formik.errors.description ? (
                      <div className="error">{formik.errors.description}</div>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <label htmlFor="url" className="form-label">
                      Photo URL
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="url"
                      {...formik.getFieldProps("url")}
                    />
                    {formik.touched.url && formik.errors.url ? (
                      <div className="error">{formik.errors.url}</div>
                    ) : null}
                  </div>
                  <div className="form-btns">
                    <a
                      className="btn--cancel"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </a>
                    <button className="btn btn--success btn-with-loader">
                      Submit
                      {loading && <span className="loader"></span>}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <h3 className="modal-header mb-0">
                Please <a href="/login">login</a> to add your images.
              </h3>
            )}
          </section>
        </Modal>
      )}
    </>
  );
}
