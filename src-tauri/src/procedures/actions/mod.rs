use self::{
    reducer::{dispatch_action, DirActionSchema, Side},
    types::{
        CopyUiState, DirItem, ListDirRequest, SelectRequest, ToggleExpandRequest,
        ToggleHiddenRequest, UpdatePathRequest,
    },
};
use crate::common::{error::AppErrorIpc, AppStateArc};
use std::path::Path;

/// this module manages the copy-n-paste dir for now
///
pub mod list_dir;
pub mod reducer;
pub mod types;

#[taurpc::procedures(path = "actions.ui", export_to = "../src/bindings/taurpc.ts")]
pub trait UIAction {
    async fn list_dir(params: ListDirRequest) -> Result<Vec<DirItem>, AppErrorIpc>;
    async fn toggle_expand(params: ToggleExpandRequest) -> Result<CopyUiState, AppErrorIpc>;
    async fn toggle_hidden(params: ToggleHiddenRequest) -> Result<CopyUiState, AppErrorIpc>;
    async fn update_cursor_path(params: UpdatePathRequest) -> Result<CopyUiState, AppErrorIpc>;
    async fn forward(params: UpdatePathRequest) -> Result<CopyUiState, AppErrorIpc>;
    async fn back(params: Side) -> Result<CopyUiState, AppErrorIpc>;
    async fn select(params: SelectRequest) -> Result<CopyUiState, AppErrorIpc>;
    async fn swap_sides() -> Result<CopyUiState, AppErrorIpc>;
}

#[taurpc::resolvers]
impl UIAction for AppStateArc {
    async fn list_dir(self, params: ListDirRequest) -> Result<Vec<DirItem>, AppErrorIpc> {
        let ListDirRequest { path, show_hidden } = params;
        let path = Path::new(&path);
        list_dir::list_dir(path, show_hidden)
    }

    async fn toggle_expand(self, params: ToggleExpandRequest) -> Result<CopyUiState, AppErrorIpc> {
        dispatch_action(self, DirActionSchema::ToggleExpand(params)).await
    }

    async fn toggle_hidden(self, params: ToggleHiddenRequest) -> Result<CopyUiState, AppErrorIpc> {
        dispatch_action(self, DirActionSchema::ToggleHidden(params)).await
    }

    async fn update_cursor_path(
        self,
        params: UpdatePathRequest,
    ) -> Result<CopyUiState, AppErrorIpc> {
        dispatch_action(self, DirActionSchema::UpdateCursorPath(params)).await
    }

    async fn forward(self, params: UpdatePathRequest) -> Result<CopyUiState, AppErrorIpc> {
        dispatch_action(self, DirActionSchema::Forward(params)).await
    }

    async fn back(self, params: Side) -> Result<CopyUiState, AppErrorIpc> {
        dispatch_action(self, DirActionSchema::Back(params)).await
    }

    async fn select(self, params: SelectRequest) -> Result<CopyUiState, AppErrorIpc> {
        dispatch_action(self, DirActionSchema::Select(params)).await
    }

    async fn swap_sides(self) -> Result<CopyUiState, AppErrorIpc> {
        dispatch_action(self, DirActionSchema::SwapSides).await
    }
}

#[taurpc::procedures(path = "actions.file", export_to = "../src/bindings/taurpc.ts")]
pub trait FileAction {
    async fn copy() -> Result<(), AppErrorIpc>;
}

#[taurpc::resolvers]
impl FileAction for AppStateArc {
    async fn copy(self) -> Result<(), AppErrorIpc> {
        Ok(())
    }
}
