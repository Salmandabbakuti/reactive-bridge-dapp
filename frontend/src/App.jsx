import { useState } from "react";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
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
import { contract } from "./utils";

const { Option } = Select;
const { Text } = Typography;

export default function App() {
  const [bridgeAmountInput, setBridgeAmountInput] = useState(null);
  const [fromToken, setFromToken] = useState("xt-p");
  const [toToken, setToToken] = useState("xt-s");
  const [fromTokenBalance, setFromTokenBalance] = useState("0.21");
  const [toTokenBalance, setToTokenBalance] = useState("1011.3");
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState({
    message: "",
    type: ""
  });

  const accountObj = useActiveAccount() || {};
  const account = accountObj?.address?.toLowerCase();
  const activeChain = useActiveWalletChain() || {};

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
    setLoading(true);
    message.info("Coming soon!");
    setLoading(false);
  };

  return (
    <Card
      title="Bridge"
      extra={<SettingOutlined />}
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
          loading={loading}
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
          <Text type="secondary">Balance: {fromTokenBalance}</Text>
          <Button type="link">Max</Button>
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
          Balance: {toTokenBalance}
        </Text>
      </div>
      <Text type="secondary">XT on Sepolia</Text>

      {/* Log Messages */}
      <div style={{ textAlign: "center", color: "red" }}>
        {log?.message && <Text type={log?.type}>{log.message}</Text>}
      </div>
    </Card>
  );
}
