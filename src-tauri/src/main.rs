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

mod commands;
mod error;
mod migrator;
mod types;
mod util;

// use specta::{Type, TypeCollection};
// use tauri_specta::*;

use migrator::new_client;
use prisma::*;
use std::sync::Arc;
use tauri::{Emitter, Manager, State};

#[cfg(target_os = "macos")]
use window_ext::{ToolbarThickness, WindowExt};
#[cfg(target_os = "macos")]
use window_vibrancy::NSVisualEffectMaterial;

#[cfg(target_os = "windows")]
use window_vibrancy::apply_blur;
#[cfg(target_os = "macos")]
use window_vibrancy::apply_vibrancy;

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

type DbState<'a> = State<'a, Arc<PrismaClient>>;

#[tokio::main]
async fn main() {
    std::env::set_var("RUST_LOG", "trace");
    pretty_env_logger::init();

    let client = new_client().await.unwrap();

    // let specta_handler = {
    //     let builder = tauri_specta::ts::builder()
    //         .commands(tauri_specta::collect_commands![commands::db::check_db])
    //         .header("// @ts-nocheck");

    //     #[cfg(debug_assertions)]
    //     let builder = builder.path("../src/bindings.ts");

    //     builder.build().unwrap()
    // };

    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);
            app.emit("single-instance", Payload { args: argv, cwd })
                .unwrap();
        }))
        // .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "macos")]
            window.set_thickness(ToolbarThickness::Thick);

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_blur(&window, None)
                .expect("Unsupported platform! 'apply blur' is only supported on Windows");

            Ok(())
        })
        // .invoke_handler(specta_handler)
        .invoke_handler(tauri::generate_handler![
            commands::db::check_db,
            commands::db::migrate_and_populate,
            commands::company::get_company,
            commands::company::validate_company_password,
            commands::company::create_company,
            commands::company::get_companies,
            commands::company::delete_company,
            commands::company::update_company,
            commands::document::get_documents,
            commands::document::get_document,
            commands::document::create_document,
            commands::document::get_document_count,
            commands::document::update_document,
            commands::document::delete_document,
            commands::template::get_templates,
            commands::template::get_template,
            commands::template::create_template,
            commands::template::update_template,
            commands::template::delete_template,
            commands::client::get_clients,
            commands::client::get_client,
            commands::client::update_client,
            commands::client::create_client,
            commands::client::delete_client,
            commands::stats::get_sales,
            commands::stats::get_expenses,
            commands::stats::get_documents_stats,
            commands::stats::get_sales_and_expenses,
            commands::other::get_model_count,
            commands::other::get_print_document,
            commands::currency::get_currencies,
            commands::currency::get_currency,
            commands::currency::create_currency,
            commands::currency::update_currency,
            commands::currency::delete_currency,
            commands::settings::get_settings,
            commands::settings::update_settings
        ])
        .manage(Arc::new(client))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
