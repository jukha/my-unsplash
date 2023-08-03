import { useState, useEffect } from "react";
import Header from "./../header/Header";
import Gallery from "./../gallery/Gallery";

export default function Home() {
  const [images, setImages] = useState([]);
  const getImages = async () => {
    const res = await fetch("http://localhost:5000/api/v1/images");
    const { data } = await res.json();
    setImages(data);
    console.log(data);
  };
  useEffect(() => {
    getImages();
  }, []);

  return (
    <div className="container">
      <Header />
      <Gallery images={images} />
    </div>
  );
}
