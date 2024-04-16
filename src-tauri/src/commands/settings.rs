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

#[tauri::command]
pub async fn update_settings(
    client: DbState<'_>,
    company_id: i32,
    data: settings::Data,
) -> Result<(), QueryError> {
    debug!("Updating settings");
    let data = client
        .settings()
        .update(
            settings::company_id::equals(company_id),
            vec![
                settings::default_currency_id::set(data.default_currency_id),
                settings::default_template_id::set(data.default_template_id),
            ],
        )
        .exec()
        .await;

    match data {
        Ok(_) => Ok(()),
        Err(e) => Err(e),
    }
}

pub async fn update_count(client: DbState<'_>, company_id: i32, model: &str) -> () {
    let count = client
        .settings()
        .find_unique(settings::company_id::equals(company_id))
        .exec()
        .await
        .unwrap();

    match model {
        "Invoice" => {
            let _ = client
                .settings()
                .update(
                    settings::company_id::equals(company_id),
                    vec![settings::invoice_counter::set(
                        count.unwrap().invoice_counter + 1,
                    )],
                )
                .exec()
                .await;
        }
        "Proforma" => {
            let _ = client
                .settings()
                .update(
                    settings::company_id::equals(company_id),
                    vec![settings::proforma_counter::set(
                        count.unwrap().proforma_counter + 1,
                    )],
                )
                .exec()
                .await;
        }
        "Receive" => {
            let _ = client
                .settings()
                .update(
                    settings::company_id::equals(company_id),
                    vec![settings::receive_counter::set(
                        count.unwrap().receive_counter + 1,
                    )],
                )
                .exec()
                .await;
        }
        _ => (),
    }
}
