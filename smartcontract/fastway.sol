// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address,uint256) external returns (bool);
    function approve(address,uint256) external returns (bool);
    function transferFrom(address,address,uint256) external  returns  (bool);
    function totalSupply() external  view returns (uint256);
    function balanceOf(address) external  view returns (uint256);
    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract FastWay{

    uint internal fastwayLength;
    address internal cUSDTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Company{
        address payable companyOwner;
        string companyName;
        string companyImage;
        string companyDesc;
        string[] companyServices;
        string companyEmail;
        string companyPhone;
        string companyAddress;
        string companyType;
        uint salesNo;
    }

    mapping(uint => Company) internal companies;

    function createCompany(
        string memory _name,
        string memory _imageUrl,
        string memory _desc,
        string[] memory _services,
        string memory _email,
        string memory _phone,
        string memory _address,
        string memory _type
    ) public {
        uint sales = 0;
        companies[fastwayLength] = Company(
            payable(msg.sender),
            _name,
            _imageUrl,
            _desc,
            _services,
            _email,
            _phone,
            _address,
            _type,
            sales
        );

        fastwayLength++;
    }

    function fetchCompany(uint _index) public view returns(Company memory){
        return companies[_index];
    }

    // New function to fetch all companies vars have reached limit
    function fetchAllCompanies() public view returns (
        address[] memory,
        string[] memory,
        string[] memory,
        string[] memory,
        string[][] memory,
        string[] memory,
        string[] memory,
        string[] memory
    ) {
        address[] memory owners = new address[](fastwayLength);
        string[] memory names = new string[](fastwayLength);
        string[] memory images = new string[](fastwayLength);
        string[] memory descs = new string[](fastwayLength);
        string[][] memory services = new string[][](fastwayLength);
        string[] memory emails = new string[](fastwayLength);
        string[] memory phones = new string[](fastwayLength);
        string[] memory addresses = new string[](fastwayLength);
        

        for (uint i = 0; i < fastwayLength; i++) {
            Company storage company = companies[i];
            owners[i] = company.companyOwner;
            names[i] = company.companyName;
            images[i] = company.companyImage;
            descs[i] = company.companyDesc;
            services[i] = company.companyServices;
            emails[i] = company.companyEmail;
            phones[i] = company.companyPhone;
            addresses[i] = company.companyAddress;
            
            
        }

        return (owners, names, images, descs, services, emails, phones, addresses);
    }

    function payCompany(uint _index, uint _invoiceTotal) public payable{
        require(
            IERC20Token(cUSDTokenAddress).transferFrom(
                msg.sender,
                companies[_index].companyOwner,
                _invoiceTotal
            ),
            "Transfer Failed"
        );

        companies[_index].salesNo++;
    }

    function getNumberofCompanies() public view returns(uint){
        return fastwayLength;
    }

    function getAddresses() public view returns (address[] memory){
        address[] memory wallets = new address[](fastwayLength);
        for (uint i = 0; i < fastwayLength; i++) {
            Company storage company = companies[i];
            wallets[i] = company.companyOwner; 
        }

        return(wallets);
    }

    function getCompanyByOwner(address _owner) public view returns (Company memory) {
        for (uint i = 0; i < fastwayLength; i++) {
            if (companies[i].companyOwner == _owner) {
                return companies[i];
            }
        }
        revert("Company not found");
    }
    
    
}