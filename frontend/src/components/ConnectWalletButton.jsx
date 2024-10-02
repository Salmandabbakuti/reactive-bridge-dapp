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
          [sepolia.id]: "0xe28662463DF1baAb6590AfC7E7deE1A4dEA77f4d", // token address to display balance for
          [polygon.id]: "0x2a0c0073Ee8D651234E1be7Cd7Fb408f9B696cBA" // token address to display balance for
        }
      }}
      supportedTokens={{
        [polygon.id]: [
          {
            address: "0x2a0c0073Ee8D651234E1be7Cd7Fb408f9B696cBA",
            name: "CrossToken",
            symbol: "XT",
            icon: "https://example.com/icon.png"
          }
        ],
        [sepolia.id]: [
          {
            address: "0xe28662463DF1baAb6590AfC7E7deE1A4dEA77f4d",
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
