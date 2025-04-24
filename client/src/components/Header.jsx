import { useNavigate } from "react-router-dom";
import { Container } from "./Utils";
import logo from "../assets/serrala-logo-ruby.svg";
const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Remove token from localStorage
    sessionStorage.removeItem("token");

    // Redirect to login page
    navigate("/login");
  };
  return (
    <header className="bg-transparent py-5">
      <Container>
        <div className="flex items-center justify-between">
          <img src={logo} alt="Serrala logo" className="w-[80px] md:w-[95px]" />

          <button
            onClick={handleLogout}
            type="button"
            className="text-primary font-medium text-base cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </Container>
    </header>
  );
};
export default Header;
