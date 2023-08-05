import { useState, useEffect, useRef } from "react";
import Header from "./../header/Header";
import Gallery from "./../gallery/Gallery";
import LoadingBar from "react-top-loading-bar";
import axios from "axios";
import { toast } from "react-toastify";

export default function Home() {
  const loadingBarRef = useRef(null);
  const [images, setImages] = useState([]);
  const [user, setUser] = useState({});
  const getCurrentUser = () => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    } else setUser(null);
  };
  const getImages = async (label) => {
    loadingBarRef.current.continuousStart();
    let url = "http://localhost:5000/api/v1/images";
    if (label) url = `http://localhost:5000/api/v1/images?label=${label}`;
    try {
      const { data } = await axios.get(url);
      setImages(data.data);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(errorMsg);
    } finally {
      loadingBarRef.current.complete();
    }
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
      <LoadingBar color="#f11946" ref={loadingBarRef} />
      <Header user={user} fetchImages={fetchNewImages} />
      <Gallery images={images} user={user} fetchImages={fetchNewImages} />
    </div>
  );
}
