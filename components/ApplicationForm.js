"use client";

import { useEffect, useState } from 'react';

const emptyForm = {
  personalDetails: {
    fullName: '',
    dateOfBirth: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
  },
  academicDetails: {
    college: '',
    course: '',
    year: '',
    studentIdNumber: '',
    previousScore: '',
  },
  hostelDetails: {
    preferredHostel: 'Hostel A',
    roomPreference: 'Single',
    messPreference: 'Veg',
  },
  guardianDetails: {
    guardianName: '',
    guardianPhone: '',
  },
  income: '',
};

export default function ApplicationForm({ initialData = null }) {
  const [form, setForm] = useState(initialData || emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const updateNested = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...form,
        income: Number(form.income || 0),
      };

      const method = initialData ? 'PUT' : 'POST';
      const url = initialData ? `/api/applications/${initialData._id}` : '/api/applications';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Application request failed');
      }

      setSuccess(initialData ? 'Application updated successfully.' : 'Application submitted successfully.');
      if (!initialData) {
        setForm(emptyForm);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="section-card form-grid">
      <div className="detail-grid">
        <div className="detail-card">
          <h4>Personal Details</h4>
          <label>
            Full Name
            <input value={form.personalDetails.fullName} onChange={(e) => updateNested('personalDetails', 'fullName', e.target.value)} required />
          </label>
          <label>
            Date of Birth
            <input type="date" value={form.personalDetails.dateOfBirth} onChange={(e) => updateNested('personalDetails', 'dateOfBirth', e.target.value)} required />
          </label>
          <label>
            Gender
            <select value={form.personalDetails.gender} onChange={(e) => updateNested('personalDetails', 'gender', e.target.value)}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            Phone
            <input value={form.personalDetails.phone} onChange={(e) => updateNested('personalDetails', 'phone', e.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={form.personalDetails.email} onChange={(e) => updateNested('personalDetails', 'email', e.target.value)} required />
          </label>
          <label>
            Address
            <textarea rows={3} value={form.personalDetails.address} onChange={(e) => updateNested('personalDetails', 'address', e.target.value)} required />
          </label>
        </div>

        <div className="detail-card">
          <h4>Academic Details</h4>
          <label>
            College
            <input value={form.academicDetails.college} onChange={(e) => updateNested('academicDetails', 'college', e.target.value)} required />
          </label>
          <label>
            Course
            <input value={form.academicDetails.course} onChange={(e) => updateNested('academicDetails', 'course', e.target.value)} required />
          </label>
          <label>
            Year
            <input value={form.academicDetails.year} onChange={(e) => updateNested('academicDetails', 'year', e.target.value)} required />
          </label>
          <label>
            USN / Student ID
            <input value={form.academicDetails.studentIdNumber} onChange={(e) => updateNested('academicDetails', 'studentIdNumber', e.target.value)} required />
          </label>
          <label>
            Previous semester percentage / CGPA
            <input value={form.academicDetails.previousScore} onChange={(e) => updateNested('academicDetails', 'previousScore', e.target.value)} required />
          </label>
        </div>
      </div>

      <div className="detail-card">
        <h4>Hostel Details</h4>
        <div className="detail-grid">
          <label>
            Preferred Hostel
            <select value={form.hostelDetails.preferredHostel} onChange={(e) => updateNested('hostelDetails', 'preferredHostel', e.target.value)}>
              <option value="Hostel A">Hostel A</option>
              <option value="Hostel B">Hostel B</option>
            </select>
          </label>
          <label>
            Room Preference
            <select value={form.hostelDetails.roomPreference} onChange={(e) => updateNested('hostelDetails', 'roomPreference', e.target.value)}>
              <option value="Single">Single</option>
              <option value="Shared">Shared</option>
              <option value="Any">Any</option>
            </select>
          </label>
          <label>
            Mess Preference
            <select value={form.hostelDetails.messPreference} onChange={(e) => updateNested('hostelDetails', 'messPreference', e.target.value)}>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
              <option value="Mixed">Mixed</option>
            </select>
          </label>
          <label>
            Annual family income
            <input type="number" value={form.income} onChange={(e) => setForm((prev) => ({ ...prev, income: e.target.value }))} required />
          </label>
        </div>
      </div>

      <div className="detail-card">
        <h4>Guardian Details</h4>
        <div className="detail-grid">
          <label>
            Parent / Guardian Name
            <input value={form.guardianDetails.guardianName} onChange={(e) => updateNested('guardianDetails', 'guardianName', e.target.value)} required />
          </label>
          <label>
            Parent / Guardian Phone
            <input value={form.guardianDetails.guardianPhone} onChange={(e) => updateNested('guardianDetails', 'guardianPhone', e.target.value)} required />
          </label>
        </div>
      </div>

      {error && <div className="alert alert-error full-width">{error}</div>}
      {success && <div className="alert alert-success full-width">{success}</div>}

      <button type="submit" className="primary-btn full-width" disabled={loading}>
        {loading ? 'Submitting...' : initialData ? 'Update Application' : 'Submit Application'}
      </button>
    </form>
  );
}
