// Configure the edit button to populate the form with the desired User data and process the update.

import React from 'react';

const apiURL = 'http://localhost:5151'

function UserForm({ user, updateUser, formMode, submitCallback, cancelCallback }) {

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
        // Prevent the browser from re-loading the page.
        event.preventDefault();
        submitCallback();
    };

    return (
        <div className="user-form">
            <h1> Users </h1>
            <form onSubmit={formSubmitted}>
                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" className="form-control" autoComplete='given-name' name="fname" id="fname"
                        placeholder="First Name" value={user.fname} onChange={(event) => updateUser('fname', event.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="lname">Last Name</label>
                    <input type="text" className="form-control" autoComplete='family-name' name="lname" id="lname"
                        placeholder="Last Name" value={user.lname} onChange={(event) => updateUser('lname', event.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" autoComplete='email' name="email" id="email"
                        placeholder="name@example.com" value={user.email} onChange={(event) => updateUser('email', event.target.value)} />
                </div>
                {buttonCreation()}
            </form>
        </div>
    );
}

function UserListItem({ user, onChange, onRemoval }) {
    // Notice that the buttons currently don't do anything when clicked.
    return (
        <tr>
            <td className="col-md-3">{user.fname}</td>
            <td className="col-md-3">{user.lname}</td>
            <td className="col-md-3">{user.email}</td>
            <td className="col-md-3 btn-toolbar">
                <button className="btn btn-success btn-sm" onClick={event => onChange(user)}>
                    <i className="glyphicon glyphicon-pencil"></i> Edit
          </button>
                <button className="btn btn-danger btn-sm" onClick={event => onRemoval(user.id)}>
                    <i className="glyphicon glyphicon-remove"></i> Delete
          </button>
            </td>
        </tr>
    );
}

function UserList({ users, onChange, onRemoval }) {
    console.log("The users: ");
    console.log(users);
    const userItems = users.map((user) => (
        <UserListItem key={user.id} user={user} onChange={onChange} onRemoval={onRemoval} />
    ));

    return (
        <div className="user-list">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th className="col-md-3">First Name</th>
                        <th className="col-md-3">Last Name</th>
                        <th className="col-md-3">Email</th>
                        <th className="col-md-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userItems}
                </tbody>
            </table>
        </div>
    );
}

function Users() {

    let [userList, setUserList] = React.useState([
        { id: 1, fname: "Hasn't", lname: "Loaded", email: "Yet" }
    ]);

    let [formMode, setFormMode] = React.useState("new");

    let emptyUser = { fname: '', lname: '', email: '' };
    let [currentUser, setCurrentUser] = React.useState(emptyUser);

    let fetchUsers = () => {
        fetch(`${apiURL}/users`).then(response => {
            console.log("Look what I got: ");
            console.log(response);
            return response.json();
        }).then(data => {
            console.log("And the JSON");
            console.log(data);

            setUserList(data);

            // Use this instead of the line above if you want to see what happens
            // if the server is slow.
            //setTimeout(() => setUserList(data), 5000);
        });
    };

    React.useEffect(() => fetchUsers(), []);

    let updateUser = (field, value) => {
        let newUser = { ...currentUser }
        newUser[field] = value;
        setCurrentUser(newUser);
    }

    let postNewUser = (user) => {
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(user)
        };
        console.log("Attempting to post new user");
        console.log(user);
        console.log(options.body);
        return fetch(`${apiURL}/users`, options).then(response => {
            return response.json();
        });
    }

    let formSubmitted = () => {
        if (formMode === "new") {
            postNewUser(currentUser).then(data => {
                console.log("Received data");
                console.log(data);

                // The presence of a message key indicates there was an error.
                if (!data.message) {
                    currentUser.id = data.id;
                    setUserList([...userList, currentUser]);
                } else {
                    console.log("New user wasn't created because " + data.message);
                }
            });
        } else {
            // Notice! This does not submit changes to the server!
            let newUserList = [...userList];
            let userIndex = userList.findIndex((user) => user.id === currentUser.id);

            newUserList[userIndex] = currentUser;
            setUserList(newUserList);
        }
    }

    let editClicked = (user) => {
        setFormMode("update");
        setCurrentUser(user);
    }

    let cancelClicked = () => {
        setFormMode("new");
        setCurrentUser(emptyUser)
    }

    let deleteClicked = (id) => {
        setUserList(userList.filter((item) => item.id !== id));
        cancelClicked();
    }

    return (
        <div className="users">
            <UserForm formMode={formMode} user={currentUser} updateUser={updateUser}
                submitCallback={formSubmitted} cancelCallback={cancelClicked} />
            <div />
            <UserList users={userList} onChange={editClicked} onRemoval={deleteClicked} />
        </div>
    );
}

export default Users;