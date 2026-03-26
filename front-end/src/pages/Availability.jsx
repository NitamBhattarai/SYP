import { useState, useEffect } from 'react';

export default function Availability() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ available_date: '', start_time: '', end_time: '' });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const load = () => {
    fetch('http://localhost:5000/api/pandit/availability', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSlots(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (token) load();
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = e => {
    e.preventDefault();
    setMessage('');
    fetch('http://localhost:5000/api/pandit/availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message || 'Added');
        setForm({ available_date: '', start_time: '', end_time: '' });
        load();
      })
      .catch(err => console.error(err));
  };

  const handleDelete = id => {
    fetch(`http://localhost:5000/api/pandit/availability/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(() => load())
      .catch(err => console.error(err));
  };

  return (
    <div className="container mt-5">
      <h2>Availability</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleAdd} className="row g-3 mb-4">
        <div className="col-md-3">
          <input
            type="date"
            name="available_date"
            className="form-control"
            value={form.available_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="time"
            name="start_time"
            className="form-control"
            value={form.start_time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="time"
            name="end_time"
            className="form-control"
            value={form.end_time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-success w-100">
            Add Slot
          </button>
        </div>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {slots.map(s => (
            <tr key={s.availability_id}>
              <td>{s.available_date}</td>
              <td>{s.start_time}</td>
              <td>{s.end_time}</td>
              <td>{s.status}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(s.availability_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
