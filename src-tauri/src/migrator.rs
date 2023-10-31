use log::info;

use crate::{
    error::CoreError,
    prisma::{_prisma::PrismaClient, new_client_with_url},
    util::get_app_dir,
};

pub async fn new_client() -> Result<PrismaClient, CoreError> {
    let appdata_url = get_app_dir().join("app.db");

    log::info!("Connecting to database at {}", appdata_url.display());

    tokio::fs::create_dir_all(appdata_url.parent().unwrap()).await?;

    if !appdata_url.exists() {
        tokio::fs::File::create(appdata_url.clone()).await?;
        info!("Created database at {}", appdata_url.display());
    }

    let client =
        new_client_with_url(&("file:".to_string() + appdata_url.to_str().unwrap())).await?;

    Ok(client)
}
