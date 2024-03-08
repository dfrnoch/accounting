// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

extern crate pretty_env_logger;
#[macro_use]
extern crate log;

#[cfg(target_os = "macos")]
extern crate objc;

#[cfg(target_os = "macos")]
mod window_ext;

#[allow(warnings, unused)]
mod prisma;

mod error;
mod migrator;
mod util;

use error::{CommandResult, CoreError};
use migrator::new_client;
use prisma::*;
use prisma_client_rust::QueryError;
use serde::Deserialize;
// use specta::collect_types;
use std::sync::Arc;
use tauri::{Manager, State, Theme};
use tauri_plugin_autostart::MacosLauncher;
// use tauri_specta::ts;
use window_ext::{ToolbarThickness, WindowExt};
use window_vibrancy::NSVisualEffectMaterial;

#[cfg(target_os = "windows")]
use window_vibrancy::apply_mica;
#[cfg(target_os = "macos")]
use window_vibrancy::apply_vibrancy;

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

type DbState<'a> = State<'a, Arc<PrismaClient>>;

// #[specta::specta]
#[tauri::command]
async fn check_db(client: DbState<'_>) -> CommandResult<i16> {
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

// #[specta::specta]
#[tauri::command]
async fn migrate_and_populate(client: DbState<'_>) -> CommandResult<()> {
    #[cfg(debug_assertions)]
    client._db_push().await?;

    #[cfg(not(debug_assertions))]
    client._migrate_deploy().unwrap();

    Ok(())
}

// #[tauri::command]
// pub async fn fetch(url: String) -> Result<serde_json::Value, String> {
//     // call map_err to convert the error to a string
//     let resp = reqwest::get(&url).await.map_err(|e| e.to_string())?;
//     Ok(resp)
// }

// #[specta::specta]
#[tauri::command]
async fn get_invoices(
    client: DbState<'_>,
    company_id: Option<i32>,
) -> Result<Vec<invoice::Data>, QueryError> {
    client
        .invoice()
        .find_many(vec![invoice::company_id::equals(company_id.unwrap_or(1))])
        .exec()
        .await
}

#[tauri::command]
async fn get_company(
    client: DbState<'_>,
    id: Option<i32>,
) -> Result<Option<company::Data>, QueryError> {
    client
        .company()
        .find_first(vec![company::id::equals(id.unwrap_or(1))])
        .exec()
        .await
}
// export type CreateCompanyData = {
//   name: string;
//   cin: string;
//   vatId: string;
//   streetAddress: string;
//   city: string;
//   postalCode: string;
//   phoneNumber: string;
// };
#[derive(Deserialize, Debug)]
struct CreateCompanyData {
    name: String,
    cin: String,
    vat_id: Option<String>,
    // street_adress: String,
    city: String,
    // postal_code: String,
    phone_number: Option<String>,
    email: Option<String>,
}

// #[specta::specta]

#[tauri::command]
async fn create_company(client: DbState<'_>, data: CreateCompanyData) -> Result<company::Data, ()> {
    debug!("Creating company {:?}", data);
    client
        .company()
        .create(
            data.name,
            data.cin,
            "cus".to_string(),
            data.city,
            "aaaa".to_string(),
            vec![
                company::vat_id::set(data.vat_id),
                company::phone_number::set(data.phone_number),
            ],
        )
        .exec()
        .await
        .map_err(|_| ())
}

#[tokio::main]
async fn main() {
    std::env::set_var("RUST_LOG", "trace");
    pretty_env_logger::init();

    let client = new_client().await.unwrap();

    // let specta_builder = {
    //     let specta_builder = tauri_specta::ts::builder().commands(tauri_specta::collect_commands![
    //         get_company,
    //         create_company,
    //         migrate_and_populate,
    //         check_db
    //     ]);

    //     #[cfg(debug_assertions)] // <- Only export on non-release builds
    //     let specta_builder = specta_builder.path("../src/bindings.ts");

    //     specta_builder.into_plugin()
    // };

    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]),
        ))
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);
            app.emit("single-instance", Payload { args: argv, cwd })
                .unwrap();
        }))
        // .plugin(specta_builder)
        // .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        // .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.set_thickness(ToolbarThickness::Thick);

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_mica(&window, Some(true))
                .expect("Unsupported platform! 'apply_mica' is only supported on Windows");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            check_db,
            get_company,
            migrate_and_populate,
            create_company,
            get_invoices,
            // fetch,
        ])
        .manage(Arc::new(client))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
