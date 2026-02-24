import { Outlet,  } from "react-router-dom";
import {
  AuthLayoutWrapper,
  FormContainer,
  FormContent,
  HeroContainer,
  HeroImage,
} from "./AuthLayout.styles";

const AuthLayout = () => {

  return (
    <AuthLayoutWrapper>
      <FormContainer>
        <FormContent>
          <Outlet />
        </FormContent>
      </FormContainer>
      <HeroContainer>
        <HeroImage alt="Productivity workspace" />
        
      </HeroContainer>
    </AuthLayoutWrapper>
  );
};

export default AuthLayout;
