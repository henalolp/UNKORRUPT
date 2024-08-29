import React from "react";
import "./profilepage.css";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBListGroup,
  MDBListGroupItem,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
  MDBIcon,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import Layout from "../components/Layout";
import withAuth from "../lib/withAuth";

const ProfilePage = () => {
  return (
    <div className="profile-container">
      <Layout />
      <MDBContainer className="container py-5 h-100 ">
      <MDBRow className="justify-content-center align-items-center h-100">
        <MDBCol md="12" xl="4">
          <MDBCard style={{ borderRadius: "15px" }}>
            <MDBCardBody className="text-center">
              <div className="mt-3 mb-4">
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                  className="rounded-circle justify-center"
                  fluid
                  style={{ width: "100px" }}
                />
              </div>
              <MDBTypography tag="h4">Julie L. Arsenault</MDBTypography>
              <MDBCardText className="text-muted mb-4">
                @Researcher <span className="mx-2">|</span>{" "}
                <a href="#!">policy track</a>
              </MDBCardText>
              <div className="mb-4 pb-2">
                <MDBBtn outline floating>
                  <MDBIcon fab icon="facebook" size="lg" />
                </MDBBtn>
                <MDBBtn outline floating className="mx-1">
                  <MDBIcon fab icon="twitter" size="lg" />
                </MDBBtn>
                <MDBBtn outline floating>
                  <MDBIcon fab icon="skype" size="lg" />
                </MDBBtn>
              </div>

              <MDBListGroup style={{ minWidth: "10rem" }} light>
                <MDBListGroupItem
                  tag="a"
                  href="#"
                  action
                  noBorders
                  active
                  aria-current="true"
                  className="px-3"
                >
                  Edit Profile
                </MDBListGroupItem>
                <MDBListGroupItem
                  tag="a"
                  href="#"
                  action
                  noBorders
                  className="px-3"
                >
                  <i className="icon icon-settings"></i> Settings
                </MDBListGroupItem>
                <MDBListGroupItem
                  tag="a"
                  href="#"
                  action
                  noBorders
                  className="px-3"
                >
                  <i className="icon icon-settings"></i> Invite a friend
                </MDBListGroupItem>
                <MDBListGroupItem
                  tag="a"
                  href="#"
                  action
                  noBorders
                  className="px-3"
                >
                  <i className="icon icon-settings"></i> Help
                </MDBListGroupItem>
              
              </MDBListGroup>
              <MDBBtn rounded size="lg">
                Message now
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
     
    </div>
  );
};

const Page = withAuth(ProfilePage);
export default Page;
