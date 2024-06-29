use crate::company;
use crate::template;
// use crate::template::template_type;
use crate::types::Indicies;
use crate::DbState;
use prisma_client_rust::QueryError;
use serde::Deserialize;

#[tauri::command]
pub async fn get_templates(
    client: DbState<'_>,
    company_id: i32,
    indicies: Indicies,
    template_type: Option<String>,
) -> Result<Vec<template::Data>, QueryError> {
    debug!("Getting templates");
    let mut conditions = vec![template::company_id::equals(company_id)];

    if let Some(template_type) = template_type {
        conditions.push(template::template_type::equals(template_type));
    }

    let data = client
        .template()
        .find_many(conditions)
        .skip(indicies.skip)
        .take(indicies.take)
        .exec()
        .await;

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

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CreateTemplateData {
    html: String,
    name: String,
    template_type: String,
}

#[tauri::command]
pub async fn create_template(
    client: DbState<'_>,
    company_id: i32,
    data: CreateTemplateData,
) -> Result<(), String> {
    debug!("Creating template");
    let data = client
        .template()
        .create(
            data.name,
            data.html,
            company::id::equals(company_id),
            vec![template::template_type::set(data.template_type)],
        )
        .exec()
        .await;

    match data {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn update_template(
    client: DbState<'_>,
    id: i32,
    data: CreateTemplateData,
) -> Result<(), String> {
    debug!("Updating template");
    let data = client
        .template()
        .update(
            template::id::equals(id),
            vec![
                template::html::set(data.html),
                template::name::set(data.name),
                template::template_type::set(data.template_type),
            ],
        )
        .exec()
        .await;

    match data {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

// #[derive(Debug)]
// pub enum TemplateType {
//     Invoice,
//     Estimate,
//     Receipt,
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

#[tauri::command]
pub async fn delete_template(client: DbState<'_>, id: i32) -> Result<(), String> {
    debug!("Deleting template");
    let data = client
        .template()
        .delete(template::id::equals(id))
        .exec()
        .await;

    match data {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
