import { useDispatch, useSelector } from "react-redux";
import { Switch, useHistory } from "react-router-dom";
import { ProtectedRoute } from "../Routes/Routes";
import { clearSessionErrors, editUser, login } from "../../store/session";
import { useEffect, useState } from "react";

import "./Profile.css";
import "./ProfileBadge.css";
import { leaveChat } from "../../store/chats";

function Profile({ theme, setTheme, socket }) {
  const user = useSelector((state) => state.session.user);
  const chatId = useSelector((state) => state.chats?.chatId);
  const errors = useSelector((state) => state.errors.session);

  const [username, setUsername] = useState(user ? user.username : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [password, setPassword] = useState("");
  const [openEdit, setOpenEdit] = useState("none");

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit("chat-leave", { userId: user.username, chatroomId: chatId });
    dispatch(leaveChat());
  }, []);

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const handleOnSubmitEdit = (e) => {
    if (password.length === 0) {
      setOpenEdit("none");
    } else {
      dispatch(clearSessionErrors());
      let email = user.email;
      setPassword("");
      e.preventDefault();
      dispatch(login({ email, password })).then((res) => {
        if (res.type === "session/RECEIVE_CURRENT_USER") {
          dispatch(
            editUser({
              currentUser: {
                _id: user._id,
                username,
                email,
              },
              editUser: {
                _id: user._id,
                username,
                email,
              },
            })
          );
          setOpenEdit("none");
        }
      });
    }
  };

  return (
    <Switch>
      <ProtectedRoute exact path="/profile">
        <div className="main-profile" data-theme={theme}>
          <div className="profile-div">
            <div className="user-info">
              <h2>Profile</h2>
              <label>{errors?.email}</label>
              <label>{errors?.password}</label>
              <div className="profile-username">
                <div className="badge-profile username">Username</div>
                <span
                  id="username"
                  style={{ display: openEdit === "none" ? "block" : "none" }}
                >
                  {user.username}
                </span>
                <input
                  className="profile-edit-input"
                  style={{ display: openEdit === "none" ? "none" : "block" }}
                  type="text"
                  value={username}
                  placeholder="username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="profile-email">
                <div className="badge-profile email">Email</div>
                <span
                  id="email"
                  style={{ display: openEdit === "none" ? "block" : "none" }}
                >
                  {user.email}
                </span>
                <input
                  className="profile-edit-input"
                  id="disabled"
                  style={{ display: openEdit === "none" ? "none" : "block" }}
                  type="email"
                  value={email}
                  placeholder="email"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                />
              </div>
              <div className="profile-password">
                <div className="badge-profile email">Password</div>
                <span
                  id="email"
                  style={{ display: openEdit === "none" ? "block" : "none" }}
                >
                  ●●●●●●●●
                </span>
                <input
                  className="profile-edit-input"
                  style={{ display: openEdit === "none" ? "none" : "block" }}
                  type="password"
                  value={password}
                  placeholder="passsword"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div
                className="edit-button"
                id="right"
                style={{ display: openEdit === "none" ? "none" : "block" }}
                onClick={handleOnSubmitEdit}
              >
                Confirm
              </div>
              {openEdit === "none" && (
                <div className="edit-div">
                  <div
                    className="edit-button"
                    onClick={(e) => {
                      dispatch(clearSessionErrors());
                      openEdit === "none"
                        ? setOpenEdit("flex")
                        : setOpenEdit("none");
                    }}
                  >
                    Edit
                  </div>
                </div>
              )}
            </div>
            <button className="switch-theme-button" onClick={switchTheme}>
              {theme === "light" ? "Dark" : "Light"} Theme
            </button>
          </div>
        </div>
      </ProtectedRoute>
    </Switch>
  );
}

export default Profile;
