use crate::client;
use crate::company;
use crate::types::Indicies;
use crate::DbState;
use prisma_client_rust::QueryError;

#[tauri::command]
pub async fn get_clients(
    client: DbState<'_>,
    company_id: i32,
    indicies: Indicies,
) -> Result<Vec<client::Data>, QueryError> {
    debug!(
        "Getting clients from {} with indicies {:?}",
        company_id, indicies
    );
    client
        .client()
        .find_many(vec![client::company_id::equals(company_id)])
        .skip(indicies.skip)
        .take(indicies.take)
        .exec()
        .await
}

#[tauri::command]
pub async fn get_client(client: DbState<'_>, id: i32) -> Result<Option<client::Data>, QueryError> {
    client
        .client()
        .find_unique(client::id::equals(id))
        .exec()
        .await
}

#[tauri::command]
pub async fn create_client(client: DbState<'_>, data: client::Data) -> Result<(), String> {
    debug!("Creating client");
    let data = client
        .client()
        .create(
            data.name,
            data.cin,
            data.address,
            data.city,
            data.zip,
            company::id::equals(data.company_id),
            vec![
                client::phone::set(data.phone),
                client::email::set(data.email),
                client::vat_id::set(data.vat_id),
                client::client_type::set(data.client_type),
            ],
        )
        .exec()
        .await
        .map_err(|e| e.to_string());

    match data {
        Ok(_) => Ok(()),
        Err(e) => Err(e),
    }
}
