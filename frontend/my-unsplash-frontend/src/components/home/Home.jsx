import { useState, useEffect } from "react";
import Header from "./../header/Header";
import Gallery from "./../gallery/Gallery";

export default function Home() {
  const [images, setImages] = useState([]);
  const [user, setUser] = useState({});
  const getCurrentUser = () => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  };
  const getImages = async () => {
    const res = await fetch("http://localhost:5000/api/v1/images");
    const { data } = await res.json();
    setImages(data);
  };
  useEffect(() => {
    console.log("Home"  );
    getImages();
    getCurrentUser();
  }, []);

  return (
    <div className="container">
      <Header user={user} />
      <Gallery images={images} />
    </div>
  );
}
