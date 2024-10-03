import { createThirdwebClient, getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

export const thirdwebClient = createThirdwebClient({ clientId });

export const contract = getContract({
  chain: polygon,
  client: thirdwebClient,
  address: "0xd231fE46b4A8500d4aDD5AD98EC3c4ca56E7dee4"
});