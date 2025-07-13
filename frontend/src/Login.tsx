import { useState } from 'react'
import './Login.css'

function Login() {
// state variables for email and password starting off empty
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [message, setMessage] = useState<string>('');

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // stops the browser from submitting the form and reloading the page
    
    const encoded = btoa(`${email}:${password}`); // base64
    try {
        // sends a POST request to the backend at /auth/login
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST', 
            headers: { 'Authorization': `Basic ${encoded}` }, // tells the backend we're sending JSON data
        });

        const result = await response.json();

        if (response.ok) {
            setMessage(`Login successful: ${result.message}`);
        } else {
            setMessage(result.error);
        }
    } catch (error) {
        console.error('error', error);
        setMessage('Something went wrong. Please try again.');
    }
  };

  return (
      <div className="container">
        <div className= "login-box">
        <h1>LOG IN</h1>
        <form onSubmit={handleSubmit} className="login-form">
            <label className='email'>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <label className='password'>Password:</label>
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
            <p className = "message">{message}</p>
        </form>
      </div>
  </div>
  );
}

export default Login;
