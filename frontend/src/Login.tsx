import { useState } from 'react'
import './Login.css'

function Login() {
// state variables for email and password starting off empty
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Logging in with Email: ${email} and Password: ${password}');
  }

  return (
      <div className="container">
        <div className= "login-box">
        <h1>LOG IN</h1>
        <form onSubmit={handleSubmit} className="login-form">
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <br />
            <br />
            <button type='submit'>Log In</button>
            <br />
            <div className="links">
                <a href='#'>Forgot Password?</a>
                <a href='#'>Need an Account?</a>
            </div>
        </form>
      </div>
  </div>
  );
}

export default Login;
