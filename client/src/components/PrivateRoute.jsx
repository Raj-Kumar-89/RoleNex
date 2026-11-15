import { Navigate } from "react-router-dom";

function PrivateRoute({ children, tokenKey }) {
  const token = localStorage.getItem(tokenKey);
  return token ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;