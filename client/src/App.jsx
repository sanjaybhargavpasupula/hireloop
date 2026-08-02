import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "./components/login/login";
import Register from "./components/register/register";
import ProtectedRoute from "./components/protectedroute/protectedroute";
import Dashboard from "./components/dashboard/dashboard";
import Problems from "./components/problems/problems";
import Applications from "./components/applications/applications";
import NotFound from "./components/notfound/notfound";

const App = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <ProtectedRoute exact path="/dashboard" component={Dashboard} />
      <ProtectedRoute exact path="/problems" component={Problems} />
      <ProtectedRoute exact path="/applications" component={Applications} />
      <Route path="/not-found" component={NotFound} />
      <Redirect to="/login" />
    </Switch>
  </HashRouter>
);
export default App;