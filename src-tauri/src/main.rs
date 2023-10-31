// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

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
use std::sync::Arc;
use tauri::{Manager, State, Theme};
use tauri_plugin_autostart::MacosLauncher;
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

    match company_count {
        Ok(_) => {
            // Query succeeded, return 200
            Ok(200)
        }
        Err(_) => {
            // Query failed, return 400
            Ok(400)
        }
    }
}

#[tauri::command]
async fn migrate_and_populate(client: DbState<'_>) -> CommandResult<()> {
    #[cfg(debug_assertions)]
    client._db_push().await?;

    #[cfg(not(debug_assertions))]
    client._migrate_deploy().unwrap();

    Ok(())
}

// #[specta::specta]
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

#[derive(Deserialize)]
struct CreateCompanyData {
    name: String,
}

// #[specta::specta]
#[tauri::command]
async fn create_post(client: DbState<'_>, data: CreateCompanyData) -> Result<test::Data, ()> {
    client
        .test()
        .create(data.name, vec![])
        .exec()
        .await
        .map_err(|_| ())
}

#[tokio::main]
async fn main() {
    std::env::set_var("RUST_LOG", "debug");
    pretty_env_logger::init();

    let client = new_client().await.unwrap();

    // #[cfg(debug_assertions)]
    // ts::export(
    //     collect_types![check_db, get_company, create_post],
    //     "../src/bindings.ts",
    // )
    // .unwrap();

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
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            let window = app.get_window("main").unwrap();
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
            create_post,
        ])
        .manage(Arc::new(client))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
