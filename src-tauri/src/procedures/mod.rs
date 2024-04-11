#![allow(non_snake_case)]

use self::{
    actions::{file::FileAction, ui::UIAction},
    data::Data,
};
use crate::common::AppStateArc;
use taurpc::Router;

pub mod actions;
pub mod data;

pub async fn create_router() -> Result<Router, String> {
    let initial_state = AppStateArc::new().await?;
    Ok(Router::new()
        .merge(Data::into_handler(initial_state.clone()))
        .merge(UIAction::into_handler(initial_state.clone()))
        .merge(FileAction::into_handler(initial_state)))
}
