import { createThirdwebClient, getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

export const thirdwebClient = createThirdwebClient({ clientId });

export const contract = getContract({
  chain: polygon,
  client: thirdwebClient,
  address: "0x2a0c0073Ee8D651234E1be7Cd7Fb408f9B696cBA"
});