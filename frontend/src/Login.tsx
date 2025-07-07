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
      <div>
        <h1>Log in</h1>
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
            <button type='submit'>Log In</button>
            <div className="links">
                <a href='#'>Forgot Password?</a>
                <a href='#'>Need an Account?</a>
            </div>
        </form>
    </div>
  );
}

export default Login;
