import React from 'react';
import Users from './Users.jsx'

const apiURL = 'http://localhost:5151'
//const apiURLTest = 'http://localhost:4000'

function BugForm({ bug, updateBug, formMode, submitCallback, cancelCallback }) {

    let cancelClicked = (event) => {
        event.preventDefault();
        cancelCallback();
    }

    let buttonCreation = () => {
        if (formMode === "new") {
            return (
                <button type="submit" className="btn btn-primary">Create</button>
            );
        } else {
            return (
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Save</button>
                    <button type="submit" className="btn btn-danger" onClick={cancelClicked} >Cancel</button>
                </div>
            );
        }
    }

    let formSubmitted = (event) => {
        event.preventDefault();
        submitCallback();
    };

    return (
        <div className="bug-form">
            <h1> Bugs </h1>
            <form onSubmit={formSubmitted}>
            <div className="form-group">
                    <label>User</label>
                    <select>
                    <option value="Users">{Users.UserList}</option>
                    </select>
            </div>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" className="form-control" autoComplete='given-name' name="title" id="title"
                        placeholder="Title" value={bug.title} onChange={(event) => updateBug('title', event.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input type="text" className="form-control" autoComplete='family-name' name="description" id="description"
                        placeholder="Description" value={bug.description} onChange={(event) => updateBug('description', event.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="issue_type">Issue Type</label>
                    <input type="issue_type" className="form-control" autoComplete='issue_type' name="issue_type" id="issue_type"
                        placeholder="Feature" value={bug.issue_type} onChange={(event) => updateBug('issue_type', event.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <input type="priority" className="form-control" autoComplete='priority' name="priority" id="priority"
                        placeholder="Medium" value={bug.priority} onChange={(event) => updateBug('priority', event.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <input type="status" className="form-control" autoComplete='status' name="status" id="status"
                        placeholder="Open" value={bug.status} onChange={(event) => updateBug('status', event.target.value)} />
                </div>
                {/*<div className="form-group">
                    <label htmlFor="status">Status</label>
                   <select value={bug.status} onChange={(event) => updateBug(event.target.value)}>
                   <option value="status">open</option>
                   </select>
    </div>*/}
                {buttonCreation()}
            </form>
        </div>
    );
}

function BugListItem({ bug, onChange, onRemoval }) {
    return (
        <tr>
            <td className="col-md-3">{bug.title}</td>
            <td className="col-md-3">{bug.description}</td>
            <td className="col-md-3">{bug.issue_type}</td>
            <td className="col-md-3">{bug.priority}</td>
            <td className="col-md-3">{bug.status}</td>
            <td className="col-md-3 btn-toolbar">
                <button className="btn btn-success btn-sm" onClick={event => onChange(bug)}>
                    <i className="glyphicon glyphicon-pencil"></i> Edit
          </button>
                <button className="btn btn-danger btn-sm" onClick={event => onRemoval(bug.id)}>
                    <i className="glyphicon glyphicon-remove"></i> Delete
          </button>
            </td>
        </tr>
    );
}

function BugList({ bugs, onChange, onRemoval }) {
    console.log("The bugs: ");
    console.log(bugs);
    const bugItems = bugs.map((bug) => (
        <BugListItem key={bug.id} bug={bug} onChange={onChange} onRemoval={onRemoval} />
    ));

    return (
        <div className="bug-list">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th className="col-md-3">Title</th>
                        <th className="col-md-3">Description</th>
                        <th className="col-md-3">Issue Type</th>
                        <th className="col-md-3">Priority</th>
                        <th className="col-md-3">Status</th>
                        <th className="col-md-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bugItems}
                </tbody>
            </table>
        </div>
    );
}

function Bugs() {

    let [bugList, setBugList] = React.useState([
        { id: 1, title: "Has", description: "Not", issue_type: "Loaded", priority: "Just", status: "Yet" }
    ]);

    let [formMode, setFormMode] = React.useState("new");

    let emptyBug = { title: '', description: '', issue_type: '', priority: '', status: '' };
    let [currentBug, setCurrentBug] = React.useState(emptyBug);

    let fetchBugs = () => {
        fetch(`${apiURL}/users/1/bugs`).then(response => {
            console.log("Look what I got: ");
            console.log(response);
            return response.json();
        }).then(data => {
            console.log("And the JSON");
            console.log(data);
            setBugList(data);
        });
    };

    React.useEffect(() => fetchBugs(), []);

    let updateBug = (field, value) => {
        let newBug = { ...currentBug }
        newBug[field] = value;
        setCurrentBug(newBug);
    }

    let postNewBug = (bug) => {
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(bug)
        };
        console.log("Attempting to post new bug");
        console.log(bug);
        console.log(options.body);
        return fetch(`${apiURL}/users/1/bugs`, options).then(response => {
            return response.json();
        });
    }

    let formSubmitted = () => {
        if (formMode === "new") {
            postNewBug(currentBug).then(data => {
                console.log("Received data");
                console.log(data);

                if (!data.message) {
                    currentBug.id = data.id;
                    setBugList([...bugList, currentBug]);
                } else {
                    console.log("Issue!! " + data.message);
                }
            });
        } else {
            let newBugList = [...bugList];
            let bugIndex = bugList.findIndex((bug) => bug.id === currentBug.id);

            newBugList[bugIndex] = currentBug;
            setBugList(newBugList);
        }
    }

    let editClicked = (bug) => {
        setFormMode("update");
        setCurrentBug(bug);
    }

    let cancelClicked = () => {
        setFormMode("new");
        setCurrentBug(emptyBug)
    }

    let deleteClicked = (id) => {
        setBugList(bugList.filter((item) => item.id !== id));
        cancelClicked();
    }

    return (
        <div className="bugs">
            <BugForm formMode={formMode} bug={currentBug} updateBug={updateBug}
                submitCallback={formSubmitted} cancelCallback={cancelClicked} />
            <div />
            <BugList bugs={bugList} onChange={editClicked} onRemoval={deleteClicked} />
        </div>
    );
}

export default Bugs;