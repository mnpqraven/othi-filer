use super::list_dir::list_dir;
use super::reducer::{get_panel, Side};
use super::types::{
    CopyUiState, DirItem, ListDirRequest, SelectRequest, ToggleExpandRequest, ToggleHiddenRequest,
    UpdatePathRequest,
};
use crate::common::{error::AppError, AppStateArc};
use crate::procedures::actions::reducer::{dispatch_action, DirActionSchema};
use std::path::Path;

#[taurpc::procedures(path = "actions.ui", export_to = "../src/bindings/taurpc.ts")]
pub trait UIAction {
    async fn list_dir(params: ListDirRequest) -> Result<Vec<DirItem>, AppError>;
    async fn toggle_expand(params: ToggleExpandRequest) -> Result<CopyUiState, AppError>;
    async fn toggle_hidden(params: ToggleHiddenRequest) -> Result<CopyUiState, AppError>;
    async fn update_cursor_path(params: UpdatePathRequest) -> Result<CopyUiState, AppError>;
    async fn forward(params: UpdatePathRequest) -> Result<CopyUiState, AppError>;
    async fn back(params: Side) -> Result<CopyUiState, AppError>;
    async fn select(params: super::types::SelectRequest) -> Result<CopyUiState, AppError>;
    async fn swap_sides() -> Result<CopyUiState, AppError>;
    async fn set_copy_wrapping_dir(to: Option<bool>) -> Result<CopyUiState, AppError>;
}

#[taurpc::resolvers]
impl UIAction for AppStateArc {
    async fn list_dir(self, params: ListDirRequest) -> Result<Vec<DirItem>, AppError> {
        let ListDirRequest {
            path,
            show_hidden,
            side,
        } = params;
        let path = Path::new(&path);

        let state = self.state.lock().await;
        let panel = get_panel(&state, side);
        list_dir(path, show_hidden, Some(&panel.current_pointer_path))
    }

    async fn toggle_expand(self, params: ToggleExpandRequest) -> Result<CopyUiState, AppError> {
        dispatch_action(self, DirActionSchema::ToggleExpand(params)).await
    }

    async fn toggle_hidden(self, params: ToggleHiddenRequest) -> Result<CopyUiState, AppError> {
        dispatch_action(self, DirActionSchema::ToggleHidden(params)).await
    }

    async fn update_cursor_path(self, params: UpdatePathRequest) -> Result<CopyUiState, AppError> {
        dispatch_action(self, DirActionSchema::UpdateCursorPath(params)).await
    }

    async fn forward(self, params: UpdatePathRequest) -> Result<CopyUiState, AppError> {
        dispatch_action(self, DirActionSchema::Forward(params)).await
    }

    async fn back(self, params: Side) -> Result<CopyUiState, AppError> {
        dispatch_action(self, DirActionSchema::Back(params)).await
    }

    async fn select(self, params: SelectRequest) -> Result<CopyUiState, AppError> {
        dispatch_action(self, DirActionSchema::Select(params)).await
    }

    async fn swap_sides(self) -> Result<CopyUiState, AppError> {
        dispatch_action(self, DirActionSchema::SwapSides).await
    }
    async fn set_copy_wrapping_dir(self, to: Option<bool>) -> Result<CopyUiState, AppError> {
        dispatch_action(self, DirActionSchema::SetCopyWrapping(to)).await
    }
}
