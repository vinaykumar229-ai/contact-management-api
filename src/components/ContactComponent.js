import React, { Component } from 'react';
import './ContactComponent.css';

class ContactComponent extends Component {
  state = {
    contacts: [],
    name: '',
    email: '',
    phone: '',
    address: '',
    timezone: '',
    file: null,
    message: '',
    error: ''
  };

  async componentDidMount() {
    await this.fetchContacts();
  }

  fetchContacts = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      this.setState({ error: 'No token found. Please log in.' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/contacts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch contacts');
      }

      const data = await response.json();
      this.setState({ contacts: data, error: '' });
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  handleAddContact = async (e) => {
    e.preventDefault();
    const { name, email, phone, address, timezone } = this.state;

    try {
      const response = await fetch('http://localhost:5000/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, email, phone, address, timezone })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add contact');
      }

      const data = await response.json();
      this.setState({ message: data.message });
      await this.fetchContacts();
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFileChange = (e) => {
    this.setState({ file: e.target.files[0] });
  };

  handleFileUpload = async (e) => {
    e.preventDefault();
    const { file } = this.state;

    if (!file) {
      this.setState({ error: 'Please select a file to upload.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload/csv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');

      this.setState({ message: data.message, error: '' });
      await this.fetchContacts();
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  render() {
    const { contacts, name, email, phone, address, timezone, message, error } = this.state;

    return (
      <div className="contacts-container">
        <form onSubmit={this.handleAddContact} className="add-contact-form">
          <h2>Add New Contact</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={this.handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={this.handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={phone}
            onChange={this.handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={address}
            onChange={this.handleChange}
            required
          />
          <input
            type="text"
            name="timezone"
            placeholder="Timezone"
            value={timezone}
            onChange={this.handleChange}
            required
          />
          <button type="submit">Add Contact</button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <h2>Upload Contacts</h2>
        <form onSubmit={this.handleFileUpload} className="upload-form">
          <input type="file" onChange={this.handleFileChange} accept=".csv" required />
          <button type="submit">Upload</button>
        </form>

        <h2>Contacts List</h2>
        <ul className="contacts-list">
          {contacts.map(contact => (
            <li key={contact.id} className="contact-item">
              <h3>{contact.name}</h3>
              <p>Email: {contact.email}</p>
              <p>Phone: {contact.phone}</p>
              <p>Address: {contact.address}</p>
              <p>Timezone: {contact.timezone}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ContactComponent;
