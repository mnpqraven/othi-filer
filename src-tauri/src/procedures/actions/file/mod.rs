use crate::common::{error::AppErrorIpc, AppStateArc};

use super::types::DirItem;

// TODO: move to own file
#[taurpc::ipc_type]
pub struct CopyRequest {
    from: Vec<DirItem>,
    to: String,
    includes_hidden: bool,
}

#[taurpc::procedures(path = "actions.file", export_to = "../src/bindings/taurpc.ts")]
pub trait FileAction {
    async fn copy(params: CopyRequest) -> Result<(), AppErrorIpc>;
}

#[taurpc::resolvers]
impl FileAction for AppStateArc {
    async fn copy(self, _params: CopyRequest) -> Result<(), AppErrorIpc> {
        Ok(())
    }
}
