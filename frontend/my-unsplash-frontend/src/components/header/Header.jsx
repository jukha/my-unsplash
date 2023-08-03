import "./Header.css";
import userIcon from "./../../assets/user-solid.svg";
import searchIcon from "./../../assets/search-icon.svg";
import Modal from "../modal/Modal";
import { useState, useEffect } from "react";

export default function Header({ user }) {
  const [showAddModal, setShowAddModal] = useState(false);
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
        {!user && (
          <a className="btn btn--login" href="/login">
            Login
          </a>
        )}
        {user && (
          <>
            <a className="avatar-no-pic">AB</a>
            <a className="avatar">
              <img
                src="https://randomuser.me/api/portraits/men/28.jpg"
                alt=""
              />
            </a>
            <div className="isLoggedInMenu"></div>
          </>
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
