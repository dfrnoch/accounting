use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "settings")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub company_id: i32,
    pub currency: String,
    pub tax: f32,
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Company,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Company => Entity::belongs_to(super::company::Entity)
                .from(Column::CompanyId)
                .to(super::company::Column::Id)
                .into(),
        }
    }
}

impl ActiveModelBehavior for ActiveModel {}
