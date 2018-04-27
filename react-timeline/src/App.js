import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Search from './Search'; // Import a component from another file

const App = () => (
  <Router>
    <div>
      {/* <ul>
        <li>
          <Link to="/">Search</Link>
        </li>
        <li>
          <Link to="/artists">Artists</Link>
        </li>
      </ul>

      <hr /> */}
      <Route exact path="/" component={Search} />
      <Route path="/artists" component={Artists} />
    </div>
  </Router>
);

const Artists = ({ match }) => (
  <div>
    <h2>Artists</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:artistId`} component={Topic} />
    <Route
      exact
      path={match.url}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.artistId}</h3>
  </div>
);

export default App;
