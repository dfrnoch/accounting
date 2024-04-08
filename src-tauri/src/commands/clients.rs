use crate::client;
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
