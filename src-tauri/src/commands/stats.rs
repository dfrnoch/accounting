use crate::currency;
use crate::document;
use crate::settings;
use crate::DbState;
use prisma_client_rust::chrono::{DateTime, Datelike, Duration, FixedOffset, Local, TimeZone};
use prisma_client_rust::QueryError;

fn get_month_ranges(months: i32) -> Vec<(DateTime<FixedOffset>, DateTime<FixedOffset>)> {
    let today = Local::now();
    let today_naive = today.naive_local().date();
    let mut month_ranges = Vec::new();

    for month_offset in 0..months {
        let target_month = (today_naive.month() as i32 - month_offset - 1).rem_euclid(12) + 1;
        let year_adjustment = (today_naive.month() as i32 - month_offset - 1) / 12;
        let adjusted_year = today_naive.year() + year_adjustment;

        let first_day_of_target_month = today_naive
            .with_year(adjusted_year)
            .unwrap()
            .with_month(target_month as u32)
            .unwrap()
            .with_day(1)
            .unwrap();
        let last_day_of_target_month = first_day_of_target_month
            .with_month((target_month % 12 + 1) as u32)
            .unwrap_or_else(|| {
                first_day_of_target_month
                    .with_year(adjusted_year + 1)
                    .unwrap()
                    .with_month(1)
                    .unwrap()
            })
            - Duration::days(1);

        let start_datetime = FixedOffset::east_opt(0)
            .unwrap()
            .from_utc_datetime(&first_day_of_target_month.and_hms_opt(0, 0, 0).unwrap());
        let end_datetime = FixedOffset::east_opt(0)
            .unwrap()
            .from_utc_datetime(&last_day_of_target_month.and_hms_opt(23, 59, 59).unwrap());

        month_ranges.push((start_datetime, end_datetime));
    }

    // month_ranges.reverse(); // Ensure the months are in ascending order
    month_ranges
}

async fn get_default_currency(client: &DbState<'_>, company_id: i32) -> currency::Data {
    let company_settings = client
        .settings()
        .find_unique(settings::company_id::equals(company_id))
        .with(settings::default_currency::fetch())
        .exec()
        .await
        .unwrap();

    *company_settings.unwrap().default_currency.unwrap()
}
#[tauri::command]
pub async fn get_sales(
    client: DbState<'_>,
    company_id: i32,
    months: i32,
) -> Result<Vec<f64>, QueryError> {
    let month_ranges = get_month_ranges(months);
    let default_currency = get_default_currency(&client, company_id).await;
    let mut monthly_sales = Vec::new();

    for (start_date, end_date) in month_ranges {
        let sales = client
            .document()
            .find_many(vec![
                document::company_id::equals(company_id),
                document::document_type::equals("INVOICE".to_string()),
                document::issue_date::gte(start_date),
                document::issue_date::lte(end_date),
            ])
            .with(document::items::fetch(vec![]))
            .with(document::currency::fetch())
            .exec()
            .await?;

        let total_sales: f64 = sales
            .into_iter()
            .map(|doc| {
                let exchange_rate = if let Some(currency) = doc.currency {
                    if currency.code != "EUR" {
                        currency.rate
                    } else {
                        1.0
                    }
                } else {
                    1.0
                };

                doc.items
                    .unwrap_or_default()
                    .into_iter()
                    .map(|item| {
                        let base_price = item.price * item.quantity as f64 / exchange_rate;
                        (base_price * default_currency.rate).round()
                    })
                    .sum::<f64>()
            })
            .sum();

        monthly_sales.push(total_sales);
    }

    Ok(monthly_sales)
}

#[tauri::command]
pub async fn get_expenses(
    client: DbState<'_>,
    company_id: i32,
    months: i32,
) -> Result<Vec<f64>, QueryError> {
    debug!("Getting expenses for company_id: {}", company_id);
    let month_ranges = get_month_ranges(months);
    let default_currency = get_default_currency(&client, company_id).await;
    let mut monthly_expenses = Vec::new();

    for (start_date, end_date) in month_ranges {
        let expenses = client
            .document()
            .find_many(vec![
                document::company_id::equals(company_id),
                document::document_type::equals("RECEIVE".to_string()),
                document::issue_date::gte(start_date),
                document::issue_date::lte(end_date),
            ])
            .with(document::items::fetch(vec![]))
            .with(document::currency::fetch())
            .exec()
            .await?;

        let total_expenses: f64 = expenses
            .into_iter()
            .map(|doc| {
                let exchange_rate = if let Some(currency) = doc.currency {
                    if currency.code != "EUR" {
                        currency.rate
                    } else {
                        1.0
                    }
                } else {
                    1.0
                };

                doc.items
                    .unwrap_or_default()
                    .into_iter()
                    .map(|item| {
                        let base_price = item.price * item.quantity as f64 / exchange_rate;
                        (base_price * default_currency.rate).round()
                    })
                    .sum::<f64>()
            })
            .sum();

        monthly_expenses.push(total_expenses);
    }

    Ok(monthly_expenses)
}

#[tauri::command]
pub async fn get_sales_and_expenses(
    client: DbState<'_>,
    company_id: i32,
    months: i32,
) -> Result<Vec<(f64, f64)>, QueryError> {
    let sales = get_sales(client.clone(), company_id, months).await?;
    let expenses = get_expenses(client, company_id, months).await?;

    let net_values: Vec<(f64, f64)> = sales.into_iter().zip(expenses.into_iter()).collect();

    Ok(net_values)
}

#[tauri::command]
pub async fn get_documents_stats(
    client: DbState<'_>,
    company_id: i32,
    months: i32,
    document_type: String,
) -> Result<Vec<i64>, QueryError> {
    let month_ranges = get_month_ranges(months);
    let mut monthly_documents = Vec::new();

    for (start_date, end_date) in month_ranges {
        let documents = client
            .document()
            .count(vec![
                document::company_id::equals(company_id),
                document::document_type::equals(document_type.clone()),
                document::issue_date::gte(start_date),
                document::issue_date::lte(end_date),
            ])
            .exec()
            .await
            .unwrap();

        monthly_documents.push(documents);
    }

    Ok(monthly_documents)
}
