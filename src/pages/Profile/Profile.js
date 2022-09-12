import { useState } from "react";
import styled from "styled-components";

import api from "../../utils/api";
import getJwtToken from "../../utils/getJwtToken";

import { NavLink, Outlet } from "react-router-dom";

const Wrapper = styled.div`
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.div`
  padding-bottom: 16px;
  border-bottom: 1px solid #979797;
  font-size: 24px;
  font-weight: bold;
`;

const Photo = styled.img`
  margin-top: 24px;
`;

const Content = styled.div`
  margin-top: 24px;
`;

const LogoutButton = styled.button`
  margin-top: 24px;
`;

const PageSwitcher = styled.div`
  position: relative;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background: linear-gradient(
    to ${(props) => (props.isSignIn ? "right" : "left")},
    rgb(211, 225, 241) 0%,
    rgb(211, 225, 241) 50%,
    white 50%,
    white 100%
  );
  width: 240px;
  height: 30px;
  border-radius: 10px;
  border: solid 1px black;

  &:after {
    content: "";
    position: absolute;
    z-index: 10;
    top: 0;
    bottom: 0;
    left: 50%;
    border-left: 1px solid #000000;
    transform: translate(-50%);
  }
`;

export const signIn = (Provider, Email, Password) => {
  let body = {
    provider: Provider,
    email: Email,
    password: Password
  };

  api.signin(body).then((response) => {
    if (response.error) {
      window.alert(response.error);
    } else if (response.data) {
      window.localStorage.setItem("jwtToken", response.data.access_token);
    }
  });
};

export const signUp = (Name, Email, Password) => {
  let body = {
    name: Name,
    email: Email,
    password: Password
  };

  api.signUp(body).then((response) => {
    if (response.error) {
      window.alert(response.error);
    } else if (response.data) {
      window.localStorage.setItem("jwtToken", response.data.access_token);
    }
  });
};

export const Profile = () => {
  const [profile, setProfile] = useState();
  const [signMode, setSignMode] = useState("sign-in");

  async function getProfile() {
    let jwtToken = window.localStorage.getItem("jwtToken");

    if (!jwtToken) {
      try {
        jwtToken = await getJwtToken();
      } catch (e) {
        window.alert(e.message);
        return;
      }
    }
    window.localStorage.setItem("jwtToken", jwtToken);
    const { data } = await api.getProfile(jwtToken);
    setProfile(data);
  }
  getProfile();

  return (
    <Wrapper>
      {!profile && (
        <>
          <PageSwitcher
            isSignIn={signMode === "sign-in"}
            className="pageSwitcher"
          >
            <NavLink
              end
              to="/profile/sign-in"
              className="sign-in-link"
              onClick={() => {
                setSignMode("sign-in");
              }}
            >
              Sign In
            </NavLink>
            <NavLink
              end
              to="/profile/sign-up"
              className="sign-up-link"
              onClick={() => {
                setSignMode("sign-up");
              }}
            >
              Sign Up
            </NavLink>
          </PageSwitcher>
          <Outlet />
        </>
      )}
      {profile && <Title>會員基本資訊</Title>}
      {profile && (
        <>
          <Photo src={profile.picture} />
          <Content>{profile.name}</Content>
          <Content>{profile.email}</Content>
          <LogoutButton
            onClick={() => {
              window.localStorage.removeItem("jwtToken");
              setTimeout(() => {
                setProfile();
              }, 2500);
            }}
          >
            登出
          </LogoutButton>
        </>
      )}
    </Wrapper>
  );
};

export default Profile;
