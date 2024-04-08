use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct Indicies {
    pub skip: i64,
    pub take: i64,
}
