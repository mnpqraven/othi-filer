use super::actions::types::CopyUiState;
use crate::common::{error::AppError, AppStateArc};

pub mod home;

#[taurpc::procedures(path = "data", export_to = "../src/bindings/taurpc.ts")]
pub trait Data {
    async fn get_state() -> Result<CopyUiState, AppError>;
}

#[taurpc::resolvers]
impl Data for AppStateArc {
    async fn get_state(self) -> Result<CopyUiState, AppError> {
        let state = self.state.lock().await;
        Ok(state.clone())
    }
}
