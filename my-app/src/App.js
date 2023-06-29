import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/LoginForm/Login';
import Register from './components/Register/Register';
import Students from './components/Students/Students'

const App = () => {
  return (
    <Router>
      <div className="App">
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/students" component={Students} />
      </div>
    </Router>
  );
};

export default App;