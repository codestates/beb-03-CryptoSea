import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import MainPage from "../routers/page/MainPage.js";
import CreatePage from "../routers/page/CreatePage.js";
import MyAccount from "../routers/page/MyAccount.js";
import Navbar from "./Navbar.js";
import checkRopsten from "../Controller/checkRopsten";
import RenderSearch from "../routers/page/RenderSearch";

function App() {
  useEffect(() => {
    checkRopsten();
  }, []);

  useEffect(() => {
    search();
  }, [searchItem]);

  const getNFT = gql`
    query getNFTs($where: [PartialNFTInput!]!) {
      getNFTs(where: $where) {
        ok {
          tid
          name
          description
          url
        }
        error
      }
    }
  `;

  const [search, { called, loading, data }] = useLazyQuery(getNFT, {
    variables: {
      where: [
        { name: searchItem },
        { description: searchItem },
        { attributes: [{ akey: searchItem }] },
        { attributes: [{ avalue: searchItem }] },
      ],
    },
  });

  const [isSearch, setIsSearch] = useState(false);
  const [searchItem, setSearchItem] = useState("");

  return (
    <>
      <Navbar setIsSearch={setIsSearch} setSearchItem={setSearchItem} />
      {/* isSearch 가 true 어떤 컴포넌트를 랜더링해줘야함. */}
      {isSearch ? (
        <RenderSearch data={data} />
      ) : (
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/myAccounts" element={<MyAccount />} />
        </Routes>
      )}
    </>
  );
}

export default App;
