import React, { useState } from "react";
import { forgetPassword } from "../../api/auth";
import { useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";

// Component for handling the "Forget Password" functionality
export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const { updateNotification } = useNotification();

  // Handle input change for the email field
  const handleChange = ({ target }) => {
    const { value } = target;
    setEmail(value);
  };

  // Handle form submission for sending a password reset link
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate the email format
    if (!isValidEmail(email))
      return updateNotification("error", "Invalid email!");

    // Call the API to send the password reset link
    const { error, message } = await forgetPassword(email);
    if (error) return updateNotification("error", error);

    // Notify the user of successful link sending
    updateNotification("success", message);
  };

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-96"}>
          <Title>Please Enter Your Email</Title>
          <FormInput
            onChange={handleChange}
            value={email}
            label="Email"
            placeholder="john@email.com"
            name="email"
          />
          <Submit value="Send Link" />

          <div className="flex justify-between">
            <CustomLink to="/auth/signin">Sign in</CustomLink>
            <CustomLink to="/auth/signup">Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
