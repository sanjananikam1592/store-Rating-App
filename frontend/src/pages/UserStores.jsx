import { useEffect, useState } from "react";
import API from "../api";

function UserStores() {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");

    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    const loadStores = async () => {
        const res = await API.get(`/stores?search=${search}`);
        setStores(res.data);
    };

    const submitRating = async (storeId, rating) => {
        try {
    
            const res = await API.post("/user/ratings", {
                store_id: storeId,
                rating: Number(rating)
            });
    
            alert(res.data.message);
    
            loadStores();
    
        } catch {
            alert("Rating failed");
        }
    };

    useEffect(() => {
        loadStores();
    }, []);

    return (
        <div className="container">
            <div className="topbar">
    <h1>Stores</h1>

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

            <div className="box">
                <input
                    placeholder="Search by name or address"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button onClick={loadStores}>Search</button>
            </div>

            <div className="store-list">
                {stores.map((store) => (
                    <div className="store-card" key={store.id}>
                        <h2>{store.name}</h2>
                        <p>{store.address}</p>

                        <p>
                            Overall Rating: <b>{store.overallRating || "No rating"}</b>
                        </p>

                        <p>
                            Your Rating: <b>{store.userRating || "Not rated"}</b>
                        </p>

                        <p>
                          <b>Submit / Modify Rating</b>
                        </p>

                        <select
                            defaultValue={store.userRating || ""}
                            onChange={(e) => submitRating(store.id, e.target.value)}
                        >
                            <option value="">Select Rating</option>
                            <option value="1">1 Star</option>
                            <option value="2">2 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="5">5 Stars</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserStores;