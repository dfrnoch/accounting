use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "templates")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub html: String,
    pub template_type: String,
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
