import "./Home.css";



const AdminHome = ({ user }) => {
  

  return (
    <div className="home-container">
      <h1>Hello, {user?.name} 👋</h1>
    </div>
  );
};

export default AdminHome;
