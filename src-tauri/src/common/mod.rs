use crate::procedures::actions::types::CopyUiState;
use std::sync::Arc;
use tokio::sync::Mutex;

use self::error::AppError;

pub mod error;
pub mod os;

#[derive(Clone)]
pub struct AppStateArc {
    pub state: Arc<Mutex<CopyUiState>>,
}
impl AppStateArc {
    pub async fn new() -> Result<Self, AppError> {
        let initial_state = CopyUiState::new().await?;
        Ok(Self {
            state: Arc::new(Mutex::new(initial_state)),
        })
    }
}
