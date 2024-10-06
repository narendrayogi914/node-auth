import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

function Home() {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState("");
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);
  const fetchProducts = async () => {
    try {
      const url = "http://localhost:3000/products";
      const response = await fetch(url, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const result = await response.json();
      setProducts(result);
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <h1>{loggedInUser}</h1>
      <button
        onClick={() => {
          localStorage.removeItem("loggedInUser");
          localStorage.removeItem("token");
          handleSuccess("Logout Successfully");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }}
      >
        Logout
      </button>
      <div>
        {products &&
          products?.map((item, index) => (
            <ul key={index}>
              <span>
                {item.name} : {item.price}
              </span>
            </ul>
          ))}
      </div>

      <ToastContainer />
    </>
  );
}

export default Home;
