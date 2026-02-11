import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../reducers/slices/user/user.slice";
import Button from "../../components/ui/button/Button";
import { Logo } from "../../components/ui/logo/Logo";
import {
  SignInWrapper,
  LogoContainer,
  Title,
  Subtitle,
  Form,
  FormGroup,
  Label,
  Input,
  ErrorMessage,
  SubmitButton,
  FooterText,
  FooterLink,
} from "./SignIn.styles";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await loginUser({ email, password }).unwrap();
      navigate("/");
    } catch (err) {
      setErrors({
        submit: err?.data?.message || "Invalid email or password. Please try again.",
      });
    }
  };

  return (
    <SignInWrapper>
      <LogoContainer>
        <Logo size="lg" />
      </LogoContainer>

      <Title>Welcome back</Title>
      <Subtitle>Enter your credentials to access your account</Subtitle>

      <Form onSubmit={handleSubmit}>
        {errors.submit && <ErrorMessage type="submit">{errors.submit}</ErrorMessage>}

        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            $hasError={!!errors.email}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            $hasError={!!errors.password}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </FormGroup>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </Form>

      <FooterText>
        Don't have an account?{" "}
        <FooterLink to="/auth/sign-up">
          Sign up for BoardPaps
        </FooterLink>
      </FooterText>
    </SignInWrapper>
  );
};

export default SignIn;
