import { useState } from 'react'
import './ForgotPassword.css'

function ForgotPassword() {
  const [oldPassword, setOldPassword] = useState(''); 
  const [newPassword, setNewPassword] = useState(''); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Logging in with Email: ${email} and Password: ${password}');
  }

  return (
      <div className="container">
        <div>
        <h1>Forgot Your Password</h1>
        <form onSubmit={handleSubmit} className="login-form">
            <label>Old Password:</label>
            <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
            />
            <label>New Password:</label>
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
            <br />
            <br />
            <button type='submit'>Reset Password</button>
        </form>
    </div>
  </div>
  );
}

export default ForgotPassword;
