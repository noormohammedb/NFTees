import { AuthProvider } from '@arcana/auth'
import { AppMode } from '@arcana/auth'
import { useState, useEffect } from "react";
import { ethers } from "ethers";


const ConnectWalletContent = () => {
    const [haveMetamask, sethaveMetamask] = useState(true);
    const [accountAddress, setAccountAddress] = useState("");
    const [accountBalance, setAccountBalance] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [user, setUser] = useState(null);
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    useEffect(() => {
        const { ethereum } = window;
        const checkMetamaskAvailability = async () => {
            if (!ethereum) {
                sethaveMetamask(false);
            }
            sethaveMetamask(true);
        };
        checkMetamaskAvailability();
    }, []);

    const connectWallet = async () => {
        try {
            if (!ethereum) {
                sethaveMetamask(false);
            }
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            let balance = await provider.getBalance(accounts[0]);
            let bal = ethers.utils.formatEther(balance);
            setAccountAddress(accounts[0]);
            localStorage.setItem("wallet_address", accounts[0]);
            setAccountBalance(bal);
            setIsConnected(true);

            // CreateItem();
        } catch (error) {
            setIsConnected(false);
        }
    };

    async function Autharcana() {
        const auth = new AuthProvider('2191')

        const position = 'left'

        await auth.init({ appMode: AppMode.Widget, position })

        const provider = auth.provider
        console.log("connecting...")
        console.log(provider)
        await auth.loginWithSocial(`google`)
        const connected = await auth.isLoggedIn();
        console.log(connected)
        const info = await auth.getUser()
        setUser(info)
        setIsConnected(true);
    }


    return (
        <div className="connect-wallet-wrapper">
            <div className="container">
                <div className="text-center">
                    <h2 className="mb-70">Connect with one of our available wallet providers.</h2>
                </div>

                <div className="row g-4 g-xl-5 justify-content-center">
                    <div className="col-12 col-md-9 col-lg-6 col-xl-5" >
                        <div className="card wallet-card shadow-sm">
                            <div className="card-body px-4">
                                <div className="d-flex align-items-center">
                                    <div className="img-wrap">
                                        <img src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" alt="Metamask" />
                                    </div>
                                    <h4 className="mb-0 me-3">Metamask
                                        <span className="badge bg-danger rounded-pill align-top fz-12 ms-1">
                                            Hot
                                        </span>
                                    </h4>
                                    <button className={`btn btn-sm btn-warning rounded-pill ms-auto`} onClick={connectWallet} >
                                        {isConnected ? ("Connected") : ("Connect")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div >
                    <div className="col-12 col-md-9 col-lg-6 col-xl-5" >
                        <div className="card wallet-card shadow-sm">
                            <div className="card-body px-4">
                                <div className="d-flex align-items-center">
                                    <div className="img-wrap">
                                        <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" />
                                    </div>
                                    <h4 className="mb-0 me-3">Arcana Login (Google)
                                    </h4>
                                    <button className={`btn btn-sm btn-warning rounded-pill ms-auto`} onClick={Autharcana} >
                                        {isConnected ? ("Connected") : ("Connect")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div >
                </div>
            </div>
        </div>
    )
}

export default ConnectWalletContent;