import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <SignUp 
        routing="path"
        path="/auth/sign-up"
        signInUrl="/auth/sign-in"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
};

export default SignUpPage;
