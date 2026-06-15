import { useEffect, useState } from "react";
import API from "../api";

function OwnerDashboard() {
    const [data, setData] = useState({
        averageRating: 0,
        ratings: []
    });

    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    const loadData = async () => {
        const res = await API.get("/owner/dashboard");
        setData(res.data);
    };

    useEffect(function() {
        loadData();
     }, []);
    
    return (
        <div className="container">
            <div className="topbar">
    <h1>Store Owner Dashboard</h1>

    <div className="top-actions">
        <button
            onClick={() =>
                (window.location.href = "/change-password")
            }
        >
            Change Password
        </button>

        <button onClick={logout}>
            Logout
        </button>
        </div>
    </div>

            <div className="cards">
                <div>Average Rating: {data.averageRating}</div>
            </div>

            <div className="box">
                <h2>Users Who Rated Your Store</h2>

                <table>
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email</th>
                            <th> User Address</th>
                            <th>Rating</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.ratings.map((r, index) => (
                            <tr key={index}>
                                <td>{r.name}</td>
                                <td>{r.email}</td>
                                <td>{r.address}</td>
                                <td>{r.rating}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default OwnerDashboard;