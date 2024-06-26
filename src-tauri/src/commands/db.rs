use crate::error::CommandResult;
use crate::DbState;

#[tauri::command]
// #[specta::specta]
pub async fn check_db(client: DbState<'_>) -> CommandResult<i16> {
    let company_count = client.company().count(vec![]).exec().await;

    info!("Checking DB");
    match company_count {
        Ok(_) => {
            if company_count.unwrap() == 0 {
                return Ok(400);
            }
            return Ok(200);
        }
        Err(_) => Ok(400),
    }
}

#[tauri::command]
// #[specta::specta]
pub async fn migrate_and_populate(client: DbState<'_>) -> CommandResult<()> {
    #[cfg(not(debug_assertions))]
    client._db_push().await?;

    #[cfg(not(debug_assertions))]
    client._migrate_deploy().await.unwrap();

    Ok(())
}
