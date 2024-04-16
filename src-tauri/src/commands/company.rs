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
pub struct CreateCompanyData {
    name: String,
    cin: String,
    vat_id: Option<String>,
    address: String,
    city: String,
    zip: String,
    phone: Option<String>,
    email: Option<String>,
}

#[tauri::command]
pub async fn create_company(
    client: DbState<'_>,
    data: CreateCompanyData,
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
