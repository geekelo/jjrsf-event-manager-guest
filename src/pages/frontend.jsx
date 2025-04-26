import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authenticateFrontDesk } from '../redux/slices/frontdeskSlice';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/front.css';
import 'react-toastify/dist/ReactToastify.css';

export default function FrontDeskLogin() {
  const { unique_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passcode, setPasscode] = useState('');
  const { loading, error, frontDeskData } = useSelector((state) => state.frontdesk);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dispatch authentication
    const result = await dispatch(authenticateFrontDesk({ unique_id, passcode }));

    if (authenticateFrontDesk.fulfilled.match(result)) {
      toast.success("Authenticated successfully!");
      setTimeout(() => {
        navigate(`/events/frontdesk/${unique_id}/admit`);
      }, 1500);
    } else if (authenticateFrontDesk.rejected.match(result)) {
      const errorMessage = result?.payload || "Wrong passcode. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Verifying...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error || "Authentication failed."}</div>;
  }

  return (
    <div className="front-desk-container">
      <form onSubmit={handleSubmit} className="front-desk-form">
        <h2 className="front-desk-title">Enter Front Desk Passcode</h2>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Passcode"
          className="front-desk-input"
          disabled={loading}
        />
        <button type="submit" disabled={loading} className="front-desk-submit-btn">
          {loading ? 'Verifying...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
