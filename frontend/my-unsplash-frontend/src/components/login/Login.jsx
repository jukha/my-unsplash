export default function Login() {
  return (
    <div className="auth-wrapper">
      <div className="auth-form">
        <h3>Log into your account</h3>
        <form>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input className="form-control" type="text" id="email" />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input className="form-control" type="text" id="password" />
          </div>
          <div className="form-btns">
            <a className="btn btn--success">LOGIN</a>
            <a className="btn btn--success" href="/signup">
              REGISTER
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
