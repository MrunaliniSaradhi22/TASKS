import React from 'react';
import './Modal.css';
class Modal extends React.Component {
    constructor(props) {
        super(props);
    }
    handleOpen = () => {
        document.getElementById('my-modal').style.display = 'block';
    };
    handleClose = () => {
        document.getElementById('my-modal').style.display = 'none';
        this.props.onCancel();
    };
    closeModal = () => {
        document.getElementById('my-modal').style.display = 'none';
    };
    componentDidUpdate(prevProps) {
        if (prevProps.show !== this.props.show) {
            if (this.props.show) {
                this.handleOpen();
            } else {
                this.closeModal();
            }
        }
    }
    handleSubmit = () => {
        this.props.onSubmit();
    };
    outsideClick = (e) => {
        let modal = document.getElementById('my-modal');
        if (e.target === modal) {
            this.handleClose();
        }
    };
    render() {
        return (
            <div
                id="my-modal"
                className="modal"
                onClick={(e) => {
                    this.outsideClick(e);
                }}
            >
                <div className={'modal-content' + ' ' + this.props.size}>
                    <div className="modal-header">
                        <span className="close" onClick={this.handleClose}>
                            &times;
                        </span>
                        <h3>{this.props.title}</h3>
                    </div>
                    {this.props.size === 'lg' ? (
                        <div className="modal-body grow">
                            <div className="modal-body-content">{this.props.children}</div>
                        </div>
                    ) : (
                        <div className="modal-body">{this.props.children}</div>
                    )}
                    {this.props.showFooter ? (
                        <div className="modal-footer">
                            <div style={{ height: '10px' }}>
                                {this.props.btnload ? <div className="loading" /> : ''}
                            </div>
                            <button
                                className={this.props.btnload ? 'modal-button disabled' : 'modal-button'}
                                onClick={this.handleSubmit}
                                disabled={this.props.btnload}
                            >
                                SUBMIT
                            </button>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        );
    }
}

export default Modal;
