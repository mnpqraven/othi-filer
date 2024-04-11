pub mod copy;

use self::copy::copy_wrapper;
use crate::{
    common::{
        error::{AppError, AppErrorIpc},
        AppStateArc,
    },
    utils::metadata::empty_dir,
};
use serde::{Deserialize, Serialize};
use std::path::Path;

// TODO: move to own file
#[taurpc::ipc_type]
pub struct CopyRequest {
    from: Vec<String>,
    to: String,
    includes_hidden: bool,
    strategy: Option<CopyStrategy>,
    includes_wrapping_dir: bool,
}

#[derive(Serialize, Deserialize, specta::Type, Clone)]
pub enum CopyStrategy {
    BreathFirst,
    DepthFirst,
}

#[taurpc::procedures(path = "actions.file", export_to = "../src/bindings/taurpc.ts")]
pub trait FileAction {
    async fn copy(params: CopyRequest) -> Result<(), AppErrorIpc>;
    async fn moves(params: CopyRequest) -> Result<(), AppErrorIpc>;
}

#[taurpc::resolvers]
impl FileAction for AppStateArc {
    async fn copy(self, params: CopyRequest) -> Result<(), AppErrorIpc> {
        let to_path = Path::new(&params.to);

        if !empty_dir(to_path)? {
            return Err(
                AppError::GenericError("destination folder is not empty".to_owned()).into(),
            );
        }

        copy_wrapper(params, false).await
    }

    async fn moves(self, params: CopyRequest) -> Result<(), AppErrorIpc> {
        copy_wrapper(params, true).await
    }
}
