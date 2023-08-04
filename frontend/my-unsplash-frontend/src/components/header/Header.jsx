import "./Header.css";
import userIcon from "./../../assets/user-solid.svg";
import searchIcon from "./../../assets/search-icon.svg";
import logoutIcon from "./../../assets/logout.svg";
import Modal from "../modal/Modal";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header({ user }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    user !== undefined ? true : false
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);
  const handleEscKey = (event) => {
    if (event.key === "Escape") {
      setShowAddModal(false);
    }
  };

  const navigate = useNavigate(null);

  const logout = () => {
    localStorage.removeItem("user");
    setIsUserLoggedIn(false);
    setShowUserMenu(false);
    navigate("/");
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
        {!isUserLoggedIn && (
          <a className="btn btn--login" href="/login">
            Login
          </a>
        )}
        {isUserLoggedIn && (
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
            <h3 className="modal-header">Add a new photo</h3>
            <form>
              <div className="form-group">
                <label htmlFor="label" className="form-label">
                  Label
                </label>
                <input className="form-control" type="text" id="label" />
              </div>
              <div className="form-group">
                <label htmlFor="url" className="form-label">
                  Photo URL
                </label>
                <input className="form-control" type="text" id="url" />
              </div>
              <div className="form-btns">
                <a
                  className="btn--cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </a>
                <a className="btn btn--success">Submit</a>
              </div>
            </form>
          </section>
        </Modal>
      )}
    </>
  );
}
