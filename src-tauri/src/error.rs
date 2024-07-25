use prisma_client_rust::migrations::DbPushError;
use serde::{Serialize, Serializer};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum CoreError {
    #[error("Prisma New Client Error")]
    PrismaNewClientError(#[from] prisma_client_rust::NewClientError),
    #[error("Prisma Query Error")]
    PrismaQueryError(#[from] prisma_client_rust::QueryError),
    #[error("Tokio IO Error")]
    TokioError(#[from] tokio::io::Error),
    #[error("Tokio Join Error")]
    TokioJoinError(#[from] tokio::task::JoinError),
    #[error("Db Push Error")]
    DbPushError(#[from] prisma_client_rust::migrations::DbPushError),
    #[error("Password mismatch")]
    PasswordMismatch,
    #[error("Old password required")]
    OldPasswordRequired,
    #[error("Password hashing error: {0}")]
    PasswordHashingError(String),
    #[error("Company not found")]
    CompanyNotFound,
}

impl Serialize for CoreError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

pub type CommandResult<T, E = CoreError> = anyhow::Result<T, E>;
