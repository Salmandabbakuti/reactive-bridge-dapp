import { useState } from "react";
import {
  useActiveAccount,
  useActiveWalletChain,
  useWalletBalance,
  useSendAndConfirmTransaction
} from "thirdweb/react";
import {
  Card,
  Select,
  Input,
  Button,
  Typography,
  Divider,
  Space,
  message
} from "antd";
import { SwapOutlined, SettingOutlined } from "@ant-design/icons";
import { thirdwebClient, contract } from "./utils";
import { sepolia, polygon } from "thirdweb/chains";
import { prepareContractCall } from "thirdweb";
import { toWei } from "thirdweb/utils";

const { Option } = Select;
const { Text } = Typography;

export default function App() {
  const [bridgeAmountInput, setBridgeAmountInput] = useState(null);
  const [fromToken, setFromToken] = useState("xt-p");
  const [toToken, setToToken] = useState("xt-s");
  const [log, setLog] = useState({
    message: "",
    type: ""
  });

  const accountObj = useActiveAccount() || {};
  const account = accountObj?.address?.toLowerCase();
  const activeChain = useActiveWalletChain() || {};
  const {
    mutate: sendAndConfirmTx,
    data: transactionReceipt,
    error: txError,
    failureReason: txFailureReason,
    isPending,
    isError,
    isSuccess
  } = useSendAndConfirmTransaction();

  console.log(
    "tx",
    transactionReceipt,
    txError,
    isPending,
    isError,
    isSuccess,
    txFailureReason
  );

  const {
    data: sepoliaXT,
    isLoading: isSepoliaXTLoading,
    isError: isSepoliaXTError
  } = useWalletBalance({
    chain: sepolia,
    address: account,
    client: thirdwebClient,
    tokenAddress: "0x3Eed33DCf10eA9543380E71b9E245dca16c30605"
  });
  console.log(
    "Sepolia XT balance",
    sepoliaXT,
    isSepoliaXTLoading,
    isSepoliaXTError
  );

  const {
    data: polygonXT,
    isLoading: isPolygonXTLoading,
    isError: isPolygonXTError
  } = useWalletBalance({
    chain: polygon,
    address: account,
    client: thirdwebClient,
    tokenAddress: "0xd231fE46b4A8500d4aDD5AD98EC3c4ca56E7dee4"
  });
  console.log(
    "Polygon XT balance",
    polygonXT,
    isPolygonXTLoading,
    isPolygonXTError
  );

  const handleBridgeRequest = () => {
    console.log("Bridge Requested");
    setLog({ message: "", type: "" });
    if (!bridgeAmountInput) {
      return setLog({
        message: "Please enter an amount to bridge",
        type: "warning"
      });
    }
    if (!account) {
      return setLog({
        message: "Please connect your wallet",
        type: "warning"
      });
    }
    if (activeChain?.id !== 137) {
      return setLog({
        message: "Please connect to Polygon Network",
        type: "warning"
      });
    }
    const bridgeAmountInWei = toWei(bridgeAmountInput);
    if (bridgeAmountInWei > polygonXT?.value)
      return setLog({
        message: "Insufficient Balance",
        type: "warning"
      });
    try {
      const tx = prepareContractCall({
        contract,
        method: "function bridgeRequest(uint256 _amount)",
        params: [bridgeAmountInWei]
      });
      sendAndConfirmTx(tx);
    } catch (error) {
      console.error("Bridge Request Error", error);
      setLog({ message: "Bridge Request Failed", type: "danger" });
    }
  };

  const handleMint = () => {
    console.log("Mint Requested");
    setLog({ message: "", type: "" });
    if (!account) {
      return setLog({
        message: "Please connect your wallet",
        type: "warning"
      });
    }
    if (activeChain?.id !== 137) {
      return setLog({
        message: "Please connect to Polygon Network",
        type: "warning"
      });
    }
    const tx = prepareContractCall({
      contract,
      method: "function mint(address _receiver, uint256 _amount)",
      params: [account, toWei("50")]
    });
    sendAndConfirmTx(tx);
  };

  return (
    <Card
      title="Bridge"
      extra={
        <Space>
          {
            // if bridge amount is greater than account balance, show mint button
            toWei(bridgeAmountInput) > polygonXT?.value && (
              <Text type="secondary">
                Not enough XT on Polygon to bridge?{" "}
                <Button
                  title="Mints 50 XT on Polygon for testing"
                  type="link"
                  onClick={handleMint}
                >
                  Mint
                </Button>
              </Text>
            )
          }
          <SettingOutlined />
        </Space>
      }
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: "20px",
        borderRadius: "20px"
      }}
      actions={[
        <Button
          size="large"
          type="primary"
          key="bridge-btn"
          loading={isPending}
          disabled={isPending}
          onClick={handleBridgeRequest}
          block
        >
          Bridge
        </Button>
      ]}
    >
      {/* From Section */}
      <div>
        <Text type="secondary">Send</Text>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Input
            value={bridgeAmountInput}
            type="number"
            onChange={(e) => setBridgeAmountInput(e.target.value)}
            placeholder="0.00"
            variant="borderless"
            style={{ fontSize: "28px", fontWeight: "bold" }}
          />
          <Select
            defaultValue="xt-p"
            value={fromToken}
            style={{ maxWidth: 300 }}
            onChange={setFromToken}
          >
            <Option value="xt-p">XT on Polygon</Option>
            <Option value="xt-s" disabled>
              XT on Sepolia
            </Option>
          </Select>
        </div>
        <Text type="secondary">XT on Polygon</Text>
        {/* Dummy exchange rate for ETH */}
        <Space
          style={{
            float: "right",
            marginTop: "10px"
          }}
        >
          <Text type="secondary">Balance: {polygonXT?.displayValue || 0}</Text>
          <Button
            type="link"
            onClick={() => {
              setBridgeAmountInput(polygonXT?.displayValue);
            }}
          >
            Max
          </Button>
        </Space>
      </div>

      <Divider>
        <Button
          icon={
            <SwapOutlined
              style={{
                fontSize: "20px",
                transform: "rotate(90deg) scaleY(-1)"
              }}
            />
          }
          shape="circle"
          onClick={() => message.info("Two-way bridging is coming soon!")}
        />
      </Divider>

      {/* To Section */}
      <div>
        <Text type="secondary">Receive</Text>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Input
            readOnly
            value={bridgeAmountInput}
            placeholder="0.00"
            variant="borderless"
            style={{ fontSize: "28px", fontWeight: "bold" }}
          />
          <Select
            defaultValue="xt-s"
            value={toToken}
            style={{ maxWidth: 300 }}
            onChange={setToToken}
          >
            <Option value="xt-s">XT on Sepolia</Option>
            <Option value="xt-p" disabled>
              XT on Polygon
            </Option>
          </Select>
        </div>
        <Text
          type="secondary"
          style={{
            float: "right"
          }}
        >
          Balance: {sepoliaXT?.displayValue || 0}
        </Text>
      </div>
      <Text type="secondary">XT on Sepolia</Text>

      {/* Log Messages */}
      <Divider />
      <div style={{ textAlign: "center", color: "red", marginTop: "20px" }}>
        <Space direction="vertical">
          {log?.message && <Text type={log?.type}>{log.message}</Text>}
          {isPending && (
            <Text type="secondary">Transaction in progress...</Text>
          )}
          {isSuccess && <Text type="success">Transaction successful!</Text>}
          {isError && (
            <Text type="danger">Transaction failed! {txError?.message}</Text>
          )}
          {transactionReceipt?.transactionHash && (
            <Space direction="vertical">
              <a
                href={`https://polygonscan.com/tx/${transactionReceipt?.transactionHash}`}
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                View Source Transaction
              </a>
              <a
                href={`https://sepolia.etherscan.io/token/0x3Eed33DCf10eA9543380E71b9E245dca16c30605?a=${account}`}
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                View Destination Balance
              </a>
            </Space>
          )}
        </Space>
      </div>
    </Card>
  );
}
