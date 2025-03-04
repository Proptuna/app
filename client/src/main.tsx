import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');

      setMessage(data.message);
      setEmail('');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <img src="/public/images/tuna.svg" alt="PropTuna Logo" style={styles.logo} />
      <h2 style={styles.title}>Join Our Waitlist</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={styles.input}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={styles.button}
        >
          {isLoading ? 'Submitting...' : 'Join Waitlist'}
        </button>
      </form>
      {message && <p style={message.includes('Thank you') ? styles.successMessage : styles.errorMessage}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #ddd'
  },
  logo: {
    width: '100px',
    height: '100px',
    margin: '0 auto 1.5rem',
    display: 'block'
  },
  title: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '700',
    fontSize: '24px',
    color: '#0f172a',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  input: {
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    '&:focus': {
      borderColor: '#FEBB00',
      boxShadow: '0 0 0 3px rgba(254, 187, 0, 0.2)'
    }
  },
  button: {
    padding: '1rem',
    backgroundColor: '#FEBB00',
    color: '#0f172a',
    fontFamily: 'Inter, sans-serif',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#E5A800',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(254, 187, 0, 0.3)'
    },
    '&:disabled': {
      opacity: '0.7',
      cursor: 'not-allowed'
    }
  },
  successMessage: {
    marginTop: '1rem',
    color: '#2ecc71',
    fontFamily: 'Inter, sans-serif',
    textAlign: 'center',
    fontSize: '1rem'
  },
  errorMessage: {
    marginTop: '1rem',
    color: '#e74c3c',
    fontFamily: 'Inter, sans-serif',
    textAlign: 'center',
    fontSize: '1rem'
  }
};

function App() {
  return (
    <div>
      <WaitlistForm />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
