import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Signup() {
    const navigate = useNavigate();
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
   

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.post("/auth/signup", form);
            alert("Signup successful");
            navigate("/");
        } catch (err) {
            alert("Something went wrong");
        }   
    };

    return (
        <div className="auth-box">
            <h2>User Signup</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Name min 20 chars"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <textarea
                    placeholder="Address"
                    value={address}
                    maxLength={400}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password e.g. Test@123"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <button>Signup</button>
            </form>

            <p>
                Already registered? <Link to="/">Login</Link>
            </p>
        </div>
    );
}

export default Signup;