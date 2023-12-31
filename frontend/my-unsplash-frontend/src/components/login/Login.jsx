import { useFormik } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [inputTypePassword, setInputTypePassword] = useState(true);
  const navigate = useNavigate();

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
          "https://my-unsplash-backend-tau.vercel.app/api/v1/users/login",
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        navigate("/");
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message;
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <div className="auth-wrapper">
      <div className="auth-form">
        <h3>Log into your account</h3>
        <form onSubmit={formik.handleSubmit}>
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
            <div className="position-relative">
              <input
                className="form-control"
                type={inputTypePassword ? "password" : "text"}
                placeholder="••••••••"
                id="password"
                {...formik.getFieldProps("password")}
              />
              <a
                className="toggle-password"
                onClick={() => {
                  setInputTypePassword(() => !inputTypePassword);
                }}
              >
                {inputTypePassword ? "Show" : "Hide"}
              </a>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="error">{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="form-btns">
            <button className="btn btn--success btn-with-loader">
              LOGIN
              {loading && <span className="loader"></span>}
            </button>
            <NavLink className="btn btn--success" to="/signup">
              REGISTER
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}
