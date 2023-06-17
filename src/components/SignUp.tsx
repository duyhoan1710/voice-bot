import { useState } from "react";
import { signUpFields } from "../constants/formFields";
import FormAction from "./FormAction";
import Input from "../commons/Input";
import { useMutation } from "react-query";
import { signUp } from "../api/auth";
import { useNavigate } from "react-router-dom";

const fields = signUpFields;
let fieldsState: any = {};

fields.forEach((field) => (fieldsState[field.id] = ""));

export default function SignUp() {
  const navigate = useNavigate();

  const [signUpState, setSignUpState] = useState(fieldsState);

  const handleChange = (e) =>
    setSignUpState({ ...signUpState, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(signUpState);
    createAccount();
  };

  const { mutate: createAccount } = useMutation(
    async () => {
      const res = await signUp(signUpState);
      return res;
    },
    {
      onSuccess: () => {
        navigate("/sign-in");
      },
    }
  );

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="">
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={signUpState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
        <FormAction handleSubmit={handleSubmit} text="SignUp" />
      </div>
    </form>
  );
}
