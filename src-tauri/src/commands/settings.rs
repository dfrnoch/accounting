use crate::settings;
use crate::DbState;
use prisma_client_rust::QueryError;

// pub async fn update_template(client: DbState<'_>, id: i32, html: String) -> Result<(), String> {
//     debug!("Updating template");
//     let data = client
//         .template()
//         .update(template::id::equals(id), vec![template::html::set(html)])
//         .exec()
//         .await;

//     match data {
//         Ok(_) => Ok(()),
//         Err(e) => Err(e.to_string()),
//     }
// }

#[tauri::command]
pub async fn get_settings(
    client: DbState<'_>,
    company_id: i32,
) -> Result<Option<settings::Data>, QueryError> {
    client
        .settings()
        .find_unique(settings::company_id::equals(company_id))
        .with(settings::default_currency::fetch())
        .with(settings::default_template::fetch())
        .exec()
        .await
}
