import React, { useState } from 'react';
import './Login.css';
import SweetAlert from 'react-bootstrap-sweetalert';
const apiKey = '192d947ca10eea9d';
export default function Login() {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [successAlert, setSuccessAlert] = useState(false);
    const [nameError, setNameError] = useState('');
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false);
    const [response, setResponse] = useState({});
    const [error, setError] = useState('');


    function handleChange(e) {
        if (e.target.name === '') {
            setNameError('')
        }
        if (e.target.name === 'Id') {
            setId(e.target.value);
        }
        else {
            setName(e.target.value);
        }

    };
    function validationForm() {
        let formIsValid = true;
        let errors = {
            name: '',
        };
        if (name === '') {
            errors.name = '*Please enter name';
            formIsValid = false;
        }
        setNameError(errors.name);
        return formIsValid;
    };
    async function handleSignIn(e) {
        e.preventDefault();
        setNameError('');
        if (validationForm()) {
            setButtonLoading(true);
            let user = {
                name: name,
                apiKey: apiKey,
            };
            await loginUser(user);
            setButtonLoading(false);
            if (error.length > 0) {
                setSuccessAlert(true);
                setStatus('danger');
                setTitle(error);
            }
        }
    };
    function loginUser(user) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        };
        fetch('https://dev-dl.tdcx.com:3092/login', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data) {
                    setResponse(data);

                    setName('');
                    setId('');
                    localStorage.setItem('name', data.token.name);
                    localStorage.setItem('token', data.token.token);
                    localStorage.setItem('image', data.image);
                    window.location.href = '/dashboard';
                }
                else {
                    setError('Could not process your request');
                }
            });
    }

    return (
        <>
            <SweetAlert
                status={status}
                title={title}
                show={successAlert}
                onClose={() => {
                    setSuccessAlert(false);
                }}
            />
            <div className="login-body">
                <div className="login-content">
                    <form>
                        <div className="login-card">
                            <div className="signIn">Login</div>
                            <div className={`input-box`}>
                                <input
                                    type="text"
                                    className="txt-input"
                                    name="Id"
                                    placeholder="Id"
                                    value={id}
                                    onChange={e => {
                                        handleChange(e);
                                    }}
                                />
                            </div>

                            <div className={`input-box last${nameError ? ' err' : ''}`}>
                                <input
                                    type="text"
                                    className="txt-input"
                                    placeholder="Name"
                                    name="name"
                                    value={name}
                                    onChange={e => {
                                        handleChange(e);
                                    }}
                                />
                                {nameError ? (
                                    <div className="error_msg">{nameError}</div>
                                ) : (
                                    ''
                                )}
                            </div>


                            <button
                                className={buttonLoading ? 'login-submit disabled' : 'login-submit'}
                                onClick={handleSignIn}
                                id="submit-button"
                                disabled={buttonLoading}
                            >
                                <>
                                    Login
                                        {buttonLoading ? <div className="loading w log" /> : ''}
                                </>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}





