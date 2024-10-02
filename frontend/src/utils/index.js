import { createThirdwebClient } from "thirdweb";
import { Contract } from "ethers";

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

export const thirdwebClient = createThirdwebClient({ clientId });

const contractABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function mint(address _receiver, uint256 _amount)",
  "function bridgeRequest(uint256 _amount)"
];
const contractAddress = "0x";
export const contract = new Contract(contractAddress, contractABI);