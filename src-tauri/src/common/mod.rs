use crate::procedures::actions::types::CopyUiState;
use std::sync::Arc;
use tokio::sync::Mutex;

pub mod error;

#[derive(Clone)]
pub struct AppStateArc {
    pub state: Arc<Mutex<CopyUiState>>,
}
impl AppStateArc {
    pub async fn new() -> Result<Self, String> {
        let initial_state = CopyUiState::new().await?;
        Ok(Self {
            state: Arc::new(Mutex::new(initial_state)),
        })
    }
}
