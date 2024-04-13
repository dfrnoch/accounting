// document.rs
use chrono::prelude::*;
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "documents")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub number: String,
    pub document_type: String,
    pub client_id: i32,
    pub template_id: i32,
    pub currency: String,
    pub issue_date: DateTime<Utc>,
    pub tax_date: DateTime<Utc>,
    pub due_date: DateTime<Utc>,
    pub status: String,
    pub company_id: i32,
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Client,
    Template,
    Items,
    Company,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Client => Entity::belongs_to(super::client::Entity)
                .from(Column::ClientId)
                .to(super::client::Column::Id)
                .into(),
            Self::Template => Entity::belongs_to(super::template::Entity)
                .from(Column::TemplateId)
                .to(super::template::Column::Id)
                .into(),
            Self::Items => Entity::has_many(super::document_item::Entity).into(),
            Self::Company => Entity::belongs_to(super::company::Entity)
                .from(Column::CompanyId)
                .to(super::company::Column::Id)
                .into(),
        }
    }
}

impl ActiveModelBehavior for ActiveModel {}
