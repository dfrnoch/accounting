use crate::invoice;
use crate::DbState;
use prisma_client_rust::QueryError;

#[tauri::command]
pub async fn get_invoices(
    client: DbState<'_>,
    company_id: Option<i32>,
) -> Result<Vec<invoice::Data>, QueryError> {
    client
        .invoice()
        .find_many(vec![invoice::company_id::equals(company_id.unwrap_or(1))])
        .exec()
        .await
}
