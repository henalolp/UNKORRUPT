import React, { useEffect, useState } from "react";
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
import { useAuthClient } from "../use-auth-client";
import { createLedgerCanister } from "../helper/ledger";
import { Spinner, useToast } from "@chakra-ui/react";
import { IcrcMetadataResponseEntries } from "@dfinity/ledger-icrc";

const ProfilePage = () => {
  const [tokens, setTokens] = useState("-");
  const toast = useToast();

  const { identity } = useAuthClient();

  useEffect(() => {
    async function getTokens() {
      const ledger = await createLedgerCanister();
      const metadata = await ledger.metadata({});
      if (!metadata) {
        toast({
          title: "Can't find metadata",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
      let symbol = "";
      for (const value of metadata) {
        if (value[0] === IcrcMetadataResponseEntries.SYMBOL) {
          symbol = value[1].Text;
          break;
        }
      }
      let decimals = 0;
      for (const value of metadata) {
        if (value[0] === IcrcMetadataResponseEntries.DECIMALS) {
          decimals = parseInt(value[1].Nat);
          break;
        }
      }
      const balance =
        Number(
          await ledger.balance({
            owner: identity.getPrincipal(),
          })
        ) /
        10 ** decimals;
      setTokens(`${balance} ${symbol}`);
    }
    if (identity?.getPrincipal()) getTokens();
  }, [identity]);

  return (
    <div className="containerf">
      <Layout />
      <MDBContainer className="container py-5 h-100 ">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol md="12" xl="4">
            <MDBCard style={{ borderRadius: "15px" }}>
              <MDBCardBody className="text-center">
                <div
                  className="mt-3 mb-4"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <MDBCardImage
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                    className="rounded-circle justify-center"
                    fluid
                    style={{ width: "100px" }}
                  />
                </div>
                <MDBTypography
                  style={{
                    color: "#000",
                  }}
                  tag="h6"
                >
                  Your Principal ID
                </MDBTypography>
                <MDBCardText className="text-muted mb-4">
                  {identity?.getPrincipal().toString()}
                </MDBCardText>
                <MDBTypography
                  style={{
                    color: "#000",
                  }}
                  tag="h6"
                >
                  Your Tokens
                </MDBTypography>
                <MDBCardText className="text-muted mb-4">
                  {tokens === "-" ? <Spinner /> : <>{tokens}</>}
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

                <MDBListGroup
                  style={{ minWidth: "10rem", display: "none" }}
                  light
                >
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
