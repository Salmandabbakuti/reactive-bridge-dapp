import { ConnectButton } from "thirdweb/react";
import { sepolia, polygon } from "thirdweb/chains";
import { createWallet } from "thirdweb/wallets";
import { thirdwebClient } from "../utils";

const thirdwebWallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("com.trustwallet.app"),
  createWallet("walletConnect"),
  createWallet("org.uniswap")
];

export default function ConnectWalletButton() {
  return (
    <ConnectButton
      client={thirdwebClient}
      // chain={polygon} // default chain to connect
      chains={[polygon, sepolia]} // chains to connect
      wallets={thirdwebWallets}
      recommendedWallets={[
        thirdwebWallets[0],
        thirdwebWallets[1],
        thirdwebWallets[5]
      ]}
      autoConnect={true}
      connectModal={{
        size: "wide",
        title: "Connect",
        termsOfServiceUrl: "https://example.com/terms",
        privacyPolicyUrl: "https://example.com/privacy"
      }}
      connectButton={{
        label: "Connect Wallet",
        style: {
          borderRadius: "15px"
        }
      }}
      detailsButton={{
        displayBalanceToken: {
          [sepolia.id]: "0x3Eed33DCf10eA9543380E71b9E245dca16c30605", // token address to display balance for
          [polygon.id]: "0xd231fE46b4A8500d4aDD5AD98EC3c4ca56E7dee4" // token address to display balance for
        }
      }}
      supportedTokens={{
        [polygon.id]: [
          {
            address: "0xd231fE46b4A8500d4aDD5AD98EC3c4ca56E7dee4",
            name: "CrossToken",
            symbol: "XT",
            icon: "https://example.com/icon.png"
          }
        ],
        [sepolia.id]: [
          {
            address: "0x3Eed33DCf10eA9543380E71b9E245dca16c30605",
            name: "CrossToken",
            symbol: "XT",
            icon: "https://example.com/icon.png"
          }
        ]
      }}
      appMetadata={{
        name: "Reactive Bridge",
        description: "Reactive Bridge",
        url: "https://example.com",
        logoUrl: "https://example.com/logo.png"
      }}
      theme={"light"} // light | dark
    />
  );
}
