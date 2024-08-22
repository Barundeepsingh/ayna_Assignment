import { Button, Space } from "antd";
import React, {useEffect} from "react";
import { CgWebsite } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { removeToken } from "../../helpers";
import CustomIcon from "../../assets/customIcon";

const AppHeader = () => {
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/session", { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    removeToken();
    setUser(null); // Update the user state to null
//    console.log("User after logout:", user); // Debugging log
    navigate("/", { replace: true });
  };

  return (
    <Space className="header_space">
      <Button className="header_space_brand" href="/" type="link">
        <CustomIcon size={65}/>
      </Button>
      <Space className="auth_buttons">
        {user ? (
          <>
            <Button className="auth_button_login" type="link">
              {user.username}
            </Button>

            <Button className="auth_button_signUp"
              type="primary">
              <a href="/session">Chat Session</a>
            </Button>

            <Button
              className="auth_button_signUp"
              type="primary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button className="auth_button_login" href="/" type="link">
              Login
            </Button>
            <Button
              className="auth_button_signUp"
              href="/signup"
              type="primary"
            >
              SignUp
            </Button>
          </>
        )}
      </Space>
    </Space>
  );
};

export default AppHeader;
