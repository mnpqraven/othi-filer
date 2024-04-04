#![allow(non_snake_case)]
#![allow(clippy::incompatible_msrv)]

use taurpc::Router;

use self::{
    actions::{DirAction, DirActionImpl},
    data::{Data, DataImpl},
};

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

pub fn create_router() -> Router {
    Router::new()
        .merge(ApiImpl.into_handler())
        .merge(DirActionImpl.into_handler())
        .merge(DataImpl.into_handler())
}
