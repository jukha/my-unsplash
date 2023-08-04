import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginBtnStyle = {
    display: "flex",
    gap: "0.9rem",
    alignItems: "center",
  };

  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Required";
    } else if (values.password.length < 8) {
      errors.password = "Must be 8 characters atleast";
    }

    return errors;
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/v1/users/login",
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setLoading(false);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        navigate("/");
      } catch (error) {
        setLoading(false);
        const errorMsg = error.response?.data?.message || error.message;
        toast.error(errorMsg);
      }
    },
  });
  return (
    <div className="auth-wrapper">
      <ToastContainer />
      <div className="auth-form">
        <h3>Log into your account</h3>
        <form>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              className="form-control"
              type="text"
              placeholder="you@example.com"
              id="email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              className="form-control"
              type="password"
              placeholder="••••••••"
              id="password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="error">{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="form-btns">
            <button
              className="btn btn--success"
              style={loginBtnStyle}
              onClick={formik.handleSubmit}
            >
              LOGIN
              {loading && <span className="loader"></span>}
            </button>
            <a className="btn btn--success" href="/signup">
              REGISTER
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
