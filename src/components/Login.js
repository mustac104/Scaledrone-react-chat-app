import "./Login.css";

function Login(props){

return (
      <div className="login-page">
        <div className="form-wrapper">
          <div>
            <form className="form" onSubmit={props.rukujPredajomKorisnika}>
              <div className="form-control">
                <div>
                  <label htmlFor="name">Ime korisnika:</label>
                </div>
                <input
                  className="form__username-input"
                  type="text"
                  maxLength="20"
                  onChange={props.rukujPromjenomKorisnika}/>
              </div>
              <div className="form-control">
                <button type="submit" className="form__login-button">Login</button>
              </div>
            </form>
          </div>
        </div>
        
      </div>
  );
}

export default Login;
  