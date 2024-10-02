// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "../../AbstractCallback.sol";

contract CrossToken is ERC20, AbstractCallback {
    address public owner;
    event BridgeRequest(
        address origin,
        uint256 chainId,
        address sender,
        uint256 amount
    );

    receive() external payable {}

    constructor(
        uint256 initialSupply,
        address _callback_sender
    )
        ERC20("CrossToken", "XT")
        AbstractCallback(_callback_sender) // Set desired callback address for secure bridging
    {
        owner = msg.sender;
        _mint(msg.sender, initialSupply);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "No Permission!");
        _;
    }

    /**
     * @notice Withdraws the contract balance to the owner
     * @param _amount Amount to withdraw
     */
    function withdraw(uint256 _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Not enough balance");
        payable(owner).transfer(_amount);
    }

    /**
     * @notice Mint tokens to the receiver
     * @param sender Sender address
     * @param _receiver Receiver address
     * @param _amount Amount to mint
     */
    function bridgeMint(
        address sender,
        address _receiver,
        uint256 _amount
    ) external authorizedSenderOnly {
        require(sender == owner, "No Permission!"); // sender is the reactvm address(deployer)
        _mint(_receiver, _amount);
    }

    /**
     * @notice Mint tokens to the receiver by the owner
     * @dev for testing purposes. Only owner can call this function to mint tokens to the receiver
     * @param _receiver Receiver address
     * @param _amount Amount to mint
     */
    function mint(address _receiver, uint256 _amount) external onlyOwner {
        _mint(_receiver, _amount);
    }

    /**
     * @notice Bridge request to send tokens to the other chain
     * @param _amount Amount to bridge
     * @dev Burns the tokens from the sender and emits BridgeRequest event
     */
    function bridgeRequest(uint256 _amount) external {
        _burn(msg.sender, _amount);
        emit BridgeRequest(address(this), block.chainid, msg.sender, _amount);
    }
}
