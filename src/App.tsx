import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { restoreAuth } from "./store/authSlice";
import Login from "./components/login/Login";
import { Dashboard } from "./components/dashboard/Dashboard";

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  return isAuthenticated ? <Dashboard /> : <Login />;
}

export default App;
