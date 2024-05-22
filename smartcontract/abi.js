const abi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_imageUrl",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_desc",
                "type": "string"
            },
            {
                "internalType": "string[]",
                "name": "_services",
                "type": "string[]"
            },
            {
                "internalType": "string",
                "name": "_email",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_phone",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_address",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_type",
                "type": "string"
            }
        ],
        "name": "createCompany",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fetchAllCompanies",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            },
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            },
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            },
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            },
            {
                "internalType": "string[][]",
                "name": "",
                "type": "string[][]"
            },
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            },
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            },
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "fetchCompany",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address payable",
                        "name": "companyOwner",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "companyName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "companyImage",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "companyDesc",
                        "type": "string"
                    },
                    {
                        "internalType": "string[]",
                        "name": "companyServices",
                        "type": "string[]"
                    },
                    {
                        "internalType": "string",
                        "name": "companyEmail",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "companyPhone",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "companyAddress",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "companyType",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "salesNo",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct FastWay.Company",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAddresses",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "getCompanyByOwner",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address payable",
                        "name": "companyOwner",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "companyName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "companyImage",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "companyDesc",
                        "type": "string"
                    },
                    {
                        "internalType": "string[]",
                        "name": "companyServices",
                        "type": "string[]"
                    },
                    {
                        "internalType": "string",
                        "name": "companyEmail",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "companyPhone",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "companyAddress",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "companyType",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "salesNo",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct FastWay.Company",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getNumberofCompanies",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_invoiceTotal",
                "type": "uint256"
            }
        ],
        "name": "payCompany",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
]
module.exports = abi