import styled from "styled-components";
import FlexContainer from "./FlexContainer.js";
import NFT from "./NFT.js";

const Container = styled(FlexContainer)`
  width: 1000px;
  margin: 0 auto;
  margin-top: 50px;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: flex-start;
`;

const NFTContainer = (props) => {
  const { data, edit } = props;

  return (
    <Container>
      {data &&
        data.map((data, index) => {
          const { name, description, url, tid } = data;
          return (
            <div key={index}>
              <NFT
                name={name}
                image={url}
                description={description}
                price={"1.0"}
                edit={edit}
                tid={tid}
              ></NFT>
            </div>
          );
        })}
    </Container>
  );
};

export default NFTContainer;
