import React from 'react'
import Header from '../components/Header'
import SignupSigninComponent from '../components/SignUpSignIn';

function SignUp() {
  return (
    <div>
      <Header/>
      <div className='wrapper'>
        <SignupSigninComponent/>
      </div>
    </div>
  )
}

export default SignUp
