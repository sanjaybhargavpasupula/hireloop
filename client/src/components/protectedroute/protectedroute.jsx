import { Route, Redirect } from "react-router-dom"
import Cookies from "js-cookie"

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const token = Cookies.get("jwt_token")
      if (token !== undefined) {
        return <Component {...props} />
      } else {
        return <Redirect to="/login" />
      }
    }}
  />
)

export default ProtectedRoute