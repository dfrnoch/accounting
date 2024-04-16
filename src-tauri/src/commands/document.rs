use crate::client;
use crate::commands::settings::update_count;
use crate::company;
use crate::currency;
use crate::document;
use crate::document_item;
use crate::template;
use crate::types::Indicies;
use crate::DbState;
use prisma_client_rust::chrono::{DateTime, FixedOffset};
use prisma_client_rust::Direction;
use prisma_client_rust::QueryError;

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct DocumentWithPrice {
    id: i32,
    number: String,
    document_type: String,
    client_id: i32,
    template_id: i32,
    currency_id: String,
    issue_date: DateTime<FixedOffset>,
    due_date: DateTime<FixedOffset>,
    company_id: i32,
    status: String,
    items: Option<Vec<document_item::Data>>,
    total_price: f64,
}

#[tauri::command]
pub async fn get_documents(
    client: DbState<'_>,
    company_id: i32,
    document_type: Option<String>,
    indicies: Indicies,
    client_id: Option<i32>,
) -> Result<Vec<DocumentWithPrice>, QueryError> {
    debug!(
        "Getting documents from {} with type {:?} and indicies {:?}",
        company_id, document_type, indicies
    );

    let mut conditions = vec![document::company_id::equals(company_id)];

    if let Some(client_id) = client_id {
        conditions.push(document::client_id::equals(client_id));
    }
    if let Some(document_type) = document_type {
        conditions.push(document::document_type::equals(document_type));
    }

    let documents = client
        .document()
        .find_many(conditions)
        .order_by(document::id::order(Direction::Desc))
        .with(document::items::fetch(vec![]))
        .skip(indicies.skip)
        .take(indicies.take)
        .exec()
        .await?;

    let documents_with_price = documents
        .into_iter()
        .map(|doc| {
            let total_price: f64 = doc
                .items
                .as_ref()
                .unwrap_or(&vec![])
                .iter()
                .map(|item| item.price * item.quantity as f64)
                .sum();
            DocumentWithPrice {
                id: doc.id,
                number: doc.number,
                document_type: doc.document_type,
                client_id: doc.client_id,
                template_id: doc.template_id,
                currency_id: doc.currency_id,
                issue_date: doc.issue_date,
                due_date: doc.due_date,
                company_id: doc.company_id,
                status: doc.status,
                items: doc.items,
                total_price,
            }
        })
        .collect::<Vec<DocumentWithPrice>>();

    Ok(documents_with_price)
}

#[tauri::command]
pub async fn get_document_count(
    client: DbState<'_>,
    document_type: Option<String>,
    client_id: Option<i32>,
) -> Result<i64, QueryError> {
    let mut conditions = vec![];

    if let Some(client_id) = client_id {
        conditions.push(document::client_id::equals(client_id));
    }
    if let Some(document_type) = document_type {
        conditions.push(document::document_type::equals(document_type));
    }

    client.document().count(conditions).exec().await
}

#[tauri::command]
pub async fn get_document(
    client: DbState<'_>,
    id: i32,
) -> Result<Option<document::Data>, QueryError> {
    client
        .document()
        .find_unique(document::id::equals(id))
        .with(document::items::fetch(vec![]))
        .exec()
        .await
}

#[tauri::command]
pub async fn create_document(client: DbState<'_>, data: document::Data) -> Result<(), String> {
    debug!("Creating document");
    let res = client
        .document()
        .create(
            data.number,
            data.document_type,
            client::id::equals(data.client_id),
            template::id::equals(data.template_id),
            currency::id::equals(data.currency_id),
            data.issue_date,
            data.due_date,
            company::id::equals(data.company_id),
            vec![document::status::set(data.status)],
        )
        .exec()
        .await;

    if let Some(items) = data.items {
        for item in items.iter() {
            let _ = client
                .document_item()
                .create(
                    document::id::equals(res.as_ref().unwrap().company_id),
                    item.description.clone(),
                    item.quantity,
                    item.price,
                    vec![],
                )
                .exec()
                .await
                .unwrap();
        }
    }

    match res {
        Ok(_) => {
            update_count(client, data.company_id, "Invoice").await;
            Ok(())
        }
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn update_document(client: DbState<'_>, data: document::Data) -> Result<(), String> {
    debug!("Updating document");

    // Update the document fields
    let updated_document = client
        .document()
        .update(
            document::id::equals(data.id),
            vec![
                document::number::set(data.number),
                document::document_type::set(data.document_type),
                document::client_id::set(data.client_id),
                document::template_id::set(data.template_id),
                document::currency_id::set(data.currency_id),
                document::issue_date::set(data.issue_date),
                document::due_date::set(data.due_date),
                document::status::set(data.status),
            ],
        )
        .exec()
        .await;

    match updated_document {
        Ok(_) => {
            let _ = client
                .document_item()
                .delete_many(vec![document_item::document_id::equals(data.id)])
                .exec()
                .await;

            if let Some(items) = data.items {
                for item in items.iter() {
                    println!("ITEMS: {:?}", item);
                    let _ = client
                        .document_item()
                        .create(
                            document::id::equals(data.id),
                            item.description.clone(),
                            item.quantity,
                            item.price,
                            vec![],
                        )
                        .exec()
                        .await;
                }
            }

            Ok(())
        }
        Err(e) => {
            error!("Error updating document: {}", e);
            Err(e.to_string())
        }
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
