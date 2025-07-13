import { useState } from 'react'
import './Register.css'

function Register() {
// single state object for all form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // stops the browser from submitting the form and reloading the page
    const data = { 
        email,
        password,
        username,
        phoneNumber, 
        address, 
        city,
        zip
    }; // gathers all the form field values into a single data object
    try {
        // sends a POST request to the backend at /auth/register
        const response = await fetch('http://localhost:8080/auth/register', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, // tells the backend we're sending JSON data
            body: JSON.stringify(data), // converts JS object into a JSON string before sending
        });

        console.log('Data sent: ', data);
        const result = await response.json();

        if (response.ok) {
            setMessage(`Registration successful! Welcome ${username}.`);
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
      <div className="register-page">
        <h1>REGISTER YOUR ACCOUNT</h1>
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
            <br />
            <label>Email:</label>
            <br />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <br />
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
            <br />
            <label>Zip:</label>
            <br />
            <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                required
            />

            <br />
            <br />
            <br />
        
            <button type='submit'>Sign Up</button>

            <div className="links">
                <a href='#'>Already have an account?</a>
            </div>

            <br />
            <p>{message}</p>
            
        </form>
    </div>
    </div>
  );
}

export default Register;
