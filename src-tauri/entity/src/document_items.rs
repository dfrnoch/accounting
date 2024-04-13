use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "document_items")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub document_id: i32,
    pub description: String,
    pub quantity: i32,
    pub price: f32,
    pub tax: f32,
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Document,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Document => Entity::belongs_to(super::document::Entity)
                .from(Column::DocumentId)
                .to(super::document::Column::Id)
                .into(),
        }
    }
}

impl ActiveModelBehavior for ActiveModel {}
