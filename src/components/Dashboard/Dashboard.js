import React, { useEffect, useState, useRef } from 'react';
import './Dashboard.css';
import Header from '../Header/Header';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Pie } from 'react-chartjs-2';
import debounce from 'lodash.debounce';
import Pagination from "@material-ui/lab/Pagination";
import 'font-awesome/css/font-awesome.min.css';
import Skeleton from "react-loading-skeleton";
const token = localStorage.getItem('token');
export default function Dashboard(props) {
    const wrapperRef = useRef(null);
    const [tasks, setTasks] = useState([]);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [displayAddTask, setDisplayAddTask] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [nameError, setNameError] = useState('');
    const [error, setError] = useState('');
    const [successAlert, setSuccessAlert] = useState(false);
    const [failAlert, setFailAlert] = useState(false);
    const [status, setStatus] = useState('');
    const [title, setTitle] = useState('');
    const [msg, setMsg] = useState('')
    const [dashboard, setDashboard] = useState({});
    const itemsPerPage = 4;
    const [page, setPage] = useState(1);
    const [noOfPages, setNoOfPages] = useState(Math.ceil(tasks.length / itemsPerPage));
    const [id, setId] = useState('');
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [displayEditTask, setDisplayEditTask] = useState(false);
    const [searchString, setSearchString] = useState('');
    const [tasksDefault, setTasksDefault] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(async () => {
        // document.addEventListener("click", handleClickOutside, false);
        // return () => {
        //     document.removeEventListener("click", handleClickOutside, false);
        // };
        return await setTimeout(async () => {
            await getDashboard();
            await getTasks();
        }, 5000)

    }, [])
    const getDashboard = () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        };
        fetch('https://dev-dl.tdcx.com:3092/dashboard', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (Object.keys(data).length > 1) {
                    setDashboard(data);
                    setLoading(false);
                }
                else {
                    setError(data.msg);
                    setFailAlert(true);
                    setStatus('danger');
                    setTitle('Oops!');
                }
            })
            .catch(err => {
                setError('Could not process your request');
                setFailAlert(true);
                setStatus('danger');
                setTitle('Oops!');
            })
    }
    const getTasks = () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        };
        fetch('https://dev-dl.tdcx.com:3092/tasks', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (Object.keys(data).length > 1) {
                    setTasks(data.tasks);
                    setTasksDefault(data.tasks);
                    setNoOfPages(Math.ceil(data.tasks.length / itemsPerPage));
                    setLoading(false);
                }
                else {
                    setError(data.msg);
                    setFailAlert(true);
                    setStatus('danger');
                    setTitle('Oops!');
                }
            })
            .catch(err => {
                setError('Could not process your request');
                setFailAlert(true);
                setStatus('danger');
                setTitle('Oops!');
            })
    }
    const handleClickOutside = event => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setDisplayAddTask(false);
        }
    };

    function handleAddTask() {
        setDisplayAddTask(true);
    }
    function validationForm() {
        let formIsValid = true;
        let errors = {
            name: '',
        };
        if (taskName.length == 0) {
            errors.name = '*Please enter task name';
            formIsValid = false;
        }
        setNameError(errors.name);
        return formIsValid;
    };
    async function handleAdd(e) {
        e.preventDefault();
        if (validationForm()) {
            setButtonLoading(true);
            let task = {
                "name": taskName
            };

            await addTask(task);
            setButtonLoading(false);
            if (error.length > 0) {

            }

        }
    }
    async function handleEdit(e) {
        console.log("came here1")
        e.preventDefault();
        if (validationForm()) {
            setButtonLoading(true);
            let task = {
                "name": taskName
            };

            await editTask(task);
            setButtonLoading(false);
            if (error.length > 0) {

            }

        }
    }
    function addTask(task) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(task)
        };
        fetch('https://dev-dl.tdcx.com:3092/tasks', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.task) {
                    console.log([...tasks, data.task]);
                    setTasks([...tasks, data.task]);
                    setTasksDefault([...tasksDefault, data.task])
                    setMsg(data.msg);
                    setTitle('Success');
                    setStatus('success');
                    setSuccessAlert(true);
                    setDisplayAddTask(false);
                    setTaskName('');
                }
                else {
                    setError(data.msg);
                    setFailAlert(true);
                    setStatus('danger');
                    setTitle('Oops!');
                }
            })
            .catch(err => {
                setError('Could not process your request');
                setFailAlert(true);
                setStatus('danger');
                setTitle('Oops!');
            })
    }
    function editTask(task) {
        console.log("came here 2")
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(task)
        };
        fetch(`https://dev-dl.tdcx.com:3092/tasks/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.task) {
                    getTasks();
                    setMsg(data.msg);
                    setTitle('Success');
                    setStatus('success');
                    setSuccessAlert(true);
                    setDisplayEditTask(false);
                    setTaskName('');
                }
                else {
                    setError(data.msg);
                    setFailAlert(true);
                    setStatus('danger');
                    setTitle('Oops!');
                }
            })
            .catch(err => {
                setError('Could not process your request');
                setFailAlert(true);
                setStatus('danger');
                setTitle('Oops!');
            })
    }
    function completeTask(id, completed) {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ 'completed': !completed })
        };
        fetch(`https://dev-dl.tdcx.com:3092/tasks/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.task) {
                    getTasks();
                    setMsg(data.msg);
                    setTitle('Success');
                    setStatus('success');
                    setSuccessAlert(true);
                    setId('');
                    getTasks();
                    getDashboard();
                }
                else {
                    setError(data.msg);
                    setFailAlert(true);
                    setStatus('danger');
                    setTitle('Oops!');
                }
            })
            .catch(err => {
                setError('Could not process your request');
                setFailAlert(true);
                setStatus('danger');
                setTitle('Oops!');
            })
    }
    function deleteTask() {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        };
        fetch(`https://dev-dl.tdcx.com:3092/tasks/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.task) {
                    setMsg(data.msg);
                    setTitle('Success');
                    setStatus('success');
                    setSuccessAlert(true);
                    getTasks();
                    getDashboard();
                }
                else {
                    setError(data.msg);
                    setFailAlert(true);
                    setStatus('danger');
                    setTitle('Oops!');
                }
            })
            .catch(err => {
                setError('Could not process your request');
                setFailAlert(true);
                setStatus('danger');
                setTitle('Oops!');
            })
    }
    const handleSearch = debounce(value => {
        let tasklist = tasksDefault.filter(task => {
            if (`${task.name}`.toLowerCase().includes(value.toLowerCase())) {
                return true;
            }
            return false;
        });
        setNoOfPages(Math.ceil(tasklist.length / itemsPerPage));
        setTasks(tasklist);

    }, 50);
    const data = {
        datasets: [
            {
                labels: ['Completed Tasks', 'Total Tasks'],
                backgroundColor: ['#5285EC', '#E8ECEC'],
                data: [dashboard.tasksCompleted ? dashboard.tasksCompleted : 0, dashboard.totalTasks ? dashboard.totalTasks : 0]
            }
        ]
    }
    const handleChange = (event, value) => {
        setPage(value);
    };
    const SkeletonCard = () => {
        return (
            <>

                <div className="top">
                    <div className="card-body completed">
                        <Skeleton height={150} width={280} />
                    </div>
                    <div className="card-body latest">
                        <Skeleton height={150} width={280} />
                    </div>
                    <div className="card-body status">
                        <Skeleton height={150} width={280} />
                    </div>
                </div>
                <div className="bottom-heading">
                    <div className="bottom-heading-left">
                        <Skeleton height={50} width={100} />
                    </div>
                    <div className="bottom-heading-right">
                        <div className="bottom-heading-search">
                            <Skeleton height={50} width={200} />
                        </div>
                        <div className="bottom-heading-button">
                            <Skeleton height={50} width={100} />
                        </div>
                    </div>
                </div>
                <div className="bottom-card-body">
                    <div className="bottom-card-content">
                        <div className="skeleton-bottom-card" style={{ top: "-20px" }}>
                            <Skeleton height={300} width={1210}>
                                <Skeleton height={50} width={300} count={5} />
                            </Skeleton>
                        </div>
                    </div>
                </div>

            </>
        )
    }
    return (
        <div className="taskBody">
            <Header />
            {loading ?
                <SkeletonCard />
                :
                <>
                    {successAlert ?
                        <SweetAlert
                            success
                            status={status}
                            onConfirm={() => setSuccessAlert(false)}
                            title={title}
                            showCancel={false}
                            timeout={2000}
                            onClose={() => setSuccessAlert(false)}
                            confirmBtnBsStyle="success"
                        >
                            {msg}
                        </SweetAlert> : ''}
                    {failAlert ?
                        <SweetAlert
                            danger
                            status={status}
                            title={title}
                            show={failAlert}
                            onConfirm={() => setFailAlert(false)}
                            showCancel={false}
                            onClose={() => {
                                setFailAlert(false);
                            }}
                            confirmBtnBsStyle="danger"
                        >{error}</SweetAlert> : ''}
                    {deleteAlert ?
                        <SweetAlert
                            warning
                            showCancel
                            confirmBtnText="Yes, delete it!"
                            title="Are you sure?"
                            onConfirm={() => { setDeleteAlert(false); deleteTask() }}
                            onCancel={() => {
                                setDeleteAlert(false);
                                setId('')
                            }}
                            focusCancelBtn
                            confirmBtnBsStyle="danger"
                            cancelBtnBsStyle="default"
                        >
                            You will not be able to recover this task!
              </SweetAlert> : ''
                    }

                    {
                        displayAddTask ?
                            <div id="myModal" className="modal">
                                <div className="task-body" ref={wrapperRef}>
                                    <div className="task-content">
                                        <div className="add-task-card">
                                            <div className="add-heading">+ New Task</div>
                                            <div className={`input-box ${nameError ? ' err' : ''}`}>
                                                <input
                                                    type="text"
                                                    className="txt-input"
                                                    name="taskName"
                                                    placeholder="Task Name"
                                                    value={taskName}
                                                    onChange={e => {
                                                        setTaskName(e.target.value);
                                                    }}
                                                />
                                                {nameError ? (
                                                    <div className="error_msg">{nameError}</div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                            <button
                                                className={buttonLoading ? 'add-task-submit disabled' : 'add-task-submit'}
                                                id="add-submit-button"
                                                disabled={buttonLoading}
                                                onClick={handleAdd}
                                            >
                                                <>
                                                    + New Task
                                        {buttonLoading ? <div className="loading w log" /> : ''}
                                                </>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            ''
                    }
                    {
                        displayEditTask == true ?
                            <div id="myModal" className="modal">
                                <div className="task-body" ref={wrapperRef}>
                                    <div className="task-content">
                                        <div className="add-task-card">
                                            <div className="add-heading">Edit Task</div>
                                            <div className={`input-box ${nameError ? ' err' : ''}`}>
                                                <input
                                                    type="text"
                                                    className="txt-input"
                                                    name="taskName"
                                                    placeholder="Task Name"
                                                    value={taskName}
                                                    onChange={e => {
                                                        setTaskName(e.target.value);
                                                    }}
                                                />
                                                {nameError ? (
                                                    <div className="error_msg">{nameError}</div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                            <button
                                                className={buttonLoading ? 'add-task-submit disabled' : 'add-task-submit'}
                                                id="add-submit-button"
                                                disabled={buttonLoading}
                                                onClick={handleEdit}
                                            >
                                                <>
                                                    Edit Task
                                        {buttonLoading ? <div className="loading w log" /> : ''}
                                                </>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            ''
                    }
                    {tasks.length == 0 && !displayAddTask && tasksDefault.length == 0 ?
                        <div className="task-body">
                            <div className="task-content">
                                <div className="task-card">
                                    <div className="heading">You have no task.</div>
                                    <button
                                        className={buttonLoading ? 'task-submit disabled' : 'task-submit'}
                                        id="submit-button"
                                        disabled={buttonLoading}
                                        onClick={handleAddTask}
                                    >
                                        <>
                                            + New Task
                                        {buttonLoading ? <div className="loading w log" /> : ''}
                                        </>
                                    </button>
                                </div>
                            </div>
                        </div>
                        : ''

                    }
                    {Object.keys(dashboard).length > 1 && tasksDefault.length > 0 ?
                        <div>
                            <div className="top">
                                <div className="card-body completed">
                                    <div className="card-content">
                                        <div className="top-card">
                                            <div className="top-heading">Tasks Completed</div>
                                            <div className="top-card-body completed">
                                                <div className="top-card-task-completed">{dashboard.tasksCompleted}</div>
                                                <div className="top-card-task-total">/ {dashboard.totalTasks}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body latest">
                                    <div className="card-content">
                                        <div className="top-card">
                                            <div className="top-heading">Latest Created Tasks</div>
                                            <div className="top-card-body">
                                                <ul className="latest-list">
                                                    {dashboard.latestTasks.map((task, index) => {
                                                        return (
                                                            <li className={`latest-task ${task.completed === true ? 'completed' : ''} clearfix`} key={index}>{task.name}</li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body status">
                                    <div className="card-content">
                                        <div className="top-card chart">
                                            <Pie data={data}
                                                options={
                                                    {
                                                        title: { display: false },
                                                        legend: { display: false },
                                                        radius: 60,
                                                        tooltip: {
                                                            title: ['Completed Tasks', 'Total Tasks']
                                                        }
                                                    }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bottom-heading">
                                <div className="bottom-heading-left">
                                    <div className="bottom-heading-task">Tasks</div>
                                </div>
                                <div className="bottom-heading-right">
                                    <div className="bottom-heading-search">
                                        <div className="comp-search-box">
                                            <div className="input-with-icn">
                                                <i class="fa fa-search" aria-hidden="true" id="icn"></i>
                                                <input
                                                    type="text"
                                                    className="task-search-i"
                                                    placeholder="Search by task name"
                                                    value={searchString}
                                                    onChange={e => {
                                                        setSearchString(e.target.value);
                                                        handleSearch(e.target.value);
                                                    }}
                                                ></input>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bottom-heading-button">
                                        <button
                                            className={buttonLoading ? 'add-task-submit task disabled' : 'add-task-submit task'}
                                            id="add-submit-button"
                                            disabled={buttonLoading}
                                            onClick={() => setDisplayAddTask(true)}
                                        >
                                            <>
                                                + New Task
                                        {buttonLoading ? <div className="loading w log" /> : ''}
                                            </>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="bottom-card-body">
                                <div className="bottom-card-body">
                                    <div className="bottom-card-content">
                                        <div className="bottom-card">
                                            <div className="bottom-card-body">
                                                {tasks.length ?
                                                    tasks.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((task) => {
                                                        return (
                                                            <div className="task-list">
                                                                <div className="task-details">
                                                                    <div className="task">
                                                                        <div className="task-check">
                                                                            <input className={`task-check ${task.completed ? 'completed' : ''}`} id={task._id} type="checkbox" checked={task.completed} onChange={() => { completeTask(task._id, task.completed) }} />
                                                                        </div>
                                                                        <div className={`task-name ${task.completed ? 'completed' : ''}`}>{task.name}</div>
                                                                    </div>
                                                                    <div className="task-actions">
                                                                        <div className="task-edit">
                                                                            <button className="actions-button" onClick={() => { setDisplayEditTask(true); setId(task._id); setTaskName(task.name) }}>
                                                                                <i class="fa fa-pencil" aria-hidden="true"></i>
                                                                            </button>
                                                                        </div>
                                                                        <div className="task-delete">
                                                                            <button className="actions-button" onClick={() => { setId(task._id); setDeleteAlert(true) }}>
                                                                                <i class="fa fa-trash" aria-hidden="true"></i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <hr />
                                                            </div>
                                                        )
                                                    }) : <div className="no-tasks">No tasks found!</div>}
                                                <div className="paginate">
                                                    <Pagination
                                                        count={noOfPages}
                                                        page={page}
                                                        onChange={handleChange}
                                                        defaultPage={1}
                                                        color="#5285EC"
                                                        size="large"
                                                        showFirstButton
                                                        showLastButton
                                                        siblingCount={1}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> : ''}
                </>
            }
        </div>
    )
}