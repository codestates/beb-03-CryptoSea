import styled from "styled-components";
import { useState } from "react";
import { Button } from "@mui/material";
import { incrementAttributes } from "../../redux/createNFT/nftSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import CreateContaier from "../common/CreateContainer";
import FlexContainer from "../common/FlexContainer";
import StyledInput from "../common/StyledInput";

const UploadAttributes = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [formCount, setFormCount] = useState([1]);
  const attributes = useSelector((state) => state.createNFT.attributes);
  const plusCount = () => {
    setFormCount([...formCount, [1]]);
  };
  const plusAttributes = (data) => {
    console.log(data);
  };
  return (
    <CreateContaier>
      <h3>Attributes</h3>
      <p>Add a property to your nft.</p>
      {attributes.map((value, index) => {
        return (
          <div key={index}>
            <FlexContainer>
              <StyledInput
                placeholder="Type"
                onChange={(e) =>
                  dispatch(
                    incrementAttributes({ atype: e.target.value, index })
                  )
                }
              />
              <StyledInput
                placeholder="Key"
                onChange={(e) =>
                  dispatch(incrementAttributes({ akey: e.target.value, index }))
                }
              />
              <StyledInput
                placeholder="Value"
                onChange={(e) =>
                  dispatch(
                    incrementAttributes({ avalue: e.target.value, index })
                  )
                }
              />
            </FlexContainer>
          </div>
        );
      })}

      <Button onClick={() => dispatch(incrementAttributes("plus"))}>
        AddMore
      </Button>
    </CreateContaier>
  );
};

export default UploadAttributes;