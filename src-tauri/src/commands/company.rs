use crate::company;
use crate::currency;
use crate::template;
use crate::DbState;
use prisma_client_rust::not;
use prisma_client_rust::QueryError;
use serde::Deserialize;

#[tauri::command]
pub async fn get_companies(
    client: DbState<'_>,
    exclude: Option<i32>,
) -> Result<Vec<company::Data>, QueryError> {
    println!("Getting companies, exluding {:?}", exclude);
    let data = client
        .company()
        .find_many(vec![not![company::id::equals(exclude.unwrap_or(999))]])
        .exec()
        .await;

    println!("{:?}", data);
    data
}

#[tauri::command]
pub async fn get_company(
    client: DbState<'_>,
    id: Option<i32>,
) -> Result<Option<company::Data>, QueryError> {
    client
        .company()
        .find_first(vec![company::id::equals(id.unwrap_or(1))])
        .exec()
        .await
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ManageCompanyData {
    name: String,
    cin: String,
    vat_id: Option<String>,
    address: String,
    city: String,
    zip: String,
    phone: Option<String>,
    email: Option<String>,

    bank_account: Option<String>,
    bank_iban: Option<String>,
}

#[tauri::command]
pub async fn create_company(
    client: DbState<'_>,
    data: ManageCompanyData,
) -> Result<i32, QueryError> {
    debug!("Creating company {:?}", data);
    let company = client
        .company()
        .create(
            data.name,
            data.cin,
            data.address,
            data.city,
            data.zip,
            vec![
                company::vat_id::set(data.vat_id),
                company::email::set(data.email),
                company::phone::set(data.phone),
                company::bank_account::set(data.bank_account),
                company::bank_iban::set(data.bank_iban),
            ],
        )
        .exec()
        .await
        .unwrap();

    let currency = client
        .currency()
        .create(
            "Euro".to_string(),
            "EUR".to_string(),
            1.0,
            company::id::equals(company.id),
            vec![],
        )
        .exec()
        .await
        .unwrap();

    let template = client
        .template()
        .create(
            "Default Invoice".to_string(),
            "<html><body><h1>Invoice</h1></body></html>".to_string(),
            company::id::equals(company.id),
            vec![],
        )
        .exec()
        .await
        .unwrap();

    let _settings = client
        .settings()
        .create(
            company::id::equals(company.id),
            currency::id::equals(currency.id),
            template::id::equals(template.id),
            vec![],
        )
        .exec()
        .await
        .unwrap();

    Ok(company.id)
}

#[tauri::command]
pub async fn update_company(
    client: DbState<'_>,
    id: i32,
    data: ManageCompanyData,
) -> Result<(), QueryError> {
    debug!("Updating company");
    println!("{:?}", data);
    let data = client
        .company()
        .update(
            company::id::equals(id),
            vec![
                company::name::set(data.name),
                company::cin::set(data.cin),
                company::vat_id::set(data.vat_id),
                company::address::set(data.address),
                company::city::set(data.city),
                company::zip::set(data.zip),
                company::phone::set(data.phone),
                company::email::set(data.email),
                company::bank_account::set(data.bank_account),
                company::bank_iban::set(data.bank_iban),
            ],
        )
        .exec()
        .await;

    match data {
        Ok(_) => Ok(()),
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub async fn delete_company(client: DbState<'_>, id: i32) -> Result<(), String> {
    debug!("Deleting company");
    let data = client
        .company()
        .delete(company::id::equals(id))
        .exec()
        .await;

    match data {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
