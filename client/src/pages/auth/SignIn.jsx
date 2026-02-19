import { SignIn } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";

const SignInPage = () => {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <SignIn 
        routing="path"
        path="/auth/sign-in"
        signUpUrl="/auth/sign-up"
        forceRedirectUrl={redirectUrl || "/dashboard"}
      />
    </div>
  );
};

export default SignInPage;
