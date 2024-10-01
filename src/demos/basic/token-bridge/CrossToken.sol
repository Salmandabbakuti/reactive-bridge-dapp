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

    function withdraw(uint256 _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Not enough balance");
        payable(owner).transfer(_amount);
    }

    function bridgeMint(
        address /* sender */,
        address _receiver,
        uint256 _amount
    ) external authorizedSenderOnly {
        _mint(_receiver, _amount);
    }

    function mint(address _receiver, uint256 _amount) external onlyOwner {
        _mint(_receiver, _amount);
    }

    function bridgeRequest(uint256 _amount) external {
        _burn(msg.sender, _amount);
        emit BridgeRequest(address(this), block.chainid, msg.sender, _amount);
    }
}
