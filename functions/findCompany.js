const findCompany = (companyList,addr) =>{
    return companyList.filter((company)=>company.address == addr)
}

module.exports = findCompany