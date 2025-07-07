import { useState } from 'react'
import './DeleteProfile.css'

function DeleteProfile() {
  const [currentPassword, setCurrentPassword] = useState(''); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Logging in with Email: ${email} and Password: ${password}');
  }

  return (
      <div>
        <h1>Delete My Account</h1>
        <form onSubmit={handleSubmit} className="login-form">
            <label>Current Password:</label>
            <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
            />
            <button type='submit'>Delete Account</button>
        </form>
    </div>
  );
}

export default DeleteProfile;
