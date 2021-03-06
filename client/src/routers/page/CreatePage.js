import styled from "styled-components";
import { useSelector } from "react-redux";
import { create } from "ipfs-http-client";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";

import UploadDescription from "../../components/create/UploadDescription";
import UploadImg from "../../components/create/UploadImg";
import UploadName from "../../components/create/UploadName";

import UploadAttributes from "../../components/create/UploadAttribues";
import api from "../../web3/web3";
import Footbar from "../../components/common/Footbar";

// 각 컴포넌트 안에서 받아온 데이터를 redux 로 상태저장하고 그걸 보내줌.

const Container = styled.section`
  font-size: 14.5px;
  color: rgb(53, 56, 64);
  box-sizing: border-box;
  width: 100%;
  height: 2000px; //나중에 수정해줘야해
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  h1 {
    margin-bottom: 16px;
    font-weight: 800;
    font-size: 40px;
    letter-spacing: 0px;
    color: rgb(4, 17, 29);
  }
  p {
    font-weight: 500;
    font-size: 12px;
    color: rgb(112, 122, 131);
    span {
      color: red;
    }
  }
`;

const CreateButton = styled(Button)`
  width: 200px;
  height: 50px;
  border-radius: 20px;
`;
const Hash_Query = gql`
  mutation CreatePage($hash: String!) {
    cacheNFT(txhash: $hash) {
      ok {
        url
      }
      error
    }
  }
`;

const CreatePage = () => {
  //월렛 연결
  const [account, setAccount] = useState();

  const connectwallet = async () => {
    try {
      const wallet = await api.connectWallet();
      return wallet.account;
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    connectwallet()
      .then(setAccount)
      .catch((err) => console.log(err));
  }, []);

  const nftData = useSelector((state) => state.createNFT);
  console.log(nftData);
  //ipfs -> 이미지 전송
  const ipfsTransferImage = async () => {
    const { image } = nftData;

    const client = create("https://ipfs.infura.io:5001/api/v0");
    try {
      const created = await client.add(image.buffer);
      // console.log(created);
      const cid = created.cid._baseCache.get("z");
      console.log(`imagecid`);
      await ipfsTransferMetaData(cid);
      console.log("ipfs 이미지전송 성공");
    } catch (error) {
      console.log(error.message);
    }
  };

  // ipfs-> 메타데이터 전송
  const ipfsTransferMetaData = async (cid) => {
    const { name, description, attributes, image } = nftData;
    let { type } = image;
    type = type.split("/");
    const cext = type[type.length - 1];
    console.log(`image type = ${cext}`);
    const metaData = {
      ctype: "ipfs",
      cid,
      cext,
      name,
      description,
      attributes,
    };
    console.log(`metaData = ${metaData}`);
    try {
      const client = create("https://ipfs.infura.io:5001/api/v0");
      const created = await client.add(JSON.stringify(metaData));
      console.log(`cid = ${JSON.stringify(created.cid._baseCache.get("z"))}`);
      const cid = created.cid._baseCache.get("z");
      await sendTransaction(cid);
      console.log("metaData ipfs 성공");
    } catch (err) {
      console.log(err);
    }
  };

  // blockchain -> nft 발행
  // Server -> 트랜잭션 발행
  const [getData, { loading, error, data }] = useMutation(Hash_Query);
  const sendTransaction = async (metaCid) => {
    try {
      const result = await api.mintNFT(metaCid);

      const hash = result.transactionHash.slice(2);
      console.log(`transactionHash = ${hash}`);
      window.alert("민팅 완료!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Container>
        <h1>Create New Item</h1>
        <p>
          <span>*</span> Required fields
        </p>
        <UploadImg />
        <UploadName />
        <UploadDescription />
        <UploadAttributes />
        <CreateButton variant="contained" onClick={ipfsTransferImage}>
          Create
        </CreateButton>
      </Container>
      <Footbar />
    </>
  );
};

export default CreatePage;
