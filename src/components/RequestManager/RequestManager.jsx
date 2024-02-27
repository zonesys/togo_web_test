function getUserCreditialParams() {
    var requestParams = new URLSearchParams();
    requestParams.append("TransporterId", "1028");
    requestParams.append(
        "TokenDevice",
        "02a5db8e6e18d48a84c47c4d196fca64caa596ef"
    );
    requestParams.append("Counter", "1");
    return requestParams;
}

function performRequest(component, params) {
    const apiUrl = "/ToGo/MobileAPi/public/FunctionApis.php";
    axios
        .post(apiUrl, params, {
            headers: {
                "Access-Control-Allow-Origin": `*`,
                "Content-Type": `application/x-www-form-urlencoded`,
            },
        })
        .then((response) => {
            component.setState({orders: response.data.server_response});
        })
        .catch((error) => {
        });
}
