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
        .await;

    match data {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn update_client(client: DbState<'_>, data: client::Data) -> Result<(), String> {
    debug!("Updating client");
    let data = client
        .client()
        .update(
            client::id::equals(data.id),
            vec![
                client::name::set(data.name),
                client::phone::set(data.phone),
                client::email::set(data.email),
                client::cin::set(data.cin),
                client::vat_id::set(data.vat_id),
                client::client_type::set(data.client_type),
                client::address::set(data.address),
                client::city::set(data.city),
                client::zip::set(data.zip),
            ],
        )
        .exec()
        .await;

    match data {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn delete_client(client: DbState<'_>, id: i32) -> Result<(), String> {
    debug!("Deleting client");
    let data = client.client().delete(client::id::equals(id)).exec().await;

    match data {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
