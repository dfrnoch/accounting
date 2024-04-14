use crate::client;
use crate::company;
use crate::currency;
use crate::document;
use crate::template;
use crate::DbState;
use prisma_client_rust::QueryError;

#[tauri::command]
pub async fn get_model_count(
    client: DbState<'_>,
    company_id: i32,
    model: String,
) -> Result<i64, String> {
    match model.as_str() {
        "Invoice" => client
            .document()
            .count(vec![
                document::company_id::equals(company_id),
                document::document_type::equals("INVOICE".to_string()),
            ])
            .exec()
            .await
            .map_err(|e| format!("Error counting invoices: {}", e)),
        "Proforma" => client
            .document()
            .count(vec![
                document::company_id::equals(company_id),
                document::document_type::equals("PROFORMA".to_string()),
            ])
            .exec()
            .await
            .map_err(|e| format!("Error counting proformas: {}", e)),
        "Recieve" => client
            .document()
            .count(vec![
                document::company_id::equals(company_id),
                document::document_type::equals("RECIEVE".to_string()),
            ])
            .exec()
            .await
            .map_err(|e| format!("Error counting recieves: {}", e)),
        "Company" => client
            .company()
            .count(vec![company::id::equals(company_id)])
            .exec()
            .await
            .map_err(|e| format!("Error counting companies: {}", e)),
        "Client" => client
            .client()
            .count(vec![client::company_id::equals(company_id)])
            .exec()
            .await
            .map_err(|e| format!("Error counting clients: {}", e)),
        "Template" => client
            .template()
            .count(vec![template::company_id::equals(company_id)])
            .exec()
            .await
            .map_err(|e| format!("Error counting templates: {}", e)),
        "Currency" => client
            .currency()
            .count(vec![currency::company_id::equals(company_id)])
            .exec()
            .await
            .map_err(|e| format!("Error counting currencies: {}", e)),
        _ => Err("Model not found".to_string()),
    }
}

#[tauri::command]
pub async fn get_print_document(
    client: DbState<'_>,
    id: i32,
) -> Result<Option<document::Data>, QueryError> {
    client
        .document()
        .find_unique(document::id::equals(id))
        .with(document::items::fetch(vec![]))
        .with(document::currency::fetch())
        .with(document::client::fetch())
        .with(document::template::fetch())
        .exec()
        .await
}
