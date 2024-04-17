pub mod copy;
pub mod rename;

use self::copy::copy_wrapper;
use crate::common::{error::AppError, AppStateArc};
use serde::{Deserialize, Serialize};

#[derive(Debug)]
#[taurpc::ipc_type]
pub struct RenameRequest {
    path: String,
    from: String,
    to: String,
}

// TODO: move to own file
#[derive(Debug)]
#[taurpc::ipc_type]
pub struct CopyRequest {
    from: Vec<String>,
    to: String,
    includes_hidden: bool,
    strategy: Option<CopyStrategy>,
    includes_wrapping_dir: bool,
}

#[derive(Debug, Default, Serialize, Deserialize, specta::Type, Clone)]
pub enum CopyStrategy {
    BreathFirst,
    #[default]
    DepthFirst,
}

#[taurpc::procedures(path = "actions.file", export_to = "../src/bindings/taurpc.ts")]
pub trait FileAction {
    async fn copy(params: CopyRequest) -> Result<(), AppError>;
    async fn moves(params: CopyRequest) -> Result<(), AppError>;
    async fn rename(params: RenameRequest) -> Result<(), AppError>;
    async fn bulk_rename(params: Vec<RenameRequest>) -> Result<(), AppError>;
}

#[taurpc::resolvers]
impl FileAction for AppStateArc {
    async fn copy(self, params: CopyRequest) -> Result<(), AppError> {
        let state = self.state.lock().await;

        // let to_path = Path::new(&params.to);
        // if !empty_dir(to_path)? {
        //     return Err(
        //         AppError::GenericError("destination folder is not empty".to_owned()).into(),
        //     );
        // }

        copy_wrapper(params, state.global_config.copy_wrapping_dir).await
    }

    async fn moves(self, params: CopyRequest) -> Result<(), AppError> {
        let state = self.state.lock().await;
        copy_wrapper(params, state.global_config.copy_wrapping_dir).await
    }

    async fn rename(self, params: RenameRequest) -> Result<(), AppError> {
        rename::rename(params)
    }
    async fn bulk_rename(self, _params: Vec<RenameRequest>) -> Result<(), AppError> {
        Err(AppError::Unimplemented)
    }
}
