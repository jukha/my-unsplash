import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const navigate = useNavigate();
  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Required";
    }

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
      name: "",
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/v1/users/signup",
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("success", data);
        const successMsg = `${data.message} Redirecting you to login page.`;
        toast.success(successMsg, {
          autoClose: 2000,
        });
        toast.onChange((payload) => {
          if (payload.status === "removed") navigate("/login");
        });
      } catch (error) {
        console.log(error);
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
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              className="form-control"
              type="text"
              id="name"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="error">{formik.errors.name}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              className="form-control"
              type="text"
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
              id="password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="error">{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="form-btns">
            <a
              className="btn btn--success"
              href="/signup"
              onClick={formik.handleSubmit}
            >
              REGISTER
            </a>
            <a className="btn btn--success" href="/login">
              LOGIN
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
