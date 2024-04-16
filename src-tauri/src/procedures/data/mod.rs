use self::home::get_logical_drives;
use super::actions::types::CopyUiState;
use crate::common::{error::AppError, AppStateArc};

pub mod home;

#[taurpc::procedures(path = "data", export_to = "../src/bindings/taurpc.ts")]
pub trait Data {
    async fn get_state() -> Result<CopyUiState, AppError>;
    async fn get_windows_drives() -> Result<Vec<String>, AppError>;
}

#[taurpc::resolvers]
impl Data for AppStateArc {
    async fn get_state(self) -> Result<CopyUiState, AppError> {
        let state = self.state.lock().await;
        Ok(state.clone())
    }
    async fn get_windows_drives(self) -> Result<Vec<String>, AppError> {
        get_logical_drives()
    }
}
