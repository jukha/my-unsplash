import "./Gallery.css";
import Modal from "../modal/Modal";
import { useState, useEffect } from "react";

export default function Gallery({ images, user }) {
  const [showDeletePicModal, setShowDeletePicModal] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => user !== null);
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

  return (
    <main className="gallery-wrapper">
      {images.map((el, idx) => {
        0;
        return (
          <div className="frame" key={idx}>
            <img src={el.url} alt={el.description} />
            <p className="img-description">{el.description}</p>
            <a
              className="btn btn--danger-outline"
              onClick={() => setShowDeletePicModal(true)}
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
            {!isUserLoggedIn ? (
              <h3 className="modal-header mb-0">
                Please <a href="/login">login</a> to delete your images.
              </h3>
            ) : (
              <h1>Logged in</h1>
            )}
          </section>
        </Modal>
      )}
    </main>
  );
}
