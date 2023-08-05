import { useState, useEffect } from "react";
import Header from "./../header/Header";
import Gallery from "./../gallery/Gallery";

export default function Home() {
  const [images, setImages] = useState([]);
  const [user, setUser] = useState({});
  const getCurrentUser = () => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    } else setUser(null);
  };
  const getImages = async (label) => {
    let url = "http://localhost:5000/api/v1/images";
    if (label) url = `http://localhost:5000/api/v1/images?label=${label}`;

    const res = await fetch(url);
    const { data } = await res.json();
    setImages(data);
  };
  useEffect(() => {
    getCurrentUser();
    getImages();
  }, []);

  const fetchNewImages = (label) => {
    getImages(label);
  };

  return (
    <div className="container">
      <Header user={user} fetchImages={fetchNewImages} />
      <Gallery images={images} user={user} fetchImages={fetchNewImages} />
    </div>
  );
}
