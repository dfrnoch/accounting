use crate::invoice;
use crate::types::Indicies;
use crate::DbState;
use prisma_client_rust::QueryError;

#[tauri::command]
pub async fn get_invoices(
    client: DbState<'_>,
    company_id: i32,
    indicies: Indicies,
) -> Result<Vec<invoice::Data>, QueryError> {
    debug!(
        "Getting invoices from {} with indicies {:?}",
        company_id, indicies
    );
    let data = client
        .invoice()
        .find_many(vec![invoice::company_id::equals(company_id)])
        .skip(indicies.skip)
        .take(indicies.take)
        .exec()
        .await;

    data
}
