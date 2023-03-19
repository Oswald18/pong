async function connectMetaMask() {
  if (window.ethereum) {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      console.log('Connected MetaMask account:', account);
      return account;
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      return null;
    }
  } else {
    console.error('MetaMask not detected. Please install MetaMask to play this game.');
    return null;
  }
}

async function depositToSmartContract(account) {
  const contractAddress = '0x123456...'; // Replace with your deployed smart contract address
  const depositAmount = '0.001'; // 0.001 ETH

  try {
    const weiAmount = window.web3.utils.toWei(depositAmount, 'ether');
    const tx = {
      to: contractAddress,
      from: account,
      value: weiAmount,
      gas: '100000'
    };

    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    });

    console.log('Transaction hash:', txHash);
    return txHash;
  } catch (error) {
    console.error('Error depositing to smart contract:', error);
    return null;
  }
}

document.getElementById('connectMetamask').addEventListener('click', async () => {
  const account = await connectMetaMask();
  if (account) {
    const txHash = await depositToSmartContract(account);
    if (txHash) {
      console.log('Deposited successfully:', txHash);
      websocket.send(JSON.stringify({ type: 'playerJoined', account }));
    }
  }
});
