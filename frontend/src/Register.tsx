import { useState } from 'react'
import './Register.css'

function Register() {
// Single state object for all form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Registering with username: ${username}');
  }

  return (
      <div>
        <h1>Register Your Account</h1>
        <p> * Password must be at least 8 characters and contain a special character. </p>
        <form onSubmit={handleSubmit}>
            <label>Username:</label>
            <br />
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            
            <br />
            <label>Email:</label>
            <br />
            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <br />
            <label>Password:</label>
            <br />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <br />
            <label>PhoneNumber:</label>
            <br />
            <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
            />

            <br />
            <label>Address:</label>
            <br />
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
            />

            <br />
            <label>City:</label>
            <br />
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
            />

            <br />
            <label>Zip:</label>
            <br />
            <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                required
            />

            <button type='submit'>Sign Up</button>

            <div className="links">
                <a href='#'>Already have an account?</a>
            </div>
        </form>
    </div>
  );
}

export default Register;
