import { useState } from "react";
import API from "../api";

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await API.put("/auth/change-password", {
                oldPassword,
                newPassword
            });

            alert(res.data.message);
            window.history.back();
            } catch(err) {
            alert("Something went wrong");
           }
    };

    return (
        <div className="auth-box">
            <h2>Change Password</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />

                <button type="submit">Change Password</button>
            </form>
        </div>
    );
}

export default ChangePassword;