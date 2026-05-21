import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";

const useUserRole = () => {
  const { user, loading } = useContext(AuthContext); // Firebase user
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    // যদি Firebase user আছে
    if (user?.email) {
      setRoleLoading(true);

      // Backend থেকে role fetch
      fetch(`https://exam-hero-server-main.vercel.app/users/email/${user.email}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch role");
          return res.json();
        })
        .then((data) => {
          // backend থেকে role set করা, যদি role না থাকে → default "user"
          setRole(data?.role || "user");
          setRoleLoading(false);
        })
        .catch((err) => {
          console.error("❌ Error fetching user role:", err);
          setRole("user");
          setRoleLoading(false);
        });
    } else {
      // যদি user logged out থাকে
      setRole(null);
      setRoleLoading(false);
    }
  }, [user?.email]);

  return { role, roleLoading };
};

export default useUserRole;
