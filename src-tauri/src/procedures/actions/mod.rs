use self::{
    list_dir::list_dir,
    reducer::{dispatch_action, DirActionSchema, Side},
    types::{
        CopyUiState, DirActionPanel, DirItem, ListDirRequest, SelectRequest, ToggleExpandRequest,
        ToggleHiddenRequest, UpdatePathRequest,
    },
};
use super::data::home::home_dir;
use crate::common::{error::AppErrorIpc, AppStateArc};
use std::path::Path;

/// this module manages the copy-n-paste dir for now
///
pub mod list_dir;
pub mod reducer;
pub mod types;

#[taurpc::procedures(path = "actions", export_to = "../src/bindings/taurpc.ts")]
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

impl CopyUiState {
    pub async fn new() -> Result<Self, String> {
        let home_path = home_dir().unwrap();
        let default_panel: DirActionPanel = DirActionPanel {
            root_path: home_path.clone(),
            current_pointer_path: home_path.clone(),
            show_hidden: false,
            items: list_dir(&home_path, false).unwrap(),
            selected_items: vec![],
            expanded_paths: vec![],
        };

        Ok(Self {
            left: default_panel.clone(),
            right: default_panel.clone(),
        })
    }
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
