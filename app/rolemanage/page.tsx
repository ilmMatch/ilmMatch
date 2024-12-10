'use client'
import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import LoginModal from "@/components/LoginModal";


export default function RoleManager() {
    const { currentUser, roleManager } = useAuth()
    const [userId, setUserId] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAssignRole = async () => {
        setLoading(true);
        try {
            await roleManager(userId, role);
        } catch (err: any) { console.log(err.message) }finally {
            setLoading(false);
        }
    };


    if (!currentUser) {
        return <LoginModal />
    }
    return (
        <div className="role-manager">
            <h3>Assign Role</h3>
            <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <input
                type="text"
                placeholder="Role (e.g., admin, editor)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            />
            <button onClick={handleAssignRole} disabled={loading}>
                {loading ? "Assigning..." : "Assign Role"}
            </button>
        </div>
    );
}
