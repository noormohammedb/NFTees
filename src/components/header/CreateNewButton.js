import React from "react";
import { useState, useEffect } from "react";

export default function CreateNewButton(props) {
    const { buttonColor } = props;
    const [haveMetamask, sethaveMetamask] = useState(true);
    const [accountAddress, setAccountAddress] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    const { ethereum } = window;

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
            setAccountAddress(accounts[0]);
            localStorage.setItem("wallet_address", accounts[0]);
            setIsConnected(true);
            
            // CreateItem();
        } catch (error) {
            setIsConnected(false);
        }
    };

    return (
        <div className={`btn ${buttonColor} btn-sm rounded-pill`} onClick={connectWallet} >
            {haveMetamask ? (
                <div className="ft-dd">
                    {isConnected ? (
                        <>
                            <p>
                                {accountAddress.slice(0, 4)}...
                                {accountAddress.slice(38, 42)}
                            </p>
                        </>
                    ) : (
                        <p>
                            Connect
                        </p>
                    )}

                </div>
            ) : (
                <p>Please Install MataMask</p>
            )}
        </div>
    )
}