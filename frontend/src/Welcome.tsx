import './Welcome.css'

function Welcome() {
// state variables for email and password starting off empty

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
  }

  return (
      <div>
        <h1>Welcome!</h1>
        <form onSubmit={handleSubmit} className="login-form">
            <p> Join our community to connect with others and personalize your profile. reach out to other members and build meaningful relationships. </p>
            <div className="links">
                <a href='#'>Log In</a>
                <a href='#'>Sign Up</a>
                <a href='#'>Contacts</a>
                <a href='#'>My Profile</a>
            </div>
        </form>
    </div>
  );
}

export default Welcome;
