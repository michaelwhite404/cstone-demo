import { EmployeeModel } from "../../../../src/types/models/employeeTypes";
import Login from "../../components/Login";
import { useDocTitle } from "../../hooks";

export default function Home({
  setIsAuthenticated,
  setUser,
}: {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<EmployeeModel | null>>;
}) {
  useDocTitle("Login Page | Cornerstone App");
  return (
    <div>
      <div
        style={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          backgroundImage: "url(education-icon-background.png)",
          backgroundSize: "200px 200px",
        }}
      >
        <div
          style={{
            width: "30%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <img
            src="Cornerstone-Logo.png"
            alt="Cornerstone Logo"
            style={{ position: "absolute", top: 50, width: "100px" }}
          />
          <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
        </div>
        <div style={{ width: "70%", height: "100%", padding: "15px" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "15px",
              background:
                "linear-gradient(251deg, rgba(23, 48, 204, 0.76), rgba(25, 104, 177, 0.91)), url(login-image.jpeg)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
