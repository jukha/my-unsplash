import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import userIcon from "./../../assets/user-solid.svg";
import searchIcon from "./../../assets/search-icon.svg";
import logoutIcon from "./../../assets/logout.svg";
import closeIcon from "./../../assets/close.svg";
import Modal from "../modal/Modal";
import axios from "axios";
import { toast } from "react-toastify";

export default function Header({ user, setUser, fetchImages }) {
  const navigate = useNavigate(null);
  const labelSuggestionsRef = useRef(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showAllBtn, setShowAllBtn] = useState(false);

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
      setLoading(true);
      const formData = { ...values, owner: user._id };
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
    document.addEventListener("keydown", handleArrowNavigation);
    document.addEventListener("keydown", handleEnterKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.removeEventListener("keydown", handleArrowNavigation);
      document.removeEventListener("keydown", handleEnterKey);
    };
  }, []);

  const handleArrowNavigation = (event) => {
    const labelSuggestions = labelSuggestionsRef.current;
    const selected = labelSuggestions?.querySelector(".selected");

    if (event.key === "ArrowDown" && selected.nextSibling) {
      event.preventDefault();
      selected.nextSibling.classList.add("selected");
      selected.classList.remove("selected");
    } else if (event.key === "ArrowUp" && selected.previousSibling) {
      event.preventDefault();
      selected.previousSibling.classList.add("selected");
      selected.classList.remove("selected");
    }
  };

  const handleEscKey = (event) => {
    if (event.key === "Escape") {
      setShowAddModal(false);
      setShowUserMenu(false);
    }
  };

  const handleShowAllClick = () => {
    fetchImages();
    setShowAllBtn(false);
  };

  const handleEnterKey = (event) => {
    const labelSuggestions = labelSuggestionsRef.current;
    const selected = labelSuggestions?.querySelector(".selected");

    if (event.key === "Enter" && selected) {
      event.preventDefault();
      const label = selected.textContent.trim();
      handleSelectLabel(label);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowUserMenu(false);
    navigate("/");
  };

  const handleInputChange = async (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    try {
      const { data } = await axios.get(
        `https://my-unsplash-backend-tau.vercel.app/api/v1/images/label-suggestions?term=${value}`
      );
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error fetching label suggestions:", error);
    }
  };

  const handleSelectLabel = (label) => {
    if (suggestions) {
      setShowAllBtn(true);
    }
    setSearchTerm("");
    setSuggestions([]);
    fetchImages(label);
  };

  return (
    <>
      <header>
        <div className="logo">
          <img src={userIcon} />
          <div>
            <h3>My Unsplash</h3>
            <p>devchallenges.io</p>
          </div>
        </div>
        <div
          className="form-group search-label"
          style={
            suggestions.length > 0
              ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
              : {}
          }
        >
          <img src={searchIcon} alt="search icon" />
          <input
            type="text"
            placeholder="Search by label"
            className="form-control"
            value={searchTerm}
            onChange={handleInputChange}
          />
          {searchTerm && suggestions.length > 0 && (
            <ul className="label-suggestions" ref={labelSuggestionsRef}>
              {suggestions.map((label, idx) => {
                // const isSelected = idx === 0;
                const className = idx === 0 ? "selected" : "";
                return (
                  <li
                    className={`label-suggestions__item ${className}`}
                    key={idx}
                    onClick={() => handleSelectLabel(label)}
                  >
                    <a className="label-suggestions__link">{label}</a>
                  </li>
                );
              })}
            </ul>
          )}
          {showAllBtn && (
            <a className="btn btn--dark" onClick={handleShowAllClick}>
              Show All
            </a>
          )}
        </div>
        <a className="btn btn--success" onClick={() => setShowAddModal(true)}>
          Add a photo
        </a>
        {!user ? (
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
                  <a className="list__link user-name">{user.name}</a>
                </li>
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
            <a onClick={() => setShowAddModal(false)}>
              <img className="close-icon" src={closeIcon} alt="close icon" />
            </a>
            {user ? (
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
