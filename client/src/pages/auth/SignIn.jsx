import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <SignIn 
        routing="path"
        path="/auth/sign-in"
        signUpUrl="/auth/sign-up"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
};

export default SignInPage;
