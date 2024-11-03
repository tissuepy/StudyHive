import './App.css'
import { useNavigate } from 'react-router-dom';
import coverlogo from './assets/coverlogo.png';
import { Link } from 'react-router-dom';




const Login = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate




  // Function to handle form submission
  const handleLogin = (e) => {
      e.preventDefault(); // Prevent default form submission
      navigate('/CreateAccount'); // Navigate to the Create Account page
  };




  return (
<div className="login-container">
          <img src={coverlogo} alt="Logo" className="logo" />
 <div className="wrapper">
 <form className="login-form" onSubmit={handleLogin}>
          <h1 className="title">Welcome to StudyHive! 📚</h1>
              <div className="input-box">
                  <input type="text" placeholder="Full Name                                                                                           👤" required />
              </div>
              <div className="input-box">
                  <input type="text" placeholder="Username                                                                                           👤" required />
              </div>
              <div className="input-box">
                  <input type="password" placeholder="Password                                                                                            🔒" required />
              </div>
              <button className="login-button">
<Link to="/create-account" style={{ textDecoration: 'none', color: 'white' }}>
  Create Account
</Link>
</button>
          </form>
      </div>
      </div>
  )
}




export default Login
