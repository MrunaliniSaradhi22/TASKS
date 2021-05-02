import React from 'react';
import './Header.css';
import Image from 'react-bootstrap/Image'
export default function Header(props) {
    function logout() {
        localStorage.removeItem('image');
        localStorage.removeItem('name');
        localStorage.removeItem('token');
        window.location.href = '/'
    }
    return (
        <div className="header">
            <div className="profile" style={{ display: "flex" }}>
                <div>
                    <img className="image" src={`https://dev-dl.tdcx.com:3092/${localStorage.getItem('image')}`} alt="Profile" />
                </div>
                <div>
                    <span className="name">{localStorage.getItem('name')}</span>
                </div>
            </div>
            <div className="logout">
                <span onClick={logout}>Logout</span>
            </div>
        </div>
    )
}