import { useEffect, useState } from "react";
import API from "../api";

function AdminDashboard() {
    const [dashboard, setDashboard] = useState({});
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);

    const [storeSort, setStoreSort] = useState("name");
    const [searchUser, setSearchUser] = useState("");
    const [searchStore, setSearchStore] = useState("");
    const [sort, setSort] = useState("name");

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER"
    });

    const [newStore, setNewStore] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: ""
    });

    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    const goToChangePassword = () => {
        window.location.href = "/change-password";
    };

    const loadDashboard = async () => {
        const res = await API.get("/admin/dashboard");
        setDashboard(res.data);
    };

    const loadUsers = async () => {
        const res = await API.get(`/admin/users?search=${searchUser}`);
        setUsers(res.data);
    };

    const loadStores = async () => {
        const res = await API.get(`/stores?search=${searchStore}`);
        setStores(res.data);
    };

    const addUser = async (e) => {
        e.preventDefault();

        if (newUser.address.length > 400) {
            alert("Address must be maximum 400 characters");
            return;
        }

        try {
            await API.post("/admin/users", newUser);
            alert("User added");
            loadUsers();
            loadDashboard();
        } catch {
            alert("Failed to add user");
        }
    };

    const addStore = async (e) => {
        e.preventDefault();

        if (newStore.address.length > 400) {
            alert("Store address must be maximum 400 characters");
            return;
        }

        try {
            await API.post("/stores", newStore);
            alert("Store added");
            loadStores();
            loadDashboard();
        } catch {
            alert("Failed to add store");
        }
    };

    useEffect(() => {
        loadDashboard();
        loadUsers();
        loadStores();
    }, []);

    let sortedUsers = [...users];

    if (sort === "name") {
        sortedUsers.sort(function (a, b) {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        });
    }

    if (sort === "email") {
        sortedUsers.sort(function (a, b) {
            if (a.email > b.email) return 1;
            if (a.email < b.email) return -1;
            return 0;
        });
    }

    if (sort === "role") {
        sortedUsers.sort(function (a, b) {
            if (a.role > b.role) return 1;
            if (a.role < b.role) return -1;
            return 0;
        });
    }

    let sortedStores = [...stores];

    if (storeSort === "name") {
        sortedStores.sort(function (a, b) {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        });
    }

    if (storeSort === "rating") {
        sortedStores.sort(function (a, b) {
            return Number(b.overallRating || 0) - Number(a.overallRating || 0);
        });
    }

    return (
        <div className="container">
            <div className="topbar">
                <h1>Admin Dashboard</h1>

                <div className="top-actions">
                    <button onClick={goToChangePassword}>
                        Change Password
                    </button>

                    <button onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>

            <div className="cards">
                <div>Total Users: {dashboard.totalUsers}</div>
                <div>Total Stores: {dashboard.totalStores}</div>
                <div>Total Ratings: {dashboard.totalRatings}</div>
            </div>

            <div className="grid">
                <div className="box">
                    <h2>Add User</h2>

                    <form onSubmit={addUser}>
                        <input
                            placeholder="Name"
                            value={newUser.name}
                            onChange={(e) =>
                                setNewUser({ ...newUser, name: e.target.value })
                            }
                        />

                        <input
                            placeholder="Email"
                            value={newUser.email}
                            onChange={(e) =>
                                setNewUser({ ...newUser, email: e.target.value })
                            }
                        />

                        <input
                            placeholder="Password"
                            value={newUser.password}
                            onChange={(e) =>
                                setNewUser({ ...newUser, password: e.target.value })
                            }
                        />

                        <textarea
                            placeholder="Address"
                            maxLength={400}
                            value={newUser.address}
                            onChange={(e) =>
                                setNewUser({ ...newUser, address: e.target.value })
                            }
                        />

                        <select
                            value={newUser.role}
                            onChange={(e) =>
                                setNewUser({ ...newUser, role: e.target.value })
                            }
                        >
                            <option value="USER">Normal User</option>
                            <option value="ADMIN">Admin</option>
                            <option value="OWNER">Store Owner</option>
                        </select>

                        <button type="submit">Add User</button>
                    </form>
                </div>

                <div className="box">
                    <h2>Add Store</h2>

                    <form onSubmit={addStore}>
                        <input
                            placeholder="Store Name"
                            value={newStore.name}
                            onChange={(e) =>
                                setNewStore({ ...newStore, name: e.target.value })
                            }
                        />

                        <input
                            placeholder="Store Email"
                            value={newStore.email}
                            onChange={(e) =>
                                setNewStore({ ...newStore, email: e.target.value })
                            }
                        />

                        <textarea
                            placeholder="Address"
                            maxLength={400}
                            value={newStore.address}
                            onChange={(e) =>
                                setNewStore({ ...newStore, address: e.target.value })
                            }
                        />

                        <input
                            placeholder="Owner User ID"
                            value={newStore.owner_id}
                            onChange={(e) =>
                                setNewStore({
                                    ...newStore,
                                    owner_id: e.target.value
                                })
                            }
                        />

                        <button type="submit">Add Store</button>
                    </form>
                </div>
            </div>

            <div className="box">
                <h2>Users</h2>

                <input
                    placeholder="Search users"
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                />

                <div className="button-row">
                    <button onClick={loadUsers}>Search</button>

                    <button onClick={() => setSort("name")}>
                        Sort By Name
                    </button>

                    <button onClick={() => setSort("email")}>
                        Sort By Email
                    </button>

                    <button onClick={() => setSort("role")}>
                        Sort By Role
                    </button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Role</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedUsers.map((u) => (
                            <tr key={u.id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.address}</td>
                                <td>{u.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="box">
                <h2>Stores</h2>

                <input
                    placeholder="Search stores"
                    value={searchStore}
                    onChange={(e) => setSearchStore(e.target.value)}
                />

                <div className="button-row">
                    <button onClick={loadStores}>Search</button>

                    <button onClick={() => setStoreSort("name")}>
                        Sort By Name
                    </button>

                    <button onClick={() => setStoreSort("rating")}>
                        Sort By Rating
                    </button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Rating</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedStores.map((s) => (
                            <tr key={s.id}>
                                <td>{s.name}</td>
                                <td>{s.email}</td>
                                <td>{s.address}</td>
                                <td>{s.overallRating || "No rating"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;