// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[allow(warnings, unused)]
mod db;

use db::*;
// use prisma_client_rust::QueryError;
use serde::Deserialize;
use specta::{collect_types, Type};
use std::sync::Arc;
use tauri::State;
use tauri_specta::ts;

type DbState<'a> = State<'a, Arc<PrismaClient>>;

#[tauri::command]
#[specta::specta]
async fn check_db(db: DbState<'_>) -> Result<bool, ()> {
    db.company()
        .count(vec![])
        .exec()
        .await
        .map_err(|_| ())
        .map(|x| x > 0)
}

#[tauri::command]
#[specta::specta]
async fn get_company(db: DbState<'_>, id: Option<i32>) -> Result<Option<company::Data>, ()> {
    println!("{}", id.unwrap_or(68));
    db.company()
        .find_first(vec![company::id::equals(id.unwrap_or(1))])
        .exec()
        .await
        .map_err(|_| ())
}

#[derive(Deserialize, Type)]
struct CreateCompanyData {
    name: String,
}

#[tauri::command]
#[specta::specta]
async fn create_post(db: DbState<'_>, data: CreateCompanyData) -> Result<test::Data, ()> {
    db.test()
        .create(data.name, vec![])
        .exec()
        .await
        .map_err(|_| ())
}

#[tokio::main]
async fn main() {
    let db = PrismaClient::_builder().build().await.unwrap();

    #[cfg(debug_assertions)]
    ts::export(
        collect_types![check_db, get_company, create_post],
        "../src/bindings.ts",
    )
    .unwrap();

    //TODO: enable only in release mode
    // #[cfg(debug_assertions)]
    // db.db_push().await.unwrap();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![check_db, get_company, create_post])
        .manage(Arc::new(db))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
