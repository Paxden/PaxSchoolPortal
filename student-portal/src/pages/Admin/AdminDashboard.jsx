import { Outlet, Link } from "react-router-dom";
import AdminNavbar from "../Admin/AdminNavbar";

const AdminDashboard = () => {
  return (
    <>
      <AdminNavbar />
      <Outlet />
    </>
  );
};

export default AdminDashboard;
