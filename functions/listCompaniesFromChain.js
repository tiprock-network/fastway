const companyLister = (company_list,fields) =>{
    let companies_object_list = [];
    for (let i = 0; i < company_list["0"].length; i++) {
        let object = {};
        for (let j = 0; j < fields.length; j++) {
            object[fields[j]] = company_list[j.toString()][i];
        }
        companies_object_list.push(object);
    }
    return companies_object_list;
}

module.exports = companyLister