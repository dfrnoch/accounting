use crate::document;
use crate::DbState;
use prisma_client_rust::chrono::NaiveDate;
use prisma_client_rust::QueryError;
use serde::Deserialize;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DateRange {
    start_date: NaiveDate,
    end_date: NaiveDate,
}

#[tauri::command]
pub async fn get_sales_stats(
    client: DbState<'_>,
    company_id: i32,
    date_range: DateRange,
) -> Result<f64, QueryError> {
    let sales = client
        .document()
        .find_many(vec![
            document::company_id::equals(company_id),
            document::document_type::equals("INVOICE".to_string()),
            document::issue_date::gte(date_range.start_date.and_hms(0, 0, 0)),
            document::issue_date::lte(date_range.end_date.and_hms(23, 59, 59)),
        ])
        .with(document::items::fetch(vec![]))
        .exec()
        .await?;

    let total_sales: f64 = sales
        .into_iter()
        .flat_map(|doc| doc.items)
        .map(|item| item.price * item.quantity as f64)
        .sum();

    Ok(total_sales)
}

#[tauri::command]
pub async fn get_expenses_stats(
    client: DbState<'_>,
    company_id: i32,
    date_range: DateRange,
) -> Result<f64, QueryError> {
    let expenses = client
        .document()
        .find_many(vec![
            document::company_id::equals(company_id),
            document::document_type::equals("RECIEVE".to_string()),
            document::issue_date::gte(date_range.start_date.and_hms(0, 0, 0)),
            document::issue_date::lte(date_range.end_date.and_hms(23, 59, 59)),
        ])
        .with(document::items::fetch(vec![]))
        .exec()
        .await?;

    let total_expenses: f64 = expenses
        .into_iter()
        .flat_map(|doc| doc.items)
        .map(|item| item.price * item.quantity as f64)
        .sum();

    Ok(total_expenses)
}
