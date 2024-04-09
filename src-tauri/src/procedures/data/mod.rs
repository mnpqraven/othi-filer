use super::actions::types::CopyUiState;
use crate::common::AppStateArc;

pub mod home;

#[taurpc::procedures(path = "data", export_to = "../src/bindings/taurpc.ts")]
pub trait Data {
    async fn get_state() -> Result<CopyUiState, String>;
}

#[taurpc::resolvers]
impl Data for AppStateArc {
    async fn get_state(self) -> Result<CopyUiState, String> {
        let state = self.state.lock().await;
        Ok(state.clone())
    }
}
