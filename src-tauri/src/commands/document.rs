use crate::client;
use crate::company;
use crate::document;
use crate::template;
use crate::types::Indicies;
use crate::DbState;
use prisma_client_rust::QueryError;

#[tauri::command]
pub async fn get_documents(
    client: DbState<'_>,
    company_id: i32,
    document_type: String,
    indicies: Indicies,
) -> Result<Vec<document::Data>, QueryError> {
    debug!(
        "Getting documents from {} with type {} and indicies {:?}",
        company_id, document_type, indicies
    );
    client
        .document()
        .find_many(vec![
            document::company_id::equals(company_id),
            document::document_type::equals(document_type),
        ])
        .skip(indicies.skip)
        .take(indicies.take)
        .exec()
        .await
}

#[tauri::command]
pub async fn get_document(
    client: DbState<'_>,
    id: i32,
) -> Result<Option<document::Data>, QueryError> {
    client
        .document()
        .find_unique(document::id::equals(id))
        .exec()
        .await
}

#[tauri::command]
pub async fn create_document(client: DbState<'_>, data: document::Data) -> Result<(), String> {
    debug!("Creating document");
    let data = client
        .document()
        .create(
            data.number,
            data.document_type,
            client::id::equals(data.client_id),
            template::id::equals(data.template_id),
            data.currency,
            data.issue_date,
            data.tax_date,
            data.due_date,
            company::id::equals(data.company_id),
            vec![document::status::set(data.status)],
        )
        .exec()
        .await;

    match data {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn update_document(client: DbState<'_>, data: document::Data) -> Result<(), String> {
    debug!("Updating document");
    let data = client
        .document()
        .update(
            document::id::equals(data.id),
            vec![
                document::number::set(data.number),
                document::document_type::set(data.document_type),
                document::client_id::set(data.client_id),
                document::template_id::set(data.template_id),
                document::currency::set(data.currency),
                document::issue_date::set(data.issue_date),
                document::tax_date::set(data.tax_date),
                document::due_date::set(data.due_date),
                document::status::set(data.status),
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
pub async fn delete_document(client: DbState<'_>, id: i32) -> Result<(), String> {
    debug!("Deleting document");
    let data = client
        .document()
        .delete(document::id::equals(id))
        .exec()
        .await;

    match data {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
