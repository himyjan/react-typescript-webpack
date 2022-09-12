import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signUp } from "./Profile";
import { useNavigate } from "react-router-dom";

const FormLegend = styled.legend`
  line-height: 19px;
  font-size: 16px;
  font-weight: bold;
  color: #3f3a3a;
  padding-bottom: 16px;
  border-bottom: 1px solid #3f3a3a;
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 30px;
  width: 684px;

  ${FormLegend} + & {
    margin-top: 20px;
  }
`;

const FormControl = styled.input`
  width: 240px;
  height: 30px;
  border-radius: 8px;
  border: solid 1px #979797;
  margin-left: auto;
  margin-right: auto;
`;

const CheckoutButton = styled.button`
  width: 240px;
  height: 30px;
  margin-top: 20px;
  border: solid 1px #979797;
  background-color: rgb(211, 225, 241);
  border-radius: 10px;
  color: black;
  font-size: 16px;
  letter-spacing: 4px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  cursor: pointer;
`;

const formInputs = [
  {
    label: "Name",
    key: "name",
    error: "此欄位必填"
  },
  { label: "Email", key: "email", error: "請輸入正確的email格式" },
  { label: "Password", key: "password", error: "此欄位必填" }
];

const SignUpForm = () => {
  const [recipient, setRecipient] = useState({
    name: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const schema = yup
    .object()
    .shape({
      name: yup
        .string()
        .required("此欄位必填")
        .min(1, { message: "此欄位必填" }),
      email: yup
        .string()
        .required("此欄位必填")
        .matches(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
        .min(1, { message: "此欄位必填" }),
      password: yup
        .string()
        .required("此欄位必填")
        .min(1, { message: "此欄位必填" })
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
    resolver: yupResolver(schema)
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        signUp(data.name, data.email, data.password);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })}
    >
      {formInputs.map((input) => (
        <FormGroup key={input.key}>
          <FormControl
            {...register(`${input.key}`)}
            id={input.key}
            value={recipient[input.key]}
            placeholder={input.label}
            onChange={(e) =>
              setRecipient({ ...recipient, [input.key]: e.target.value })
            }
          />
          {errors[input.key] && input.error}
        </FormGroup>
      ))}
      <CheckoutButton type="submit">Sign up</CheckoutButton>
    </form>
  );
};

export default SignUpForm;
