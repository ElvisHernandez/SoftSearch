import React from 'react';
import logo from '../../assets/images/logo.png'

const Navigation = ({ isSignedIn }) => {
  return (
    <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3">
      <h5 className="my-0 mr-md-auto font-weight-normal">kdpmfss Logo</h5>
      <img src={logo} alt="#" className="logo-img" />
      <nav id="navlinks" className="my-2 my-md-0 mr-md-4">
        <a className="p-2 text-white" href="/employers/jobs/new">Post a Job</a>
        <a className="p-2 text-white px-4" href="/map?location=GET_ALL">Find Jobs</a>
        <a className="p-2 text-white" href="#">Post a Job</a>
      </nav>
      {isSignedIn ? 
        (<a id="login" className="btn btn-outline-primary mr-3" href='/users/sign_out'>Logout</a>) :
        <>
        <a id="login" className="btn btn-outline-primary mr-3" href='/users/sign_in'>Login</a>
        <a id="signup" className="btn btn-primary" href='/users/sign_up'>Sign up</a>
        </>
      }  
    </div>
  );
};


export default Navigation;