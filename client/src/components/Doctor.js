import React from 'react';
import { useNavigate } from 'react-router-dom';

function Doctor({ doctor }) {
    const navigate = useNavigate();
    
    return (
        <div 
            className='card p-2 cursor-pointer doctor-card' 
            onClick={() => navigate(`/book-appointment/${doctor._id}`)}
        >
            <div className='doctor-card-header'>
                <div className='doctor-avatar'>
                    <i className='ri-user-line'></i>
                </div>
                <h3 className='doctor-name'>
                    Dr. {doctor.firstName} {doctor.lastName}
                </h3>
                <p className='doctor-specialization'>{doctor.specialization}</p>
            </div>
            <hr style={{ margin: '15px 0', border: '1px solid #f0f0f0' }} />
            <div className='doctor-info'>
                <p className='info-item'>
                    <i className='ri-phone-line'></i>
                    <span>{doctor.phoneNumber}</span>
                </p>
                <p className='info-item'>
                    <i className='ri-map-pin-line'></i>
                    <span>{doctor.address}</span>
                </p>
                <p className='info-item'>
                    <i className='ri-time-line'></i>
                    <span>{doctor.timings && doctor.timings[0] ? `${doctor.timings[0]} - ${doctor.timings[1]}` : 'Not specified'}</span>
                </p>
                <p className='info-item'>
                    <i className='ri-briefcase-line'></i>
                    <span>{doctor.experience} years experience</span>
                </p>
                <p className='info-item fee-item'>
                    <i className='ri-money-dollar-circle-line'></i>
                    <span className='fee-amount'>Rs. {doctor.feePerConsultation}</span>
                </p>
            </div>
            <button className='book-now-btn'>
                <i className='ri-calendar-check-line'></i> Book Appointment
            </button>
        </div>
    );
}

export default Doctor;
