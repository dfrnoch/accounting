use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "companies")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub cin: String,
    pub vat_id: Option<String>,
    pub address: String,
    pub city: String,
    pub zip: String,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub web: Option<String>,
    pub bank_account: Option<String>,
    pub bank_code: Option<String>,
    pub bank_name: Option<String>,
    pub bank_iban: Option<String>,
    pub invoice_prefix: String,
    pub invoice_counter: i32,
    pub proforma_prefix: String,
    pub proforma_counter: i32,
    pub recieve_prefix: String,
    pub recieve_counter: i32,
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Documents,
    Templates,
    Clients,
    Settings,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Documents => Entity::has_many(super::document::Entity).into(),
            Self::Templates => Entity::has_many(super::template::Entity).into(),
            Self::Clients => Entity::has_many(super::client::Entity).into(),
            Self::Settings => Entity::has_one(super::settings::Entity).into(),
        }
    }
}

impl ActiveModelBehavior for ActiveModel {}