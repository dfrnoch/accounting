use crate::company;
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
    // street_adress: String,
    city: String,
    // postal_code: String,
    phone_number: Option<String>,
    email: Option<String>,
}

#[tauri::command]
pub async fn create_company(
    client: DbState<'_>,
    data: CreateCompanyData,
) -> Result<company::Data, ()> {
    debug!("Creating company {:?}", data);
    client
        .company()
        .create(
            data.name,
            data.cin,
            "cus".to_string(),
            data.city,
            "aaaa".to_string(),
            vec![
                company::vat_id::set(data.vat_id),
                company::phone_number::set(data.phone_number),
            ],
        )
        .exec()
        .await
        .map_err(|_| ())
}
