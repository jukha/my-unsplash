import "./Gallery.css";
import Modal from "../modal/Modal";
import { useState, useEffect } from "react";

export default function Gallery({ images }) {
  const [showDeletePicModal, setShowDeletePicModal] = useState(false);
  useEffect(() => {
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);
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
          <section className="delete-photo-modal">Delete Photo</section>
        </Modal>
      )}
    </main>
  );
}
