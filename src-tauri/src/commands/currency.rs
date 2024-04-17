use crate::company;
use crate::currency;
use crate::types::Indicies;
use crate::DbState;
use prisma_client_rust::QueryError;
use serde::Deserialize;

#[tauri::command]
pub async fn get_currencies(
    client: DbState<'_>,
    company_id: i32,
    indicies: Indicies,
) -> Result<Vec<currency::Data>, QueryError> {
    debug!("Getting currencies");
    let data = client
        .currency()
        .find_many(vec![currency::company_id::equals(company_id)])
        .skip(indicies.skip)
        .take(indicies.take)
        .exec()
        .await;

    println!("{:?}", data);
    data
}

#[tauri::command]
pub async fn get_currency(
    client: DbState<'_>,
    id: String,
) -> Result<Option<currency::Data>, QueryError> {
    client
        .currency()
        .find_first(vec![currency::id::equals(id)])
        .exec()
        .await
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CurrencyData {
    name: String,
    code: String,
    rate: f64,
}
#[tauri::command]
pub async fn create_currency(
    client: DbState<'_>,
    company_id: i32,
    data: CurrencyData,
) -> Result<(), String> {
    debug!("Creating currency");
    let data = client
        .currency()
        .create(
            data.name,
            data.code,
            data.rate,
            company::id::equals(company_id),
            vec![],
        )
        .exec()
        .await;

    match data {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn update_currency(
    client: DbState<'_>,
    id: String,
    data: CurrencyData,
) -> Result<(), String> {
    debug!("Updating currency");
    let data = client
        .currency()
        .update(
            currency::id::equals(id),
            vec![
                currency::name::set(data.name),
                currency::code::set(data.code),
                currency::rate::set(data.rate),
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
pub async fn delete_currency(client: DbState<'_>, id: String) -> Result<(), String> {
    debug!("Deleting currency");
    let data = client
        .currency()
        .delete(currency::id::equals(id))
        .exec()
        .await;

    match data {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
