import React, { Component } from 'react';

class RegisterComponent extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    message: '',
    error: ''
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      this.setState({ error: 'Passwords do not match' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      this.setState({ message: data.message, error: '', username: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  render() {
    const { username, email, password, confirmPassword, message, error } = this.state;

    return (
      <div className="register-container">
        <form onSubmit={this.handleRegister}>
          <h2>Register</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={this.handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={this.handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={this.handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={this.handleChange}
          />
          <button type="submit">Register</button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }
}

export default RegisterComponent;