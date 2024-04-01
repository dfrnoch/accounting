use crate::template;
use crate::DbState;
use prisma_client_rust::QueryError;
use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct Indicies {
    skip: i64,
    take: i64,
}

#[tauri::command]
pub async fn get_templates(
    client: DbState<'_>,
    company_id: i32,
    indicies: Indicies,
) -> Result<Vec<template::Data>, QueryError> {
    debug!("Getting templates");
    let data = client
        .template()
        .find_many(vec![template::company_id::equals(company_id)])
        .skip(0)
        .take(100)
        .exec()
        .await;

    println!("{:?}", data);
    data
}

#[tauri::command]
pub async fn get_template(
    client: DbState<'_>,
    id: i32,
) -> Result<Option<template::Data>, QueryError> {
    client
        .template()
        .find_unique(template::id::equals(id))
        .exec()
        .await
}

// #[derive(Debug)]
// pub enum TemplateType {
//     Invoice,
//     Estimate,
//     Receipt,
// }

// #[derive(Deserialize, Debug)]
// pub struct CreateTemplateData {
//     html: String,
//     company_id: i32,
//     template_type: TemplateType,
// }

// #[tauri::command]
// pub async fn create_template(
//     client: DbState<'_>,
//     data: CreateTemplateData,
// ) -> Result<template::Data, QueryError> {
//     debug!("Creating template {:?}", data);
//     client
//         .template()
//         .create(data.html, data.template_type, data.company_id)
//         .exec()
//         .await
// }
