#![allow(non_snake_case)]

use self::actions::UIAction;
use self::data::Data;
use crate::common::AppStateArc;
use taurpc::Router;

pub mod actions;
pub mod data;

// Root procedures
// NOTE: we need exactly 1 root else the whole router breaks
#[taurpc::procedures]
pub trait Api {
    async fn hello_world();
}

#[derive(Clone)]
pub struct ApiImpl;

#[taurpc::resolvers]
impl Api for ApiImpl {
    async fn hello_world(self) {
        println!("Hello world");
    }
}

pub async fn create_router() -> Result<Router, String> {
    let initial_state = AppStateArc::new().await?;
    Ok(Router::new()
        .merge(ApiImpl.into_handler())
        .merge(Data::into_handler(initial_state.clone()))
        .merge(UIAction::into_handler(initial_state)))
}
