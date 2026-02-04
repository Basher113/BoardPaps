import { Outlet,  } from "react-router-dom";
import {
  AuthLayoutWrapper,
  FormContainer,
  FormContent,
  HeroContainer,
  HeroImage,
} from "./AuthLayout.styles";
import heroImage from "../../assets/images/hero-auth.webp";

const AuthLayout = () => {

  return (
    <AuthLayoutWrapper>
      <FormContainer>
        <FormContent>
          <Outlet />
        </FormContent>
      </FormContainer>
      <HeroContainer>
        <HeroImage src={heroImage} alt="Productivity workspace" />
        
      </HeroContainer>
    </AuthLayoutWrapper>
  );
};

export default AuthLayout;
