// client.rs
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "clients")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub client_type: String,
    pub name: String,
    pub cin: String,
    pub vat_id: Option<String>,
    pub address: String,
    pub city: String,
    pub zip: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub company_id: i32,
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Documents,
    Company,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Documents => Entity::has_many(super::document::Entity).into(),
            Self::Company => Entity::belongs_to(super::company::Entity)
                .from(Column::CompanyId)
                .to(super::company::Column::Id)
                .into(),
        }
    }
}

impl ActiveModelBehavior for ActiveModel {}
